// Network Traffic Animation and Real-time Updates
let inboundTraffic = 1.2;
let outboundTraffic = 0.85;
let blockedCount = 42;
let activeConnections = 42;

function updateNetworkStats() {
    // Simulate realistic traffic fluctuations
    inboundTraffic = (1.0 + Math.random() * 0.5).toFixed(2);
    outboundTraffic = (0.7 + Math.random() * 0.3).toFixed(2);
    activeConnections = 35 + Math.floor(Math.random() * 15);

    // Update DOM elements
    const inboundEl = document.getElementById('inbound-traffic');
    const outboundEl = document.getElementById('outbound-traffic');
    const connectionsEl = document.getElementById('active-connections');
    const blockedEl = document.getElementById('blocked-requests');

    if (inboundEl) inboundEl.textContent = `${inboundTraffic} GB/s`;
    if (outboundEl) outboundEl.textContent = `${outboundTraffic} GB/s`;
    if (connectionsEl) connectionsEl.textContent = activeConnections;

    // Update blocked requests from actual threat logs
    fetch('/api/logs/mitigation?lines=100')
        .then(res => res.json())
        .then(data => {
            if (data.entries && blockedEl) {
                blockedEl.textContent = data.entries.length;
            }
        })
        .catch(err => console.error('Error fetching mitigation stats:', err));
}

// Update every 2 seconds
if (document.getElementById('inbound-traffic')) {
    setInterval(updateNetworkStats, 2000);
    updateNetworkStats(); // Initial update
}
