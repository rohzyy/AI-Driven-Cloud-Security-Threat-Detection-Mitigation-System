"""
Feature Extractor for Cloud Threat Detection System
Extracts features from incoming payload for ML model prediction
"""

def extract_features(payload):
    """
    Extract features from request payload for both models
    
    Args:
        payload (dict): Request payload with network features
        
    Returns:
        list: Feature vector for ML models
    """
    features = []
    
    # Basic traffic features (40+ features for UNSW model compatibility)
    features.append(payload.get("dur", 0))                    # Duration
    features.append(payload.get("spkts", 1))                  # Source packets
    features.append(payload.get("dpkts", 1))                  # Destination packets
    features.append(payload.get("sbytes", 100))               # Source bytes
    features.append(payload.get("dbytes", 100))               # Destination bytes
    features.append(payload.get("rate", 1.0))                 # Rate
    features.append(payload.get("sttl", 254))                 # Source TTL
    features.append(payload.get("dttl", 254))                 # Dest TTL
    features.append(payload.get("sload", 0.1))                # Source load
    features.append(payload.get("dload", 0.1))                # Dest load
    features.append(payload.get("sloss", 0))                  # Source loss
    features.append(payload.get("dloss", 0))                  # Dest loss
    features.append(payload.get("sinpkt", 0))                 # Source inter-packet time
    features.append(payload.get("dinpkt", 0))                 # Dest inter-packet time
    features.append(payload.get("sjit", 0))                   # Source jitter
    features.append(payload.get("djit", 0))                   # Dest jitter
    features.append(payload.get("swin", 255))                 # Source window size
    features.append(payload.get("dwin", 255))                 # Dest window size
    features.append(payload.get("stcpb", 0))                  # Source TCP base
    features.append(payload.get("dtcpb", 0))                  # Dest TCP base
    features.append(payload.get("tcprtt", 0))                 # TCP RTT
    features.append(payload.get("synack", 0))                 # SYN-ACK time
    features.append(payload.get("ackdat", 0))                 # ACK-DATA time
    features.append(payload.get("smean", 100))                # Source mean packet size
    features.append(payload.get("dmean", 100))                # Dest mean packet size
    features.append(payload.get("trans_depth", 0))            # Transaction depth
    features.append(payload.get("response_body_len", 0))      # Response body length
    features.append(payload.get("ct_srv_src", 1))             # Connections to same service
    features.append(payload.get("ct_state_ttl", 1))           # Connection state TTL
    features.append(payload.get("ct_dst_ltm", 1))             # Connections to dest
    features.append(payload.get("ct_src_dport_ltm", 1))       # Connections from src
    features.append(payload.get("ct_dst_sport_ltm", 1))       # Connections to dst sport
    features.append(payload.get("ct_dst_src_ltm", 1))         # Connections between hosts
    features.append(payload.get("is_ftp_login", 0))           # FTP login flag
    features.append(payload.get("ct_ftp_cmd", 0))             # FTP command count
    features.append(payload.get("ct_flw_http_mthd", 0))       # HTTP method count
    features.append(payload.get("ct_src_ltm", 1))             # Source connections
    features.append(payload.get("ct_srv_dst", 1))             # Service connections
    features.append(payload.get("is_sm_ips_ports", 0))        # Same IPs/ports flag
    
    # Protocol flags (binary)
    features.append(1 if payload.get("protocol", "tcp").lower() == "tcp" else 0)
    features.append(1 if payload.get("state", "FIN") == "FIN" else 0)
    features.append(1 if payload.get("service", "http") == "http" else 0)
    
    return features


def extract_simple_features(payload):
    """
    Simplified feature extraction for quick detection
    Used for lightweight screening before full model inference
    
    Args:
        payload (dict): Request payload
        
    Returns:
        dict: Key metrics for quick analysis
    """
    return {
        "request_rate": payload.get("rate", 1),
        "payload_size": payload.get("sbytes", 100),
        "login_attempts": payload.get("ct_ftp_cmd", 0),
        "session_time": payload.get("dur", 10),
        "packet_count": payload.get("spkts", 1),
        "is_suspicious": payload.get("rate", 1) > 100 or payload.get("sbytes", 0) > 10000
    }
