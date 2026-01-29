"""
Logger for Cloud Threat Detection System
Handles logging to .txt files for activity, threats, and mitigation
"""

import os
from datetime import datetime

LOG_DIR = "logs"

# Ensure log directory exists
os.makedirs(LOG_DIR, exist_ok=True)

ACTIVITY_LOG = os.path.join(LOG_DIR, "activity_log.txt")
THREAT_LOG = os.path.join(LOG_DIR, "threat_log.txt")
MITIGATION_LOG = os.path.join(LOG_DIR, "mitigation_log.txt")


def _get_timestamp():
    """Get formatted timestamp for logs"""
    return datetime.now().strftime("[%H:%M:%S]")


def log_activity(payload):
    """
    Log normal network activity
    
    Args:
        payload (dict): Request payload
    """
    timestamp = _get_timestamp()
    ip = payload.get("src_ip", "Unknown")
    requests = payload.get("spkts", 1)
    status = "Normal"
    
    log_entry = f"{timestamp} IP:{ip} | Requests: {requests} | Status: {status}\n"
    
    with open(ACTIVITY_LOG, "a") as f:
        f.write(log_entry)
    
    print(f"✅ {log_entry.strip()}")


def log_threat(payload, attack_type, anomaly_score=None):
    """
    Log detected threats
    
    Args:
        payload (dict): Request payload
        attack_type (str): Type of attack detected
        anomaly_score (float, optional): Anomaly detection score
    """
    timestamp = _get_timestamp()
    ip = payload.get("src_ip", "Unknown")
    score_info = f" | Score:{anomaly_score:.2f}" if anomaly_score else ""
    
    log_entry = f"{timestamp} Anomaly Detected | IP:{ip} | Attack: {attack_type}{score_info}\n"
    
    with open(THREAT_LOG, "a") as f:
        f.write(log_entry)
    
    print(f"🚨 {log_entry.strip()}")


def log_mitigation(ip, attack_type, action="Blocked"):
    """
    Log mitigation actions taken
    
    Args:
        ip (str): IP address of threat
        attack_type (str): Type of attack
        action (str): Action taken
    """
    timestamp = _get_timestamp()
    
    log_entry = f"{timestamp} {attack_type} Attack | IP: {ip} | Action: {action}\n"
    
    with open(MITIGATION_LOG, "a") as f:
        f.write(log_entry)
    
    print(f"🔒 {log_entry.strip()}")


def get_recent_logs(log_type="activity", lines=10):
    """
    Get recent log entries
    
    Args:
        log_type (str): Type of log (activity/threat/mitigation)
        lines (int): Number of recent lines to return
        
    Returns:
        list: Recent log entries
    """
    log_files = {
        "activity": ACTIVITY_LOG,
        "threat": THREAT_LOG,
        "mitigation": MITIGATION_LOG
    }
    
    log_file = log_files.get(log_type, ACTIVITY_LOG)
    
    if not os.path.exists(log_file):
        return []
    
    with open(log_file, "r") as f:
        all_lines = f.readlines()
        return all_lines[-lines:] if len(all_lines) > lines else all_lines


def clear_logs():
    """Clear all log files (use for testing)"""
    for log_file in [ACTIVITY_LOG, THREAT_LOG, MITIGATION_LOG]:
        if os.path.exists(log_file):
            os.remove(log_file)
    print("🗑️ All logs cleared")
