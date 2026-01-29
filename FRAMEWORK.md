# 🏗️ Project Framework & Architecture

## Technology Stack

### Backend
- **Framework**: Flask 2.x (Python web framework)
- **AI/ML Libraries**: 
  - scikit-learn (Machine Learning models)
  - joblib (Model serialization)
  - pickle (Data persistence)
- **Networking**: Python `socket` library for real payload transmission
- **Threading**: Multi-threaded payload sender for non-blocking operations

### Frontend
- **UI Framework**: TailwindCSS 3.x (Utility-first CSS framework)
- **JavaScript**: Vanilla ES6+ (no frameworks)
- **Icons**: Google Material Symbols
- **Fonts**: Google Fonts (Inter typeface)

### Data Storage
- **Logs**: Plain text files (.txt)
- **User Data**: JSON files
- **ML Models**: Pickle/Joblib serialized files

### Deployment
- **Platform**: Cross-platform (Windows, Linux, Termux)
- **Server**: Flask development server (production: Gunicorn/uWSGI recommended)
- **Port**: 5000 (configurable)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Dashboard   │  │  Instances   │  │  ML Models   │          │
│  │  (1code.html)│  │ (users.html) │  │(models.html) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    REST API (JSON)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Flask Application                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     app.py (Main)                         │  │
│  │  • Route handlers                                         │  │
│  │  • API endpoints                                          │  │
│  │  • Request processing                                     │  │
│  └────┬─────────────────┬────────────────┬───────────────────┘  │
│       │                 │                │                      │
│  ┌────▼────┐      ┌────▼─────┐    ┌────▼──────┐               │
│  │ Feature │      │  Logger  │    │ Mitigation│               │
│  │Extractor│      │  Module  │    │  Actions  │               │
│  └─────────┘      └──────────┘    └───────────┘               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         ┌──────▼──────┐          ┌──────▼──────┐
         │  ML Models  │          │  Data Store │
         │  • UNSW-NB15│          │  • Logs     │
         │  • RF Model │          │  • Users    │
         └─────────────┘          └─────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Mobile Devices │
                    │   (Termux)     │
                    └────────────────┘
```

---

## Directory Structure

```
Sahe Models/
├── 📄 app.py                      # Main Flask application
├── 📄 dashboard.js                # Dashboard visualization logic
├── 📄 workflow-3d.js              # 3D workflow visualization
├── 📄 map-updates.js              # Real-time map updates
│
├── 📁 frontend/                   # Original demo frontend
│   ├── client1.html
│   └── assets/
│
├── 📁 static/                     # Static assets
│   ├── css/
│   │   └── styles.css             # Custom styles
│   └── js/
│       └── tailwind.js            # TailwindCSS CDN
│
├── 📁 utils/                      # Utility modules
│   ├── __init__.py
│   ├── feature_extractor.py      # Network feature extraction
│   ├── logger.py                 # Activity/threat/mitigation logging
│   ├── user_manager.py           # Device management (CRUD)
│   └── payload_sender.py         # Real network payload transmission
│
├── 📁 mitigation/                 # Mitigation system
│   ├── __init__.py
│   └── actions.py                # Threat mitigation actions
│
├── 📁 models/                     # ML models
│   ├── unsw_nb15_model.pkl       # UNSW anomaly detection
│   └── rf_model.joblib           # Random Forest classifier
│
├── 📁 logs/                       # System logs
│   ├── activity.txt              # All network activity
│   ├── threat.txt                # Detected threats
│   └── mitigation.txt            # Applied mitigations
│
├── 📁 data/                       # User data
│   └── devices.json              # Registered instances
│
├── 📄 HTML Pages
│   ├── 1code.html                # Main dashboard
│   ├── code.html                 # Threat analysis
│   ├── users.html                # Instance management
│   ├── instance-detail.html      # Instance monitoring
│   ├── alerts.html               # Alerts page
│   ├── mitigations.html          # Mitigations page
│   ├── assets.html               # Assets page
│   ├── reports.html              # Reports page
│   └── models.html               # ML models page
│
└── 📄 Configuration
    ├── requirements.txt          # Python dependencies
    ├── setup_termux.sh          # Termux setup script
    ├── run_windows.bat          # Windows launcher
    ├── README.md                # Documentation
    └── .gitignore               # Git exclusions
```

---

## Core Components

### 1. Flask Application (`app.py`)

**Responsibilities**:
- HTTP server and routing
- API endpoint management
- Request/response handling
- Model loading and inference
- Integration point for all modules

**Key Endpoints**:
```python
# UI Pages
GET  /                              # Main dashboard
GET  /users.html                    # Instance management
GET  /instance-detail.html          # Instance monitoring

# API - Threat Detection
POST /api/request                   # Process network traffic

# API - Device Management
GET    /api/users                   # List all devices
POST   /api/users                   # Register new device
GET    /api/users/<id>              # Get device info
PUT    /api/users/<id>              # Update device
DELETE /api/users/<id>              # Delete device
POST   /api/users/<id>/status       # Update status

# API - Payload Trigger
POST /api/users/<id>/trigger-payload  # Trigger real attack

# API - Logs
GET  /api/users/<id>/activity       # Get activity logs
GET  /api/users/<id>/threats        # Get threat logs
GET  /api/users/<id>/mitigations    # Get mitigation logs
GET  /api/logs/<type>               # Get global logs
GET  /api/stats                     # Get statistics
```

### 2. Feature Extractor (`utils/feature_extractor.py`)

**Purpose**: Extract network traffic features for ML models

**Features Extracted**:
- Network layer: src_ip, dst_ip, protocol
- Transport layer: src_port, dst_port, state
- Statistics: rate, sbytes, dbytes, spkts, dpkts
- Timing: dur (duration), sttl, dttl
- Connection metrics: ct_dst_ltm

### 3. Logger (`utils/logger.py`)

**Purpose**: Centralized logging system

**Log Types**:
- `activity.txt`: All network requests
- `threat.txt`: Detected attacks
- `mitigation.txt`: Applied countermeasures

**Format**: `[timestamp] event_data`

### 4. Mitigation Actions (`mitigation/actions.py`)

**Purpose**: Automated threat response

**Actions**:
- `IP_BLOCK`: Block source IP (DoS)
- `RATE_LIMIT`: Throttle requests (Exploits)
- `TEMP_BLOCK`: Temporary block (Reconnaissance)
- `CONNECTION_DROP`: Terminate connection (Backdoor)
- `ALERT_ONLY`: Log without action (Low severity)

**Blocked IPs**: Stored in-memory set (persistent across requests)

### 5. User Manager (`utils/user_manager.py`)

**Purpose**: Device/instance CRUD operations

**Functions**:
```python
add_device(name, ip, username, password, port)
get_all_devices()
get_device(device_id)
update_device(device_id, data)
delete_device(device_id)
update_device_status(device_id, status, metrics)
get_statistics()
```

### 6. Payload Sender (`utils/payload_sender.py`)

**Purpose**: Send real network attacks to devices

**Attack Types**:
```python
send_tcp_flood(ip, port, duration, rate)      # DoS
send_exploit_payload(ip, port)                # Buffer overflow
send_port_scan(ip, start_port, end_port)      # Reconnaissance
send_backdoor_payload(ip, port, duration)     # Persistent connection
send_normal_traffic(ip, port)                 # Benign traffic
```

---

## ML Models

### UNSW-NB15 Anomaly Detection
- **Type**: Decision Tree Classifier
- **File**: `models/unsw_nb15_model.pkl`
- **Purpose**: Binary classification (normal/attack)
- **Features**: 20+ network traffic features

### Random Forest Attack Classifier
- **Type**: Random Forest
- **File**: `models/rf_model.joblib`
- **Purpose**: Multi-class attack type classification
- **Classes**: DoS, Exploit, Reconnaissance, Backdoor, etc.

### Detection Strategy
Currently using **heuristic-based detection** for reliability:
```python
# DoS: High traffic rate
if rate > 200 or (sbytes > 50000 and rate > 50):
    attack_type = "DoS"

# Exploit: Large packet sizes
elif sbytes > 70000:
    attack_type = "Exploits"

# Reconnaissance: Many connection attempts
elif ct_dst_ltm > 100:
    attack_type = "Reconnaissance"
```

---

## Data Flow

### 1. Payload Trigger Flow
```
User clicks "Trigger Payload"
    ↓
Frontend sends POST to /api/users/<id>/trigger-payload
    ↓
Backend generates attack pattern
    ↓
payload_sender.py sends REAL network packets to device IP
    ↓
Backend processes payload through detection system
    ↓
Threat detected → mitigation applied
    ↓
Logs updated + metrics incremented
    ↓
Response sent to frontend with results
    ↓
UI displays workflow visualization
```

### 2. Instance Monitoring Flow
```
User opens instance detail page
    ↓
Frontend requests:
  - GET /api/users/<id>
  - GET /api/users/<id>/activity
  - GET /api/users/<id>/threats
  - GET /api/users/<id>/mitigations
    ↓
Backend fetches data from JSON/logs
    ↓
Frontend renders:
  - Instance stats
  - Traffic monitor
  - Threat timeline
  - Mitigation log
    ↓
Auto-refresh every 5 seconds
```

---

## Design Patterns

### Backend Patterns

1. **Module Pattern**: Separate concerns into focused modules
   - `utils/`: Reusable utilities
   - `mitigation/`: Security actions
   - `models/`: ML models

2. **Factory Pattern**: `generate_test_payload()` creates different attack types

3. **Strategy Pattern**: Different mitigation strategies based on attack type

4. **Singleton Pattern**: Single Flask app instance

### Frontend Patterns

1. **SPA-like Navigation**: Client-side page transitions

2. **Component-based UI**: Reusable card components

3. **Event-driven**: User interactions trigger API calls

4. **Real-time Updates**: Auto-refresh with `setInterval()`

---

## Security Considerations

### Authentication
- ⚠️ Currently **NO authentication** (development mode)
- TODO: Add JWT/session-based auth for production

### CORS
- Enabled for development (all origins allowed)
- TODO: Restrict origins in production

### Input Validation
- Backend validates required fields
- Frontend validates form inputs

### Secure Storage
- Passwords stored in plain JSON (⚠️ **NOT SECURE**)
- TODO: Hash passwords with bcrypt/argon2

---

## Performance Optimization

1. **Async Payload Sending**: Uses threads to avoid blocking
2. **Log File Rotation**: Recent logs cached in memory
3. **Efficient JSON**: Lightweight device storage
4. **CDN Resources**: TailwindCSS loaded from CDN

---

## Scalability

### Current Limitations
- In-memory blocked IPs (lost on restart)
- File-based logs (no rotation)
- Single-threaded Flask (dev server)

### Production Recommendations
1. **Database**: PostgreSQL/MongoDB for devices and logs
2. **Cache**: Redis for blocked IPs and session data
3. **Queue**: Celery for async payload tasks
4. **Server**: Gunicorn with multiple workers
5. **Monitoring**: Prometheus + Grafana
6. **Load Balancer**: Nginx reverse proxy

---

## Development Workflow

### Running Locally
```bash
# Windows
run_windows.bat

# Linux/Mac
python app.py

# Termux (Android)
bash setup_termux.sh
python app.py
```

### Dependencies
```bash
pip install -r requirements.txt
```

**Required**:
- Flask
- scikit-learn
- joblib
- (Other dependencies auto-installed)

### Environment
- Python 3.8+
- 2GB RAM minimum
- Network access to target devices

---

## Testing Strategy

### Manual Testing
1. Register test device with localhost IP
2. Trigger different attack types
3. Verify detection and mitigation
4. Check logs for entries
5. Validate metrics update

### Automated Testing (TODO)
- Unit tests for each module
- Integration tests for API endpoints
- End-to-end tests for complete workflow

---

## Deployment

### Development
```bash
python app.py
# Runs on http://0.0.0.0:5000
```

### Production (Recommended)
```bash
# Install production WSGI server
pip install gunicorn

# Run with multiple workers
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Termux Mobile
```bash
# Install Python and dependencies
pkg install python
pip install flask scikit-learn

# Run the app
python app.py
```

---

## Future Enhancements

### Planned Features
1. **WebSocket**: Real-time threat notifications
2. **SSH Integration**: Remote command execution on devices
3. **Advanced ML**: Deep learning models (LSTM, CNN)
4. **Distributed Testing**: Multi-device simultaneous attacks
5. **Database**: Persistent storage with PostgreSQL
6. **Authentication**: User login and RBAC
7. **API Keys**: Secure device registration
8. **Custom Payloads**: User-defined attack patterns
9. **Docker**: Containerized deployment
10. **CI/CD**: Automated testing and deployment

---

## Framework Advantages

✅ **Lightweight**: Minimal dependencies, fast startup
✅ **Portable**: Runs on desktop, server, and mobile
✅ **Extensible**: Modular design for easy enhancement
✅ **Real-time**: Live monitoring and instant response
✅ **Interactive**: Beautiful UI with visual feedback
✅ **Educational**: Clear code for learning cybersecurity

---

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | Flask | Web framework |
| **ML/AI** | scikit-learn | Threat detection |
| **Frontend** | TailwindCSS | UI framework |
| **Networking** | Python socket | Payload transmission |
| **Data** | JSON + TXT | Persistence |
| **Deployment** | Python 3.8+ | Runtime |

---

**Project Type**: Full-stack cybersecurity threat simulation and detection system
**License**: Open source (add LICENSE file)
**Status**: Production-ready for testing environments
