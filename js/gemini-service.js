/**
 * Google Gemini AI Service Integration
 * Project: Smart Street Light Management System
 * Powers AI Grid Diagnostics, Energy Audits, and Natural Language Operations
 */

class GeminiAIService {
  constructor() {
    this.model = (typeof CONFIG !== "undefined" && CONFIG.GEMINI_MODEL) ? CONFIG.GEMINI_MODEL : "gemini-1.5-flash";
    this.baseUrl = (typeof CONFIG !== "undefined" && CONFIG.GEMINI_API_URL) 
      ? CONFIG.GEMINI_API_URL 
      : "https://generativelanguage.googleapis.com/v1beta/models";
  }

  getApiKey() {
    // Check localStorage first, then fallback to CONFIG file
    const stored = localStorage.getItem("karnataka_gemini_api_key");
    if (stored && stored.trim().length > 0) {
      return stored.trim();
    }
    if (typeof CONFIG !== "undefined" && CONFIG.GEMINI_API_KEY && CONFIG.GEMINI_API_KEY.trim().length > 0) {
      return CONFIG.GEMINI_API_KEY.trim();
    }
    return "";
  }

  setApiKey(key) {
    if (!key) {
      localStorage.removeItem("karnataka_gemini_api_key");
    } else {
      localStorage.setItem("karnataka_gemini_api_key", key.trim());
    }
  }

  hasApiKey() {
    const key = this.getApiKey();
    return key && key.length > 10;
  }

  /**
   * Validate user-supplied API key with a quick test prompt
   */
  async testApiKey(key) {
    const testKey = key || this.getApiKey();
    if (!testKey) {
      return { success: false, error: "API Key is required. Please paste your Google Gemini API key." };
    }

    const endpoint = `${this.baseUrl}/${this.model}:generateContent?key=${testKey}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Hello! Confirm you are connected to the Karnataka Smart Street Light Management System. Respond in 1 brief sentence." }]
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.error?.message || `HTTP ${response.status}: Authentication failed`;
        return { success: false, error: msg };
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Connected successfully!";
      return { success: true, message: reply };
    } catch (err) {
      return { success: false, error: `Connection failed: ${err.message}` };
    }
  }

  /**
   * Query Gemini AI with real-time grid context
   */
  async askGridAdvisor(userQuestion, contextState = null) {
    const key = this.getApiKey();
    const state = contextState || (typeof iotEngine !== "undefined" ? iotEngine.getState() : null);

    // Build smart context prompt
    const systemPrompt = `
You are the AI Chief Engineer & Grid Advisor for the Karnataka Smart Street Light Management System.
You are monitoring 30 districts across Karnataka, India (BESCOM, HESCOM, GESCOM, MESCOM, CHESCOM).
Real-Time Telemetry Context:
- Active Time Mode: ${state?.timeOfDay || "NIGHT"}
- Total Street Lights Monitored: ${state?.aggregate?.totalStreetLights?.toLocaleString() || "22,860"}
- Lights Currently ON (100% motion): ${state?.aggregate?.lightsOn?.toLocaleString() || "4,850"}
- Lights Dimmed (Standby 30%): ${state?.aggregate?.lightsDimmed?.toLocaleString() || "17,200"}
- Energy Saved State-wide: ${state?.aggregate?.energySavedPercent || 64}% (${state?.aggregate?.powerSavedKW || 1280} kW)
- Estimated Daily Cost Savings: INR ${state?.aggregate?.dailyCostSavedINR?.toLocaleString() || "1,30,560"}
- Active Fault Alerts: ${JSON.stringify(state?.alerts?.slice(0, 3) || [])}

Provide helpful, technical, concise, and professional answers for smart city management.
If asked about a specific city like Tumakuru, Mysuru, or Bengaluru, reference realistic street names, ESCOM authorities, and hardware sensors (PIR, LDR, ACS712 current sensors, LoRaWAN gateways).
Format key insights with bullet points and bold highlights.
`;

    if (!key) {
      // Intelligent built-in simulation fallback when no key is set yet
      return this.getSimulatedResponse(userQuestion, state);
    }

    const endpoint = `${this.baseUrl}/${this.model}:generateContent?key=${key}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\nOperator Question: "${userQuestion}"` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        isLiveAI: true,
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from Gemini."
      };
    } catch (err) {
      console.warn("Gemini API call failed, falling back to simulated intelligence:", err);
      const fallback = this.getSimulatedResponse(userQuestion, state);
      fallback.warning = `(Gemini API notice: ${err.message}. Showing local simulated analysis)`;
      return fallback;
    }
  }

  /**
   * Diagnose a specific fault alert using Gemini
   */
  async diagnoseFault(alert) {
    const question = `Diagnose the hardware fault for ${alert.lightId} in ${alert.cityName} (${alert.street}). The reported issue is "${alert.message}" on component "${alert.component}". Provide: 1. Probable root cause, 2. Field safety hazard, 3. Dispatched crew equipment checklist for ${alert.escom.split(" ")[0]}, 4. SLA priority.`;
    return await this.askGridAdvisor(question);
  }

  /**
   * Fallback intelligent generator for seamless demo experience
   */
  getSimulatedResponse(query, state) {
    const q = query.toLowerCase();

    if (q.includes("tumakuru") || q.includes("104") || q.includes("pir")) {
      return {
        isLiveAI: false,
        text: `### 🚨 Gemini AI Anomaly Diagnosis: Tumakuru Pole TMK-SL-104

**1. Incident Overview:**
- **Location:** BH Road Corridor, Tumakuru (BESCOM jurisdiction)
- **Component:** Passive Infrared (PIR) Motion Sensor / Fresnel Lens Module
- **Current Reading:** 0.00A Open Circuit / SENSOR ERROR (E-204)

**2. Probable Root Causes:**
- Fresnel optical lens thermal saturation or physical obstruction.
- LoRa node ADC pin timeout (failed heartbeat packet after 3 retries).
- Over-voltage transient during evening switching surge.

**3. Recommended Corrective Action:**
- Lineman Squad Alpha-2 dispatched with replacement PIR HC-SR501/RCWL-0516 module.
- Recommended failover: System has auto-locked luminaire to 30% standby safety illumination.
- **BESCOM Ticket Priority:** Class-1 Urgent (High-traffic state corridor).`
      };
    }

    if (q.includes("energy") || q.includes("saving") || q.includes("cost") || q.includes("kwh")) {
      const savedKW = state?.aggregate?.powerSavedKW || 1280;
      const inr = state?.aggregate?.dailyCostSavedINR?.toLocaleString() || "1,30,560";
      return {
        isLiveAI: false,
        text: `### ⚡ Gemini AI Energy & Financial Intelligence Report

**State-wide Karnataka Performance:**
- **Dynamic Energy Reduction:** **${state?.aggregate?.energySavedPercent || 64}%** vs Conventional 150W All-Night Baseline.
- **Active Power Conserved:** **${savedKW} kW** continuously averted.
- **Estimated Financial Savings:** **₹${inr} per night** across the 30 municipal jurisdictions.
- **Environmental Offset:** **~${state?.aggregate?.co2SavedKg?.toLocaleString() || "12,595"} kg of CO2** prevented daily.

**Optimization Insight:**
Deep-night dimming between 01:00 AM and 04:30 AM yields the highest efficiency return (up to 79.4% savings) without compromising pedestrian safety.`
      };
    }

    if (q.includes("weather") || q.includes("rain") || q.includes("monsoon") || q.includes("fog")) {
      return {
        isLiveAI: false,
        text: `### 🌧️ Gemini AI Adaptive Weather Lighting Strategy

**Monsoon & Western Ghats Advisory (Mangaluru, Udupi, Kodagu, Uttara Kannada):**
- **Fog / Heavy Precipitation Protocol:** Increase baseline standby brightness from 30% to **55%** during zero-traffic intervals to maintain roadway contrast.
- **LDR Photocell Adaptation:** Compensate for overcast storm clouds by lowering lux threshold to 350 Lux for earlier automatic dusk ignition.
- **Surge Protection:** Alert MESCOM and HESCOM sub-stations of lightning ground surges along the coastal corridor.`
      };
    }

    return {
      isLiveAI: false,
      text: `### 💡 Gemini AI Karnataka Smart Grid Telemetry Summary

- **Status:** All 30 municipal districts are communicating via LoRaWAN/MQTT gateways.
- **Total Street Lights:** **${state?.aggregate?.totalStreetLights?.toLocaleString() || "22,860"}**
- **Healthy Operation:** **99.96%** uptime across BESCOM, HESCOM, GESCOM, MESCOM, and CHESCOM zones.
- **Action Required:** 1 open incident logged in **Tumakuru (TMK-SL-104)**; work order queued for BESCOM dispatch.

*Tip: Connect your Google Gemini API Key in the top header to enable live Gemini 1.5 Flash generative queries!*`
    };
  }
}

// Global Gemini AI instance
window.geminiService = new GeminiAIService();
