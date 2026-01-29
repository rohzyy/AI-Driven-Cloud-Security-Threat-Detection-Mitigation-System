# 🛡️ Cloud Threat Detection System

> AI-Powered Real-Time Network Security Monitoring & Threat Mitigation

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)](https://flask.palletsprojects.com/)
[![ML Models](https://img.shields.io/badge/ML-Dual%20Model-orange.svg)](https://scikit-learn.org/)
[![Mobile](https://img.shields.io/badge/Deploy-Termux%20Ready-red.svg)](https://termux.com/)

## 🎯 Project Overview

A deployable AI-based data center security system that runs on a single node, monitors network activity in real-time, detects threats using dual machine learning models, and automatically triggers mitigation actions. All activity is logged to text files for audit and analysis.

### Key Features

✅ **Dual AI Model Architecture**
- UNSW-NB15 Anomaly Detection Model (9MB)
- Random Forest Attack Classifier (73MB)

✅ **Real-Time Threat Detection**
- DoS/DDoS attacks
- Exploitation attempts
- Port scanning & reconnaissance
- Fuzzing & analysis attacks
- Backdoor & shellcode injection

✅ **Automated Mitigation**
- IP blocking for critical threats
- Rate limiting for DoS attacks
- Session termination for suspicious activity
- Enhanced monitoring for reconnaissance

✅ **Comprehensive Logging**
- Activity logs (all network traffic)
- Threat logs (detected anomalies)
- Mitigation logs (actions taken)

✅ **Mobile Deployment**
- Fully compatible with Termux on Android
- Low resource footprint
- No external dependencies

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend Dashboard                     │
│              (Real-time Monitoring UI)                   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP POST /api/request
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Flask API Server                        │
│                    (app.py)                              │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Feature Extraction                          │
│        (40+ UNSW-NB15 compatible features)              │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│         Model 1: UNSW-NB15 Anomaly Detector             │
│              (unsw_nb15_model.pkl)                       │
└───────────────────────┬─────────────────────────────────┘
                        │
                  ┌─────┴─────┐
                  │           │
            Normal ▼           ▼ Anomaly Detected
                  │           │
                  │    ┌──────────────────────────────┐
                  │    │ Model 2: RF Attack Classifier │
                  │    │    (rf_model.joblib)          │
                  │    └──────────┬───────────────────┘
                  │               │
                  │               ▼
                  │    ┌──────────────────────────────┐
                  │    │  Mitigation Engine            │
                  │    │  (actions.py)                 │
                  │    └──────────┬───────────────────┘
                  │               │
                  ▼               ▼
           ┌──────────────────────────────────────────┐
           │         Logging System                    │
           │  ├── activity_log.txt                    │
           │  ├── threat_log.txt                      │
           │  └── mitigation_log.txt                  │
           └──────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
cloud-threat-detection/
│
├── app.py                          # Main Flask server
├── requirements.txt                 # Python dependencies
├── README.md                        # This file
│
├── models/                          # Pre-trained ML models
│   ├── unsw_nb15_model.pkl         # UNSW anomaly detector (9MB)
│   └── rf_model.joblib             # RF attack classifier (73MB)
│
├── logs/                            # Runtime logs (auto-created)
│   ├── activity_log.txt            # All network activity
│   ├── threat_log.txt              # Detected threats
│   └── mitigation_log.txt          # Mitigation actions
│
├── data/                            # Sample data
│   └── sample_payloads.json        # Test payloads
│
├── mitigation/                      # Threat response
│   └── actions.py                  # Mitigation strategies
│
├── utils/                           # Utility modules
│   ├── feature_extractor.py        # Feature engineering
│   └── logger.py                   # Logging utilities
│
└── frontend/                        # Web dashboard
    ├── client1.html                # Main UI
    └── script.js                   # Frontend logic
```

---

## 🚀 Quick Start

### Option 1: Run on PC (Windows/Linux/Mac)

```bash
# Install dependencies
pip install -r requirements.txt

# Start server
python app.py

# Access dashboard
# Open browser: http://localhost:5000
```

### Option 2: Run on Mobile (Termux)

```bash
# Setup Termux
pkg update && pkg upgrade
pkg install python git

# Clone repository
git clone <your-repo-url>
cd cloud-threat-detection

# Install dependencies
pip install -r requirements.txt

# Start server
python app.py

# Access dashboard
# Open browser on phone: http://localhost:5000
```

---

## 🎮 How to Use

### 1. **Start the Server**
```bash
python app.py
```

You should see:
```
🚀 Cloud Threat Detection System
📡 Server starting on http://0.0.0.0:5000
🌐 Access demo at http://localhost:5000
```

### 2. **Open Dashboard**
Navigate to `http://localhost:5000` in your browser

### 3. **Simulate Traffic**
- Use the **Network Traffic Simulator** panel
- Select traffic type (Normal/DoS/Exploit/Recon)
- Click "Send Traffic" to test detection
- Or use **Auto Simulate Traffic** for continuous demo

### 4. **Monitor Results**
- Watch **real-time logs** update in three panels
- View **system statistics** (requests, threats, blocks)
- See **mitigation actions** triggered automatically

---

## 🧪 API Endpoints

### `POST /api/request`
Submit network traffic for analysis

**Request:**
```json
{
  "src_ip": "192.168.1.100",
  "rate": 10,
  "sbytes": 500,
  "spkts": 5,
  "dpkts": 5,
  "protocol": "tcp"
}
```

**Response (Normal):**
```json
{
  "status": "NORMAL",
  "message": "Traffic appears normal"
}
```

**Response (Threat):**
```json
{
  "status": "THREAT",
  "attack_type": "DoS",
  "confidence": 0.95,
  "anomaly_score": -1.2,
  "mitigation": {
    "action": "rate_limited",
    "reason": "DoS detected"
  }
}
```

### `GET /api/logs/<log_type>`
Retrieve logs (activity/threat/mitigation)

**Example:** `/api/logs/threat?lines=20`

### `GET /api/stats`
Get system statistics

**Response:**
```json
{
  "blocked_ips": 3,
  "rate_limited_ips": 2,
  "blacklisted_sessions": 1,
  "blocked_list": ["192.168.1.50", "10.0.0.15"],
  "rate_limited_list": ["192.168.1.100"]
}
```

---

## 🧠 ML Models

### Model 1: UNSW-NB15 Anomaly Detector
- **Type:** Isolation Forest / One-Class SVM
- **Dataset:** UNSW-NB15 Network Intrusion Dataset
- **Features:** 40+ network traffic features
- **Purpose:** First-stage anomaly detection
- **Output:** Binary (Normal: 0, Anomaly: -1 or 1)

### Model 2: Random Forest Attack Classifier
- **Type:** Random Forest Classifier
- **Classes:** 10 attack categories
  - 0: Normal
  - 1: DoS
  - 2: Exploits
  - 3: Fuzzers
  - 4: Reconnaissance
  - 5: Analysis
  - 6: Backdoor
  - 7: Shellcode
  - 8: Worms
  - 9: Generic
- **Purpose:** Attack type classification
- **Output:** Attack label + confidence score

---

## 📊 Detection Pipeline

1. **Traffic arrives** → Feature extraction (40+ features)
2. **Anomaly detection** → UNSW model predicts normal/anomaly
3. **If anomaly** → RF classifier identifies attack type
4. **Mitigation** → Action triggered based on attack type
5. **Logging** → All events recorded to .txt logs

---

## 🔒 Mitigation Strategies

| Attack Type | Action | Description |
|------------|--------|-------------|
| **DoS** | Rate Limiting → Block | Progressive enforcement, block after 3 violations |
| **Exploits** | Immediate Block | Critical threat, instant IP blacklist |
| **Backdoor** | Immediate Block | Malicious access attempt |
| **Reconnaissance** | Enhanced Monitoring | Passive tracking, no blocking yet |
| **Fuzzers** | Session Termination | End session, log activity |
| **Generic** | Alert Only | Log and notify, manual review |

---

## 📝 Sample Log Output

### activity_log.txt
```
[22:15:10] IP:192.168.1.5 | Requests: 3 | Status: Normal
[22:15:15] IP:192.168.1.10 | Requests: 5 | Status: Normal
[22:15:20] IP:192.168.1.5 | Requests: 8 | Status: Normal
```

### threat_log.txt
```
[22:15:40] Anomaly Detected | IP:192.168.1.50 | Attack: DoS | Score:-0.78
[22:16:02] Anomaly Detected | IP:10.0.0.15 | Attack: Exploits | Score:-1.24
```

### mitigation_log.txt
```
[22:15:41] DoS Attack | IP: 192.168.1.50 | Action: rate_limited
[22:16:03] Exploits Attack | IP: 10.0.0.15 | Action: Blocked
```

---

## 🎯 Why This Project Stands Out

### 1. **Production-Ready Architecture**
Not just a notebook—this is a deployable system with proper separation of concerns

### 2. **Dual Model Intelligence**
Two-stage detection pipeline maximizes accuracy and minimizes false positives

### 3. **Real-World Mitigation**
Automated response system that takes action, not just detection

### 4. **Mobile Deployment**
Runs on Android via Termux—perfect for edge computing demos

### 5. **Audit Trail**
Complete logging system for compliance and forensic analysis

### 6. **Beautiful UI**
Professional dashboard that judges will love to interact with

---

## 🛠️ Technology Stack

- **Backend:** Flask (Python 3.8+)
- **ML Framework:** scikit-learn
- **Models:** Pickle/Joblib serialization
- **Frontend:** HTML5 + Vanilla JavaScript
- **Styling:** CSS3 (Glassmorphism design)
- **Logging:** Text-based file logging
- **Deployment:** Termux compatible

---

## 🎓 Dataset & Training

**Dataset:** UNSW-NB15 Network Intrusion Dataset
- 2.5M+ network flow records
- 40+ features (duration, packets, bytes, protocols, etc.)
- 9 attack categories + normal traffic
- Real-world attack scenarios

**Training Details:**
- Feature engineering: 40+ UNSW-compatible features
- Model 1: Anomaly detection (unsupervised)
- Model 2: Multi-class classification (supervised)
- Validation: Cross-validation + test set evaluation

---

## 🔮 Future Enhancements

- [ ] Database integration (SQLite/PostgreSQL)
- [ ] Email/SMS alerts for critical threats
- [ ] Machine learning model retraining pipeline
- [ ] Docker containerization
- [ ] Kubernetes deployment config
- [ ] GraphQL API
- [ ] Real-time WebSocket updates
- [ ] Historical analytics dashboard

---

## 👥 Team & Acknowledgments

**Built for:** Hackathon Demonstration  
**Dataset:** UNSW-NB15 (UNSW Canberra)  
**Framework:** Flask + scikit-learn  
**Deployment:** Mobile-first (Termux compatible)  

---

## 📄 License

MIT License - Feel free to use and modify

---

## 📞 Contact & Support

For questions or demo requests, please contact the development team.

---

**🏆 Built with 💙 for cloud security and AI innovation**
