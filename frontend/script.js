/**
 * Cloud Threat Detection System - Frontend JavaScript
 */

let totalRequests = 0;
let threatsDetected = 0;
let autoSimulating = false;

// API Base URL
const API_BASE = window.location.origin;

/**
 * Send traffic request to backend
 */
async function sendRequest() {
    const payload = {
        src_ip: document.getElementById('src_ip').value,
        rate: parseFloat(document.getElementById('rate').value),
        sbytes: parseInt(document.getElementById('sbytes').value),
        spkts: parseInt(document.getElementById('spkts').value),
        dpkts: parseInt(document.getElementById('spkts').value) * 0.8,
        dbytes: parseInt(document.getElementById('sbytes').value) * 0.9,
        dur: Math.random() * 10,
        sttl: 254,
        dttl: 254,
        protocol: "tcp",
        state: "FIN",
        service: "http"
    };

    // Adjust values based on traffic type
    const trafficType = document.getElementById('traffic_type').value;
    switch(trafficType) {
        case 'dos':
            payload.rate = 150 + Math.random() * 100;
            payload.spkts = 200 + Math.random() * 100;
            payload.sbytes = 10000 + Math.random() * 5000;
            break;
        case 'exploit':
            payload.sbytes = 15000 + Math.random() * 5000;
            payload.rate = 50 + Math.random() * 50;
            payload.ct_srv_src = 10;
            break;
        case 'recon':
            payload.spkts = 1;
            payload.sbytes = 60;
            payload.rate = 100 + Math.random() * 50;
            payload.ct_dst_ltm = 50;
            break;
    }

    try {
        const response = await fetch(`${API_BASE}/api/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        totalRequests++;

        // Update UI
        const statusDiv = document.getElementById('result-status');
        
        if (result.status === 'THREAT') {
            threatsDetected++;
            statusDiv.className = 'status threat';
            statusDiv.innerHTML = `
                <div>🚨 THREAT DETECTED</div>
                <div style="font-size:0.9em; margin-top:5px;">
                    Attack: ${result.attack_type} | 
                    Confidence: ${(result.confidence * 100).toFixed(1)}%
                </div>
                <div style="font-size:0.85em; margin-top:5px; opacity:0.9;">
                    Mitigation: ${result.mitigation.action}
                </div>
            `;
        } else {
            statusDiv.className = 'status normal';
            statusDiv.innerHTML = '✅ NORMAL TRAFFIC';
        }

        // Update counters
        document.getElementById('total-requests').textContent = totalRequests;
        document.getElementById('threats-detected').textContent = threatsDetected;

        // Refresh logs
        await refreshLogs();
        await refreshStats();

    } catch (error) {
        console.error('Error:', error);
        const statusDiv = document.getElementById('result-status');
        statusDiv.className = 'status threat';
        statusDiv.textContent = '❌ Error: ' + error.message;
    }
}

/**
 * Refresh all logs
 */
async function refreshLogs() {
    try {
        // Activity log
        const activityRes = await fetch(`${API_BASE}/api/logs/activity?lines=15`);
        const activityData = await activityRes.json();
        document.getElementById('activity-log').innerHTML = 
            activityData.entries.length > 0 
                ? activityData.entries.join('<br>') 
                : 'No activity yet';

        // Threat log
        const threatRes = await fetch(`${API_BASE}/api/logs/threat?lines=15`);
        const threatData = await threatRes.json();
        document.getElementById('threat-log').innerHTML = 
            threatData.entries.length > 0 
                ? threatData.entries.join('<br>') 
                : 'No threats detected';

        // Mitigation log
        const mitigationRes = await fetch(`${API_BASE}/api/logs/mitigation?lines=15`);
        const mitigationData = await mitigationRes.json();
        document.getElementById('mitigation-log').innerHTML = 
            mitigationData.entries.length > 0 
                ? mitigationData.entries.join('<br>') 
                : 'No mitigations performed';

    } catch (error) {
        console.error('Error refreshing logs:', error);
    }
}

/**
 * Refresh system statistics
 */
async function refreshStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats`);
        const stats = await response.json();
        
        document.getElementById('blocked-ips').textContent = stats.blocked_ips || 0;
        document.getElementById('rate-limited').textContent = stats.rate_limited_ips || 0;

    } catch (error) {
        console.error('Error refreshing stats:', error);
    }
}

/**
 * Auto-simulate traffic
 */
async function autoSimulate() {
    if (autoSimulating) {
        autoSimulating = false;
        return;
    }

    autoSimulating = true;
    const trafficTypes = ['normal', 'normal', 'normal', 'dos', 'normal', 'exploit', 'normal', 'recon'];
    let index = 0;

    while (autoSimulating && index < 20) {
        // Set traffic type
        const type = trafficTypes[index % trafficTypes.length];
        document.getElementById('traffic_type').value = type;
        
        // Randomize IP
        const randomIP = `192.168.1.${100 + Math.floor(Math.random() * 50)}`;
        document.getElementById('src_ip').value = randomIP;
        
        // Send request
        await sendRequest();
        
        // Wait between requests
        await new Promise(resolve => setTimeout(resolve, 1500));
        index++;
    }

    autoSimulating = false;
}

/**
 * Initialize dashboard
 */
async function init() {
    // Check health
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        const health = await response.json();
        console.log('System status:', health);
    } catch (error) {
        console.error('System health check failed:', error);
    }

    // Auto-refresh logs every 5 seconds
    setInterval(refreshLogs, 5000);
}

// Initialize on page load
window.addEventListener('load', init);
