"""
Real Payload Sender - Send actual network payloads to mobile devices
"""

import socket
import time
import random
from threading import Thread


def send_tcp_flood(target_ip, target_port, duration=5, rate=300):
    """
    Send TCP flood (DoS attack simulation)
    
    Args:
        target_ip: Target device IP
        target_port: Target port (usually 5000 for the threat detector)
        duration: How long to send packets (seconds)
        rate: Packets per second
    """
    print(f"🚀 Sending TCP flood to {target_ip}:{target_port}")
    start_time = time.time()
    packets_sent = 0
    
    while time.time() - start_time < duration:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            sock.connect((target_ip, target_port))
            
            # Send large payload
            payload = b"X" * random.randint(10000, 50000)
            sock.send(payload)
            sock.close()
            
            packets_sent += 1
            time.sleep(1.0 / rate)
        except Exception as e:
            pass  # Continue on errors
    
    print(f"✅ TCP flood complete: {packets_sent} packets sent")
    return packets_sent


def send_exploit_payload(target_ip, target_port):
    """
    Send exploit-style payload with large packet sizes
    """
    print(f"🚀 Sending exploit payload to {target_ip}:{target_port}")
    
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect((target_ip, target_port))
        
        # Send very large payload simulating buffer overflow attempt
        payload = b"EXPLOIT_" * 20000  # ~140KB payload
        sock.send(payload)
        sock.close()
        
        print(f"✅ Exploit payload sent: {len(payload)} bytes")
        return len(payload)
    except Exception as e:
        print(f"❌ Error sending exploit: {e}")
        return 0


def send_port_scan(target_ip, start_port=5000, end_port=5100):
    """
    Perform port scan (reconnaissance)
    """
    print(f"🚀 Port scanning {target_ip} from {start_port} to {end_port}")
    scanned_ports = 0
    
    for port in range(start_port, end_port):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.1)
            result = sock.connect_ex((target_ip, port))
            sock.close()
            scanned_ports += 1
        except Exception:
            pass
    
    print(f"✅ Port scan complete: {scanned_ports} ports scanned")
    return scanned_ports


def send_backdoor_payload(target_ip, target_port, duration=10):
    """
    Send long-duration connection with large bidirectional traffic
    """
    print(f"🚀 Establishing backdoor connection to {target_ip}:{target_port}")
    
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(30)
        sock.connect((target_ip, target_port))
        
        bytes_sent = 0
        start_time = time.time()
        
        # Send data periodically over the connection
        while time.time() - start_time < duration:
            payload = b"BACKDOOR_DATA_" * 10000  # ~130KB
            sock.send(payload)
            bytes_sent += len(payload)
            time.sleep(0.5)
        
        sock.close()
        print(f"✅ Backdoor connection closed: {bytes_sent} bytes sent")
        return bytes_sent
    except Exception as e:
        print(f"❌ Error with backdoor: {e}")
        return 0


def send_normal_traffic(target_ip, target_port):
    """
    Send normal, benign traffic
    """
    print(f"🚀 Sending normal traffic to {target_ip}:{target_port}")
    
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        sock.connect((target_ip, target_port))
        
        # Send small, normal payload
        payload = b"GET / HTTP/1.1\r\nHost: " + target_ip.encode() + b"\r\n\r\n"
        sock.send(payload)
        sock.close()
        
        print(f"✅ Normal traffic sent: {len(payload)} bytes")
        return len(payload)
    except Exception as e:
        print(f"❌ Error sending normal traffic: {e}")
        return 0


def trigger_real_payload(attack_type, target_ip, target_port=5000):
    """
    Main function to trigger real network payloads
    
    Args:
        attack_type: Type of attack (dos, exploit, reconnaissance, backdoor, normal)
        target_ip: Target device IP address
        target_port: Target port (default 5000)
        
    Returns:
        Dictionary with payload details
    """
    result = {
        "attack_type": attack_type,
        "target_ip": target_ip,
        "target_port": target_port,
        "timestamp": time.time(),
        "success": False,
        "details": {}
    }
    
    try:
        if attack_type == "dos":
            packets = send_tcp_flood(target_ip, target_port, duration=3, rate=300)
            result["success"] = packets > 0
            result["details"] = {
                "packets_sent": packets,
                "rate": 300,
                "duration": 3
            }
            
        elif attack_type == "exploit":
            bytes_sent = send_exploit_payload(target_ip, target_port)
            result["success"] = bytes_sent > 0
            result["details"] = {
                "bytes_sent": bytes_sent,
                "payload_type": "buffer_overflow_attempt"
            }
            
        elif attack_type == "reconnaissance":
            ports_scanned = send_port_scan(target_ip, start_port=target_port, end_port=target_port + 50)
            result["success"] = ports_scanned > 0
            result["details"] = {
                "ports_scanned": ports_scanned,
                "scan_type": "tcp_connect"
            }
            
        elif attack_type == "backdoor":
            bytes_sent = send_backdoor_payload(target_ip, target_port, duration=5)
            result["success"] = bytes_sent > 0
            result["details"] = {
                "bytes_sent": bytes_sent,
                "connection_duration": 5
            }
            
        elif attack_type == "normal":
            bytes_sent = send_normal_traffic(target_ip, target_port)
            result["success"] = bytes_sent > 0
            result["details"] = {
                "bytes_sent": bytes_sent,
                "traffic_type": "http_get"
            }
            
    except Exception as e:
        result["error"] = str(e)
        print(f"❌ Error triggering payload: {e}")
    
    return result


def trigger_payload_async(attack_type, target_ip, target_port=5000, callback=None):
    """
    Trigger payload in background thread to avoid blocking
    """
    def run_payload():
        result = trigger_real_payload(attack_type, target_ip, target_port)
        if callback:
            callback(result)
    
    thread = Thread(target=run_payload, daemon=True)
    thread.start()
    return thread
