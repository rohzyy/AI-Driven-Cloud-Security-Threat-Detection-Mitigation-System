"""
Mitigation Actions for Cloud Threat Detection System
Handles automated response to detected threats
"""

from datetime import datetime, timedelta
from collections import defaultdict

# In-memory tracking (for demo purposes)
blocked_ips = set()
rate_limited_ips = {}
session_blacklist = set()

# Attack type mapping
ATTACK_TYPES = {
    0: "Normal",
    1: "DoS",
    2: "Exploits", 
    3: "Fuzzers",
    4: "Reconnaissance",
    5: "Analysis",
    6: "Backdoor",
    7: "Shellcode",
    8: "Worms",
    9: "Generic"
}


def mitigate(ip, attack_label, session_id=None):
    """
    Execute mitigation action based on attack type
    
    Args:
        ip (str): Source IP address
        attack_label (int): Attack type label from model
        session_id (str, optional): Session identifier
        
    Returns:
        dict: Mitigation action details
    """
    attack_type = ATTACK_TYPES.get(attack_label, "Unknown")
    
    if attack_label == 1:  # DoS
        return _mitigate_dos(ip)
    elif attack_label in [2, 6, 7]:  # Exploits, Backdoor, Shellcode
        return _mitigate_exploit(ip)
    elif attack_label == 4:  # Reconnaissance
        return _mitigate_recon(ip)
    elif attack_label in [3, 5]:  # Fuzzers, Analysis
        return _mitigate_fuzzing(ip)
    else:
        return _default_mitigation(ip, attack_type)


def _mitigate_dos(ip):
    """Handle DoS attacks with rate limiting"""
    if ip in rate_limited_ips:
        rate_limited_ips[ip]["violations"] += 1
    else:
        rate_limited_ips[ip] = {
            "started": datetime.now(),
            "violations": 1
        }
    
    print(f"⚠️  Rate limiting enabled for {ip}")
    
    # Block after 3 violations
    if rate_limited_ips[ip]["violations"] >= 3:
        blocked_ips.add(ip)
        print(f"🔒 IP {ip} BLOCKED due to persistent DoS")
        return {"action": "blocked", "reason": "Persistent DoS"}
    
    return {"action": "rate_limited", "reason": "DoS detected"}


def _mitigate_exploit(ip):
    """Handle exploitation attempts - immediate block"""
    blocked_ips.add(ip)
    print(f"🔒 Blocking IP {ip} - Exploitation attempt")
    return {"action": "blocked", "reason": "Exploitation attempt"}


def _mitigate_recon(ip):
    """Handle reconnaissance - monitoring mode"""
    print(f"👁️  Enhanced monitoring for {ip} - Reconnaissance detected")
    return {"action": "monitored", "reason": "Reconnaissance activity"}


def _mitigate_fuzzing(ip):
    """Handle fuzzing/analysis attempts"""
    session_blacklist.add(ip)
    print(f"🚫 Session terminated for {ip} - Fuzzing detected")
    return {"action": "session_terminated", "reason": "Fuzzing attempt"}


def _default_mitigation(ip, attack_type):
    """Default mitigation for unknown attack types"""
    print(f"⚠️  Alert triggered for {ip} - {attack_type}")
    return {"action": "alert", "reason": attack_type}


def is_blocked(ip):
    """Check if IP is blocked"""
    return ip in blocked_ips


def is_rate_limited(ip):
    """Check if IP is rate limited"""
    return ip in rate_limited_ips


def get_mitigation_stats():
    """Get current mitigation statistics"""
    return {
        "blocked_ips": len(blocked_ips),
        "rate_limited_ips": len(rate_limited_ips),
        "blacklisted_sessions": len(session_blacklist),
        "blocked_list": list(blocked_ips),
        "rate_limited_list": list(rate_limited_ips.keys())
    }


def reset_mitigations():
    """Reset all mitigation states (for testing)"""
    blocked_ips.clear()
    rate_limited_ips.clear()
    session_blacklist.clear()
    print("🔄 Mitigation states reset")
