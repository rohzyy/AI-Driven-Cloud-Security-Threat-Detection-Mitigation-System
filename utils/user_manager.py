"""
User/Device Management Module
Handles registration and monitoring of Termux devices
"""

import json
import os
import uuid
import base64
from datetime import datetime
from typing import Dict, List, Optional

# Path to users data file
USERS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "users.json")

def _ensure_data_file():
    """Ensure data directory and file exist"""
    os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w") as f:
            json.dump({"devices": []}, f)

def _load_devices() -> List[Dict]:
    """Load all devices from JSON file"""
    _ensure_data_file()
    try:
        with open(USERS_FILE, "r") as f:
            data = json.load(f)
            return data.get("devices", [])
    except Exception as e:
        print(f"Error loading devices: {e}")
        return []

def _save_devices(devices: List[Dict]):
    """Save devices to JSON file"""
    _ensure_data_file()
    try:
        with open(USERS_FILE, "w") as f:
            json.dump({"devices": devices}, f, indent=2)
    except Exception as e:
        print(f"Error saving devices: {e}")

def _encode_password(password: str) -> str:
    """Encode password using base64"""
    return base64.b64encode(password.encode()).decode()

def _decode_password(encoded: str) -> str:
    """Decode password from base64"""
    try:
        return base64.b64decode(encoded.encode()).decode()
    except:
        return ""

def add_device(device_name: str, ip_address: str, username: str, password: str, port: int = 8022) -> Dict:
    """
    Register a new Termux device
    
    Args:
        device_name: Friendly name for the device
        ip_address: Device IP address
        username: SSH username
        password: SSH password
        port: SSH port (default 8022 for Termux)
    
    Returns:
        Device information dictionary
    """
    devices = _load_devices()
    
    device = {
        "device_id": str(uuid.uuid4()),
        "device_name": device_name,
        "ip_address": ip_address,
        "username": username,
        "password": _encode_password(password),
        "port": port,
        "registered_at": datetime.now().isoformat(),
        "last_seen": datetime.now().isoformat(),
        "status": "registered",
        "metrics": {
            "uptime": 0,
            "cpu_usage": 0,
            "memory_usage": 0,
            "threats_detected": 0
        }
    }
    
    devices.append(device)
    _save_devices(devices)
    
    return device

def get_all_devices() -> List[Dict]:
    """Get list of all registered devices"""
    devices = _load_devices()
    # Return devices with decoded passwords for display (in real app, don't return passwords)
    return devices

def get_device(device_id: str) -> Optional[Dict]:
    """Get a specific device by ID"""
    devices = _load_devices()
    for device in devices:
        if device["device_id"] == device_id:
            return device
    return None

def update_device(device_id: str, updates: Dict) -> Optional[Dict]:
    """
    Update device information
    
    Args:
        device_id: Device ID to update
        updates: Dictionary of fields to update
    
    Returns:
        Updated device or None if not found
    """
    devices = _load_devices()
    
    for i, device in enumerate(devices):
        if device["device_id"] == device_id:
            # Update allowed fields
            if "device_name" in updates:
                device["device_name"] = updates["device_name"]
            if "ip_address" in updates:
                device["ip_address"] = updates["ip_address"]
            if "username" in updates:
                device["username"] = updates["username"]
            if "password" in updates:
                device["password"] = _encode_password(updates["password"])
            if "port" in updates:
                device["port"] = updates["port"]
            if "status" in updates:
                device["status"] = updates["status"]
            if "metrics" in updates:
                device["metrics"].update(updates["metrics"])
            
            devices[i] = device
            _save_devices(devices)
            return device
    
    return None

def delete_device(device_id: str) -> bool:
    """
    Delete a device
    
    Args:
        device_id: Device ID to delete
    
    Returns:
        True if deleted, False if not found
    """
    devices = _load_devices()
    original_count = len(devices)
    
    devices = [d for d in devices if d["device_id"] != device_id]
    
    if len(devices) < original_count:
        _save_devices(devices)
        return True
    return False

def update_device_status(device_id: str, status: str, metrics: Optional[Dict] = None):
    """
    Update device online/offline status and metrics
    
    Args:
        device_id: Device ID
        status: New status (online, offline, error, etc.)
        metrics: Optional metrics dictionary
    """
    updates = {
        "status": status,
        "last_seen": datetime.now().isoformat()
    }
    
    if metrics:
        updates["metrics"] = metrics
    
    update_device(device_id, updates)

def get_device_credentials(device_id: str) -> Optional[Dict]:
    """
    Get device credentials (decoded)
    
    Returns:
        Dictionary with username and decoded password
    """
    device = get_device(device_id)
    if device:
        return {
            "device_id": device_id,
            "ip_address": device["ip_address"],
            "port": device.get("port", 8022),
            "username": device["username"],
            "password": _decode_password(device["password"])
        }
    return None

def get_statistics() -> Dict:
    """Get statistics about registered devices"""
    devices = _load_devices()
    
    total = len(devices)
    online = sum(1 for d in devices if d.get("status") == "online")
    offline = sum(1 for d in devices if d.get("status") in ["offline", "registered"])
    
    return {
        "total_devices": total,
        "online": online,
        "offline": offline,
        "total_threats": sum(d.get("metrics", {}).get("threats_detected", 0) for d in devices)
    }
