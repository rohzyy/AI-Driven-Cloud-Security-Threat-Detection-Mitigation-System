/**
 * Enterprise Dashboard - Backend Integration
 * Connects 1code.html to the Flask threat detection API
 */

const API_BASE = window.location.origin;

/**
 * Generate random malicious IP address
 */
function generateRandomIP() {
    // Generate IPs from known malicious ranges
    const ranges = [
        () => `45.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        () => `91.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        () => `185.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        () => `103.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    ];
    return ranges[Math.floor(Math.random() * ranges.length)]();
}

// Heavy Attack Payload Presets (IPs will be randomized on each attack)
const ATTACK_PAYLOADS = {
    dos: {
        name: "DoS Flood Attack",
        payload: {
            src_ip: "45.142.120.5", // Will be randomized
            rate: 850,
            sbytes: 65000,
            spkts: 5000,
            dpkts: 5,
            dbytes: 200,
            dur: 0.02,
            sttl: 64,
            dttl: 254,
            sload: 12000,
            dload: 100,
            protocol: "udp",
            state: "INT",
            service: "http"
        }
    },
    exploit: {
        name: "SQL Injection / Exploit",
        payload: {
            src_ip: "91.215.85.224", // Will be randomized
            rate: 120,
            sbytes: 85000,
            spkts: 250,
            dpkts: 30,
            dbytes: 1500,
            dur: 5.2,
            ct_srv_src: 25,
            sttl: 128,
            dttl: 254,
            protocol: "tcp",
            state: "CON",
            service: "http"
        }
    },
    recon: {
        name: "Port Scan / Reconnaissance",
        payload: {
            src_ip: "185.220.101.45", // Will be randomized
            rate: 500,
            sbytes: 40,
            spkts: 1,
            dpkts: 0,
            dbytes: 0,
            dur: 0.001,
            ct_dst_ltm: 255,
            sttl: 254,
            dttl: 0,
            protocol: "tcp",
            state: "REQ",
            service: "-"
        }
    },
    backdoor: {
        name: "Backdoor / RAT Detection",
        payload: {
            src_ip: "103.15.28.215", // Will be randomized
            rate: 45,
            sbytes: 125000,
            spkts: 180,
            dpkts: 150,
            dbytes: 98000,
            dur: 120.5,
            ct_srv_src: 1,
            ct_dst_ltm: 1,
            sttl: 64,
            dttl: 64,
            protocol: "tcp",
            state: "FIN",
            service: "-"
        }
    }
};

let currentAttackIndex = 0;
let autoAttackInterval = null;
let totalDetections = 0;
let criticalThreats = 0;

/**
 * Send heavy attack payload to backend
 */
async function sendHeavyPayload(attackType) {
    const attack = ATTACK_PAYLOADS[attackType];
    if (!attack) return;

    // Clone the payload and use a RANDOM IP each time to avoid blocking
    const payloadCopy = { ...attack.payload };
    payloadCopy.src_ip = generateRandomIP();

    console.log(`🚀 Sending ${attack.name} from ${payloadCopy.src_ip}...`);

    try {
        const response = await fetch(`${API_BASE}/api/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadCopy)
        });

        const result = await response.json();

        // Update stats
        totalDetections++;

        if (result.status === 'THREAT') {
            criticalThreats++;
            showThreatNotification(result);
            updateThreatStats();
            console.log(`🚨 THREAT DETECTED: ${result.attack_type} (${(result.confidence * 100).toFixed(1)}% confidence)`);
            console.log(`🔒 Action: ${result.mitigation.action} on ${payloadCopy.src_ip}`);
        } else if (result.status === 'BLOCKED') {
            console.log(`⚠️ IP was already blocked`);
        } else {
            console.log(`✅ Traffic classified as normal`);
        }

        return result;
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

/**
 * Show threat notification on the dashboard
 */
function showThreatNotification(threat) {
    // Find AI Insights panel and update it
    const insightsPanel = document.querySelector('.space-y-6');
    if (insightsPanel) {
        const alertHtml = `
            <div class="flex justify-between animate-pulse">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-neon-red/10 text-neon-red uppercase">Critical</span>
                <span class="text-[10px] text-slate-500">Just now</span>
            </div>
            <h3 class="text-sm font-bold text-slate-200">${threat.attack_type} Attack Detected</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
                AI identified a <span class="text-primary">${threat.attack_type}</span> pattern with 
                <span class="text-neon-red">${(threat.confidence * 100).toFixed(1)}%</span> confidence. 
                Mitigation: <span class="text-neon-amber">${threat.mitigation.action}</span>.
            </p>
        `;

        // Add to top of insights
        const firstInsight = insightsPanel.querySelector('.space-y-3');
        if (firstInsight) {
            const tempDiv = document.createElement('div');
            tempDiv.className = 'space-y-3 border-2 border-neon-red/30 p-4 rounded-lg';
            tempDiv.innerHTML = alertHtml;
            insightsPanel.insertBefore(tempDiv, firstInsight);

            // Remove after 10 seconds
            setTimeout(() => tempDiv.remove(), 10000);
        }
    }
}

/**
 * Update threat statistics on dashboard
 */
function updateThreatStats() {
    // Update AI Threat Score
    const threatScoreEl = document.querySelector('.text-4xl.font-bold.tracking-tighter.text-neon-amber');
    if (threatScoreEl) {
        const currentScore = parseInt(threatScoreEl.textContent);
        const newScore = Math.min(100, currentScore + Math.floor(Math.random() * 5));
        threatScoreEl.innerHTML = `${newScore}<span class="text-lg text-slate-500">/100</span>`;

        // Update progress bar
        const progressBar = threatScoreEl.closest('.bg-surface-dark').querySelector('.bg-neon-amber');
        if (progressBar) {
            progressBar.style.width = `${newScore}%`;
        }
    }

    // Update Total Alerts
    const alertsEl = document.querySelector('.text-4xl.font-bold.tracking-tighter.text-white');
    if (alertsEl) {
        const current = parseInt(alertsEl.textContent.replace(',', ''));
        alertsEl.textContent = (current + 1).toLocaleString();
    }

    // Update Active Mitigations
    const mitigationsEl = document.querySelector('.text-4xl.font-bold.tracking-tighter.text-neon-green');
    if (mitigationsEl) {
        const current = parseInt(mitigationsEl.textContent);
        mitigationsEl.textContent = (current + 1) + '';
    }
}

/**
 * Auto-cycle through attack types
 */
function startAutoAttack() {
    if (autoAttackInterval) {
        stopAutoAttack();
        return;
    }

    const attackTypes = Object.keys(ATTACK_PAYLOADS);

    // Send first attack immediately
    sendHeavyPayload(attackTypes[currentAttackIndex]);

    // Continue every 3 seconds
    autoAttackInterval = setInterval(() => {
        currentAttackIndex = (currentAttackIndex + 1) % attackTypes.length;
        sendHeavyPayload(attackTypes[currentAttackIndex]);
    }, 3000);

    console.log('⚡ Auto-attack mode ENABLED');
}

function stopAutoAttack() {
    if (autoAttackInterval) {
        clearInterval(autoAttackInterval);
        autoAttackInterval = null;
        console.log('🛑 Auto-attack mode STOPPED');
    }
}

/**
 * Refresh live events feed
 */
async function refreshLiveFeed() {
    try {
        const response = await fetch(`${API_BASE}/api/logs/threat?lines=4`);
        const data = await response.json();

        const feed = document.querySelector('.space-y-4.font-mono');
        if (feed && data.entries.length > 0) {
            feed.innerHTML = data.entries.map((entry, idx) => {
                const colors = ['neon-red', 'danger', 'neon-amber', 'primary'];
                const types = ['BLOCK_IP', 'THREAT', 'ALERT', 'INFO'];
                const color = colors[idx % colors.length];
                const type = types[idx % types.length];

                return `
                    <div class="text-[10px] border-l-2 border-${color} pl-3 py-1 flex flex-col gap-1">
                        <div class="flex justify-between text-slate-400">
                            <span>${new Date().toLocaleTimeString()}</span>
                            <span class="text-${color}">${type}</span>
                        </div>
                        <p class="text-slate-200 truncate">${entry}</p>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error refreshing feed:', error);
    }
}

/**
 * Create floating attack button
 */
function createAttackButton() {
    const button = document.createElement('button');
    button.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-2xl">science</span>
            <div class="text-left">
                <div class="text-sm font-bold">Test Attack Payload</div>
                <div class="text-[10px] opacity-70">Click to simulate threats</div>
            </div>
        </div>
    `;
    button.className = 'fixed top-24 right-8 z-50 bg-gradient-to-r from-neon-red to-danger hover:from-danger hover:to-neon-red text-white px-6 py-4 rounded-xl shadow-2xl font-bold transition-all transform hover:scale-105 glow-red border-2 border-neon-red/30';
    button.onclick = () => showAttackMenu();

    document.body.appendChild(button);
}

/**
 * Show attack selection menu
 */
function showAttackMenu() {
    const menu = document.createElement('div');
    menu.className = 'fixed top-40 right-8 z-50 bg-surface-dark border-2 border-white/10 rounded-xl shadow-2xl p-6 space-y-4 min-w-[320px]';
    menu.innerHTML = `
        <div class="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 class="font-bold text-lg">Attack Simulator</h3>
            <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="space-y-2">
            ${Object.entries(ATTACK_PAYLOADS).map(([key, attack]) => `
                <button onclick="window.sendHeavyPayload('${key}'); this.closest('.fixed').remove();" 
                        class="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/5 hover:border-primary/50">
                    <div class="font-bold text-sm">${attack.name}</div>
                    <div class="text-xs text-slate-500 mt-1">Heavy payload | ${attack.payload.sbytes.toLocaleString()} bytes</div>
                </button>
            `).join('')}
        </div>
        <hr class="border-white/10" />
        <button onclick="window.startAutoAttack(); this.closest('.fixed').remove();" 
                class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all">
            ⚡ Start Auto-Attack Mode
        </button>
        <button onclick="window.stopAutoAttack(); this.closest('.fixed').remove();" 
                class="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg transition-all">
            🛑 Stop Auto-Attack
        </button>
    `;

    document.body.appendChild(menu);
}

// Make functions global
window.sendHeavyPayload = sendHeavyPayload;
window.startAutoAttack = startAutoAttack;
window.stopAutoAttack = stopAutoAttack;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛡️ Enterprise Security Dashboard Loaded');

    // Create attack button
    createAttackButton();

    // Auto-refresh live feed every 5 seconds
    setInterval(refreshLiveFeed, 5000);

    // Initial feed load
    refreshLiveFeed();

    console.log('✅ Backend API connected at:', API_BASE);
    console.log('💡 Click "Test Attack Payload" button to simulate threats');
});
