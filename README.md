# 💡 SMART STREET LIGHT MANAGEMENT SYSTEM
### IoT-Based Intelligent Street Lighting & Energy Management for Karnataka (30 Cities)

An advanced, interactive Smart City Command & Control Center web application demonstrating intelligent IoT-powered street lighting across all **30 districts and cities of Karnataka, India**.

Designed for college project demonstrations, hackathons, and technical vivas.

---

## 🚀 Quick Start & Demo Credentials

### 1. Launching the Application
You can run this project in two easy ways:
- **Direct Browser Run:** Simply double-click `index.html` in your browser (Chrome, Edge, Firefox, Safari).
- **Local HTTP Server (Recommended):**
  ```powershell
  cd "C:\Users\ameer\.gemini\antigravity\scratch\smart-street-light-karnataka"
  python -m http.server 8080
  ```
  Then open [http://localhost:8080](http://localhost:8080) in your web browser.

### 2. Demo Login Credentials
- **Registered Mobile Number:** `123456789`
- **Password:** `786786`
- **Two-Factor Authentication (OTP):** `7860` (or click the **⚡ Auto-Fill Demo OTP** button)

---

## ✨ Google Gemini AI Integration & Key Setup

The Command Center is powered by **Google Gemini AI (Gemini 1.5 Flash)** for intelligent grid diagnostics, autonomous ESCOM work orders, and adaptive weather optimization.

You can configure your Gemini API Key in **two ways**:

### Method 1: Through the Web Application UI (Recommended)
1. Sign in to the application.
2. In the top command header, click the **"✨ Gemini AI (Key Setup)"** button.
3. Paste your key (`AIzaSy...`) into the dialog and click **"Save & Test API Key"**.
4. The key is verified live with Google Gemini and securely stored in your browser's local storage.

### Method 2: In the Configuration File (`js/config.js`)
Open `js/config.js` and paste your key directly:
```javascript
const CONFIG = {
  GEMINI_API_KEY: "AIzaSyYourActualKeyHere...", // Paste your key here
  GEMINI_MODEL: "gemini-1.5-flash"
};
```

> **Note:** If an API key is not yet provided, the application automatically runs in **Intelligent Simulation Sandbox Mode**, providing realistic AI diagnoses and answers for seamless college demonstrations. Entering a real Gemini key immediately elevates it to live Google Gemini 1.5 generative intelligence!

---

## 🌟 Key Features & Capabilities

### 📍 1. 30 Karnataka Cities on Interactive Map
- Covers all 30 Karnataka cities with accurate geographic coordinates:
  1. Bengaluru
  2. Mysuru
  3. Mangaluru
  4. Hubballi
  5. Dharwad
  6. Belagavi
  7. Shivamogga
  8. Tumakuru
  9. Davanagere
  10. Ballari
  11. Kalaburagi
  12. Vijayapura
  13. Raichur
  14. Hassan
  15. Mandya
  16. Chitradurga
  17. Udupi
  18. Chikkamagaluru
  19. Kolar
  20. Bengaluru Rural
  21. Bidar
  22. Yadgir
  23. Gadag
  24. Bagalkot
  25. Koppal
  26. Kodagu (Madikeri)
  27. Chamarajanagar
  28. Ramanagara
  29. Uttara Kannada (Karwar)
  30. Chikkaballapur
- Custom animated pulsing pins with Leaflet dark matter tiles:
  - 🟢 **Green** = Normal Operation
  - 🟡 **Yellow** = Sensor Warning / Calibration Drift
  - 🔴 **Red** = Critical Hardware Fault (e.g. Tumakuru SL-104 PIR failure)
  - 🔵 **Blue** = Scheduled Maintenance

### 📊 2. Centralized Smart City Dashboard
- Real-time KPI counters:
  - Total Cities Monitored: **30**
  - Total Street Lights: **22,860**
  - Lights Currently ON (100% motion brightness)
  - Lights Currently Dimmed (30% standby power-saving mode)
  - Lights operating autonomously in IoT mode
  - Active faulty lights counter
  - Energy consumption (kW)
  - Energy saved percentage (**~64% average savings**)
  - Daily cost saved in Indian Rupees (**₹1,30,000+/day**)
  - CO2 emissions averted (**kg/day**)
  - Vehicle and pedestrian detection counters

### 💡 3. Individual Street Light Monitoring
- Detailed telemetry view for any selected city.
- Displays individual poles (`TMK-SL-101`, `TMK-SL-104`, etc.) with:
  - Pole ID & street avenue name
  - Status: `ON` / `OFF` / `DIMMED` / `FAULT`
  - Dynamic brightness percentage bar (0% - 100%)
  - Power consumption (W)
  - LDR ambient lux sensor (Daylight/Night detection)
  - PIR motion sensor status (Active / Idle)
  - Current sensor (Normal A / Open circuit / Overcurrent surge)
  - Last updated live timestamp
  - Manual override controls (Brightness slider, Auto/Manual mode toggle)

### 🤖 4. Smart Automation & IoT Behavior
- **Daytime Automation:** LDR > 500 Lux turns street lights automatically **OFF (0W)**.
- **Nighttime Standby:** LDR < 50 Lux turns street lights **ON at low standby brightness (30%, 45W)**.
- **Dynamic Motion Sensing:** PIR detects approaching vehicles/pedestrians, immediately boosting luminaire to **100% (150W)**.
- **Luminescence Decay:** After traffic passes, light gradually steps down back to standby (30%).
- **Corridor Light Wave:** Vehicles moving down a street create a continuous wave of illumination ahead of them.

### 🚨 5. Fault Detection & Karnataka ESCOM Dispatch
- Realistic fault generation (e.g., `⚠️ Street Light SL-104 in Tumakuru has reported a PIR sensor failure`).
- **"Notify Electricity Department"** button:
  - Dispatches official maintenance ticket to regional Karnataka power boards:
    - **BESCOM** (Bengaluru, Tumakuru, Kolar, Ramanagara, Davanagere, Chitradurga)
    - **HESCOM** (Hubballi, Dharwad, Belagavi, Vijayapura, Bagalkot, Gadag, Uttara Kannada)
    - **GESCOM** (Kalaburagi, Ballari, Raichur, Bidar, Yadgir, Koppal)
    - **MESCOM** (Mangaluru, Udupi, Shivamogga, Chikkamagaluru)
    - **CHESCOM** (Mysuru, Mandya, Hassan, Chamarajanagar, Kodagu)
  - Generates verifiable ticket receipt with ticket ID, assigned crew, and resolution SLA.

### 📈 6. Interactive Analytics & Charts (Chart.js)
- Filters for **Today (24h)**, **Last 7 Days**, and **Last 30 Days**.
- Charts include:
  1. Energy Consumption Comparison: Smart IoT vs Conventional Baseline
  2. Hourly Energy Savings % Curve
  3. Status Distribution Doughnut Chart
  4. Vehicle vs Pedestrian Traffic Detection Volume
  5. Grid Anomaly Classification by Component

---

## 🎓 College Viva / Project Presentation Q&A

**Q1: How does smart street lighting save energy compared to conventional systems?**  
*Answer:* Conventional street lights run at 100% full power (typically 150W-250W) for all 10-12 hours of the night, even when roads are empty. The IoT system keeps lamps at a low 25-30% standby brightness, ramping up to 100% only when PIR/Radar sensors detect vehicles or pedestrians. This reduces energy consumption by 55% to 75%.

**Q2: What sensors are used in the physical hardware pole?**  
*Answer:*
- **LDR (Light Dependent Resistor):** Measures ambient lux to determine sunrise/sunset automatically.
- **PIR (Passive Infrared) / Microwave Radar:** Detects approaching vehicles and pedestrians.
- **ACS712 Current Sensor:** Measures electrical current draw. If the lamp should be ON but current is 0A, a burnt bulb / open circuit fault is flagged immediately.

**Q3: How does the pole communicate with the central control center?**  
*Answer:* Street poles communicate via **LoRaWAN (865-867 MHz India frequency band)** or Zigbee mesh to a local gateway. The gateway then forwards telemetry packets to the cloud command center via 4G/5G/Ethernet using **MQTT protocol**.

---

## 💻 Tech Stack
- **Frontend:** Semantic HTML5, Modern CSS3 (Cyberpunk Smart City Dark Theme), ES6+ JavaScript
- **Interactive Mapping:** Leaflet.js with CartoDB Dark Matter tiles
- **Data Visualizations:** Chart.js 4.4
- **Audio Feedback:** Web Audio API Synthesizer
- **Styling:** CSS Custom Properties, Glassmorphism, CSS Grid & Flexbox

# SmartStreetLightManagmentSystem.2
