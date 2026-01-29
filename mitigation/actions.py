def _mitigate_dos(ip):
    """Handle DoS attacks with rate limiting"""
    if ip in rate_limited_ips:
        rate_limited_ips[ip]["violations"] += 1
    else:
        rate_limited_ips[ip] = {
"""Default mitigation for unknown attack types"""
    print(f"⚠️  Alert triggered for {ip} - {attack_type}")
    return {"action": "alert", "reason": attack_type}


def is_blocked(ip):
    """Check if IP is blocked"""
    return ip in blocked_ips

def reset_mitigations():
    """Reset all mitigation states (for testing)"""
    blocked_ips.clear()
    rate_limited_ips.clear()
    session_blacklist.clear()
    print("🔄 Mitigation states reset")
