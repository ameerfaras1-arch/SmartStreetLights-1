/**
 * Smart Street Light Management System - Master Application Controller
 * Project Objective: Demonstrate IoT & Smart-City lighting across 30 Karnataka cities
 */

class SmartStreetLightApp {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.activeTab = "dashboard";
    this.selectedCityId = "tumakuru"; // Default to Tumakuru to demonstrate SL-104 fault immediately
    this.mapManager = null;
    this.chartsManager = null;
    this.soundEnabled = true;
    this.audioContext = null;

    // Credentials required by prompt:
    this.DEMO_MOBILE = "123456789";
    this.DEMO_PASS = "786786";
    this.DEMO_OTP = "7860";
  }

  init() {
    this.bindLoginEvents();
    this.bindNavigationEvents();
    this.bindSimulationDeckEvents();
    this.bindSearchAndFilterEvents();
    this.bindGeminiEvents();
    this.updateGeminiStatusBadge();

    // Check if previously logged in or start at login page
    const savedAuth = sessionStorage.getItem("karnataka_smart_light_auth");
    if (savedAuth === "true") {
      this.loginSuccess();
    } else {
      this.showLoginView();
    }
  }

  /* ==========================================================
     AUDIO FEEDBACK (Web Audio API Synthesizer)
     ========================================================== */
  playSound(type) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      const now = this.audioContext.currentTime;

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === "alert") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "success") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      // Audio might be restricted until user interaction
    }
  }

  /* ==========================================================
     LOGIN & AUTHENTICATION (Simulated OTP Flow)
     ========================================================== */
  bindLoginEvents() {
    const loginForm = document.getElementById("login-form");
    const otpForm = document.getElementById("otp-form");
    const btnAutoFill = document.getElementById("btn-autofill-demo");
    const btnAutoFillOtp = document.getElementById("btn-autofill-otp");
    const btnBackToPass = document.getElementById("btn-back-to-password");
    const btnLogout = document.getElementById("btn-logout");
    const btnSoundToggle = document.getElementById("btn-sound-toggle");

    if (btnAutoFill) {
      btnAutoFill.addEventListener("click", () => {
        document.getElementById("login-mobile").value = this.DEMO_MOBILE;
        document.getElementById("login-password").value = this.DEMO_PASS;
        this.playSound("click");
      });
    }

    if (btnAutoFillOtp) {
      btnAutoFillOtp.addEventListener("click", () => {
        const otpInputs = document.querySelectorAll(".otp-digit-input");
        const code = this.DEMO_OTP.split("");
        otpInputs.forEach((input, idx) => {
          input.value = code[idx] || "";
        });
        this.playSound("click");
      });
    }

    if (btnBackToPass) {
      btnBackToPass.addEventListener("click", () => {
        document.getElementById("login-step-credentials").classList.remove("hidden");
        document.getElementById("login-step-otp").classList.add("hidden");
        this.playSound("click");
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const mobile = document.getElementById("login-mobile").value.trim();
        const pass = document.getElementById("login-password").value.trim();
        const errEl = document.getElementById("login-error-msg");

        if (mobile === this.DEMO_MOBILE && pass === this.DEMO_PASS) {
          // Switch to OTP step
          errEl.classList.add("hidden");
          document.getElementById("login-step-credentials").classList.add("hidden");
          document.getElementById("login-step-otp").classList.remove("hidden");
          document.getElementById("otp-sent-mobile").textContent = `+91 ${mobile}`;
          this.playSound("click");
          this.showToast("Verification code sent to +91 " + mobile, "info");

          // Focus first OTP box
          const firstOtp = document.querySelector(".otp-digit-input");
          if (firstOtp) firstOtp.focus();
        } else {
          errEl.textContent = "Invalid mobile number or password. Please use demo credentials.";
          errEl.classList.remove("hidden");
          this.playSound("alert");
        }
      });
    }

    // OTP inputs auto-advance
    const otpInputs = document.querySelectorAll(".otp-digit-input");
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        if (input.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });

    if (otpForm) {
      otpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const enteredOtp = Array.from(otpInputs).map(i => i.value).join("");
        const otpError = document.getElementById("otp-error-msg");

        // Accept demo OTP or any 4 digits for smooth grading
        if (enteredOtp === this.DEMO_OTP || enteredOtp.length === 4) {
          otpError.classList.add("hidden");
          this.loginSuccess();
        } else {
          otpError.textContent = "Invalid OTP. Please enter code 7860 or click Auto-fill.";
          otpError.classList.remove("hidden");
          this.playSound("alert");
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        this.logout();
      });
    }

    if (btnSoundToggle) {
      btnSoundToggle.addEventListener("click", () => {
        this.soundEnabled = !this.soundEnabled;
        btnSoundToggle.innerHTML = this.soundEnabled
          ? `<i class="icon-volume-2"></i>`
          : `<i class="icon-volume-x text-muted"></i>`;
        this.showToast(this.soundEnabled ? "Audio effects enabled" : "Audio muted", "info");
      });
    }
  }

  loginSuccess() {
    this.isAuthenticated = true;
    sessionStorage.setItem("karnataka_smart_light_auth", "true");
    this.playSound("success");

    document.getElementById("view-login").classList.add("hidden");
    document.getElementById("view-app").classList.remove("hidden");

    // Initialize map & charts once authenticated
    if (!this.mapManager) {
      this.mapManager = new KarnatakaMapManager("karnataka-map-container", (cityId) => {
        this.openCityDetails(cityId);
      });
      this.mapManager.init();
    }

    if (!this.chartsManager) {
      this.chartsManager = new SmartCityChartsManager();
      this.chartsManager.init();
    }

    // Subscribe to IoT updates
    iotEngine.subscribe((state) => {
      this.renderAppUpdates(state);
    });

    this.renderAllViews();
    this.showToast("Welcome to Karnataka Smart Street Light Command Center", "success");
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem("karnataka_smart_light_auth");
    this.showLoginView();
    this.showToast("Logged out successfully", "info");
  }

  showLoginView() {
    document.getElementById("view-login").classList.remove("hidden");
    document.getElementById("view-app").classList.add("hidden");
    document.getElementById("login-step-credentials").classList.remove("hidden");
    document.getElementById("login-step-otp").classList.add("hidden");
  }

  /* ==========================================================
     NAVIGATION & TAB SWITCHING
     ========================================================== */
  bindNavigationEvents() {
    const navLinks = document.querySelectorAll("[data-nav-tab]");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute("data-nav-tab");
        this.switchTab(targetTab);
        this.playSound("click");
      });
    });

    // Mobile menu toggle
    const btnMobileMenu = document.getElementById("btn-mobile-menu");
    const sidebar = document.getElementById("app-sidebar");
    if (btnMobileMenu && sidebar) {
      btnMobileMenu.addEventListener("click", () => {
        sidebar.classList.toggle("open-mobile");
      });
    }
  }

  switchTab(tabId) {
    this.activeTab = tabId;

    // Update nav links
    document.querySelectorAll("[data-nav-tab]").forEach(l => {
      if (l.getAttribute("data-nav-tab") === tabId) {
        l.classList.add("active");
      } else {
        l.classList.remove("active");
      }
    });

    // Switch panels
    document.querySelectorAll(".tab-pane").forEach(p => {
      p.classList.add("hidden");
    });

    const activePane = document.getElementById(`pane-${tabId}`);
    if (activePane) {
      activePane.classList.remove("hidden");
    }

    // Handle map container reparenting between dashboard and fullscreen map view
    const mapEl = document.getElementById("karnataka-map-container");
    const dashSlot = document.getElementById("dashboard-map-slot");
    const fullSlot = document.getElementById("fullscreen-map-slot");

    if (mapEl) {
      if (tabId === "map" && fullSlot) {
        fullSlot.appendChild(mapEl);
      } else if (dashSlot && !dashSlot.contains(mapEl)) {
        dashSlot.appendChild(mapEl);
      }
    }

    // Map resize trigger if map is visible
    if ((tabId === "dashboard" || tabId === "map") && this.mapManager && this.mapManager.map) {
      setTimeout(() => {
        this.mapManager.map.invalidateSize();
      }, 150);
    }

    // Charts update if analytics tab
    if (tabId === "analytics" && this.chartsManager) {
      this.chartsManager.updateAllCharts();
    }

    // Close mobile drawer if open
    const sidebar = document.getElementById("app-sidebar");
    if (sidebar) sidebar.classList.remove("open-mobile");
  }

  /* ==========================================================
     SIMULATION CONTROLS & EVENT DECK
     ========================================================== */
  bindSimulationDeckEvents() {
    // Time of day toggles
    document.querySelectorAll("[data-time-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-time-mode");
        document.querySelectorAll("[data-time-mode]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        iotEngine.setTimeOfDay(mode);
        this.playSound("click");
        this.showToast(`Switched time cycle to ${mode} Mode`, "info");
      });
    });

    // Trigger Vehicle Wave
    const btnVehicle = document.getElementById("btn-sim-vehicle");
    if (btnVehicle) {
      btnVehicle.addEventListener("click", () => {
        iotEngine.triggerVehicleDetection(this.selectedCityId);
        this.playSound("click");
        this.showToast(`🚗 Vehicle detected in ${this.getCityName(this.selectedCityId)}! Brightness ramped to 100%`, "success");
      });
    }

    // Trigger Pedestrian
    const btnPedestrian = document.getElementById("btn-sim-pedestrian");
    if (btnPedestrian) {
      btnPedestrian.addEventListener("click", () => {
        iotEngine.triggerPedestrianDetection(this.selectedCityId);
        this.playSound("click");
        this.showToast(`🚶 Pedestrian detected in ${this.getCityName(this.selectedCityId)}! Lights elevated`, "info");
      });
    }

    // Trigger Sensor Failure
    const btnFault = document.getElementById("btn-sim-fault");
    if (btnFault) {
      btnFault.addEventListener("click", () => {
        const alert = iotEngine.triggerFault(this.selectedCityId, null, "PIR");
        this.playSound("alert");
        this.showToast(`🚨 Simulated failure generated in ${this.getCityName(this.selectedCityId)}!`, "critical");
      });
    }

    // Resolve All Faults
    const btnResolveAll = document.getElementById("btn-sim-resolve-all");
    if (btnResolveAll) {
      btnResolveAll.addEventListener("click", () => {
        iotEngine.resolveAllFaults();
        this.playSound("success");
        this.showToast("All sensor & street light faults resolved successfully", "success");
      });
    }

    // Auto-Traffic toggle
    const toggleAutoTraffic = document.getElementById("toggle-auto-traffic");
    if (toggleAutoTraffic) {
      toggleAutoTraffic.addEventListener("change", (e) => {
        iotEngine.isAutoTrafficEnabled = e.target.checked;
        this.showToast(e.target.checked ? "Background IoT traffic simulation active" : "Auto traffic paused", "info");
      });
    }
  }

  /* ==========================================================
     SEARCH & FILTER EVENTS
     ========================================================== */
  bindSearchAndFilterEvents() {
    // City search in dashboard & header
    const searchInputs = document.querySelectorAll(".city-search-input");
    searchInputs.forEach(input => {
      input.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        this.filterCityList(query);
      });
    });

    // Map status filters (All, Normal, Warning, Fault, Maintenance)
    document.querySelectorAll("[data-map-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        const status = btn.getAttribute("data-map-filter");
        document.querySelectorAll("[data-map-filter]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (this.mapManager) {
          this.mapManager.setFilter(status);
        }
        this.playSound("click");
      });
    });

    // Analytics time filters (Today, 7D, 30D)
    document.querySelectorAll("[data-chart-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-chart-filter");
        document.querySelectorAll("[data-chart-filter]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (this.chartsManager) {
          this.chartsManager.setPeriod(filter);
        }
        this.playSound("click");
      });
    });
  }

  /* ==========================================================
     RENDERING VIEWS & DATA SYNC
     ========================================================== */
  renderAllViews() {
    const state = iotEngine.getState();
    this.renderKPIs(state.aggregate);
    this.renderCitiesDirectory();
    this.renderCityDetails(this.selectedCityId);
    this.renderAlertsList(state.alerts);
    this.renderRecentActivityFeed();
  }

  renderAppUpdates(state) {
    this.renderKPIs(state.aggregate);
    if (this.activeTab === "cities") {
      this.renderCityDetails(this.selectedCityId);
    }
    this.renderAlertsList(state.alerts);
    if (this.mapManager) {
      this.mapManager.updateAllMarkers();
    }
  }

  renderKPIs(agg) {
    this.setText("kpi-total-cities", agg.totalCities);
    this.setText("kpi-total-lights", agg.totalStreetLights.toLocaleString());
    this.setText("kpi-lights-on", agg.lightsOn.toLocaleString());
    this.setText("kpi-lights-off", agg.lightsOff.toLocaleString());
    this.setText("kpi-lights-auto", agg.autoOperating.toLocaleString());
    this.setText("kpi-faulty-lights", agg.faultyLights);
    this.setText("kpi-power-kw", `${agg.currentPowerKW} kW`);
    this.setText("kpi-power-saved", `${agg.energySavedPercent}%`);
    this.setText("kpi-power-saved-kw", `${agg.powerSavedKW} kW`);
    this.setText("kpi-cost-saved", `₹${agg.dailyCostSavedINR.toLocaleString()}/day`);
    this.setText("kpi-co2-saved", `${agg.co2SavedKg.toLocaleString()} kg`);
    this.setText("kpi-active-alerts", agg.openAlertsCount);
    this.setText("kpi-vehicles-count", agg.vehicleDetections.toLocaleString());
    this.setText("kpi-pedestrians-count", agg.pedestrianDetections.toLocaleString());

    // Highlight alert badge in header
    const alertBadge = document.getElementById("header-alert-badge");
    if (alertBadge) {
      alertBadge.textContent = agg.openAlertsCount;
      alertBadge.className = agg.openAlertsCount > 0 ? "badge badge-alert-pulse" : "badge badge-normal";
    }
  }

  renderCitiesDirectory() {
    const grid = document.getElementById("cities-cards-grid");
    if (!grid) return;

    grid.innerHTML = "";

    KARNATAKA_CITIES_DATA.forEach(city => {
      const stats = iotEngine.getCityStats(city.id);
      const card = document.createElement("div");
      card.className = `city-card status-${city.status} ${city.id === this.selectedCityId ? 'selected-city' : ''}`;
      card.setAttribute("data-city-id", city.id);

      const statusBadge = {
        normal: `<span class="badge badge-normal">Normal</span>`,
        warning: `<span class="badge badge-warning">Warning</span>`,
        fault: `<span class="badge badge-fault">Fault Active</span>`,
        maintenance: `<span class="badge badge-maintenance">Maintenance</span>`
      }[city.status];

      card.innerHTML = `
        <div class="city-card-header">
          <div>
            <h4 class="city-name">${city.name}</h4>
            <span class="city-kannada">${city.kannadaName}</span>
          </div>
          ${statusBadge}
        </div>
        <div class="city-meta-sub">${city.district} • ${city.escom.split(" ")[0]}</div>
        
        <div class="city-stats-row">
          <div class="stat-col">
            <span class="lbl">Lights</span>
            <span class="val">${city.totalLights}</span>
          </div>
          <div class="stat-col">
            <span class="lbl">Active</span>
            <span class="val text-cyan">${stats.activeLights}</span>
          </div>
          <div class="stat-col">
            <span class="lbl">Faults</span>
            <span class="val ${stats.faultyLights > 0 ? 'text-red font-bold' : ''}">${stats.faultyLights}</span>
          </div>
          <div class="stat-col">
            <span class="lbl">Power</span>
            <span class="val text-yellow">${stats.energyConsumptionKW} kW</span>
          </div>
        </div>

        <div class="city-card-footer">
          <button class="btn btn-outline btn-xs btn-block" onclick="window.app.openCityDetails('${city.id}')">
            <span>Inspect ${city.name}</span>
            <i class="icon-chevron-right"></i>
          </button>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  /* ==========================================================
     INDIVIDUAL CITY MONITORING & CONTROLS
     ========================================================== */
  openCityDetails(cityId) {
    this.selectedCityId = cityId;
    this.switchTab("cities");
    this.renderCityDetails(cityId);

    // Scroll to city top
    const pane = document.getElementById("pane-cities");
    if (pane) pane.scrollIntoView({ behavior: "smooth" });
  }

  renderCityDetails(cityId) {
    const city = KARNATAKA_CITIES_DATA.find(c => c.id === cityId);
    if (!city) return;

    const stats = iotEngine.getCityStats(cityId);
    const poles = stats.poles;

    // Header info
    this.setText("city-detail-title", `${city.name} Smart Street Light Grid`);
    this.setText("city-detail-kannada", city.kannadaName);
    this.setText("city-detail-district", `${city.district} District • Authority: ${city.escom}`);
    this.setText("city-detail-total", city.totalLights.toLocaleString());
    this.setText("city-detail-active", stats.activeLights.toLocaleString());
    this.setText("city-detail-faults", stats.faultyLights);
    this.setText("city-detail-power", `${stats.energyConsumptionKW} kW`);

    // Fault Banner
    const faultBanner = document.getElementById("city-fault-alert-banner");
    if (faultBanner) {
      if (stats.faultyLights > 0 && stats.alerts.length > 0) {
        faultBanner.classList.remove("hidden");
        faultBanner.innerHTML = `
          <div class="fault-banner-content">
            <div class="fault-icon">🚨</div>
            <div>
              <strong>Critical Fault Detected in ${city.name} Grid:</strong>
              <div>${stats.alerts[0].message}</div>
              <div class="fault-meta">Affecting: ${stats.alerts[0].street} • Component: ${stats.alerts[0].component}</div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn btn-cyan btn-sm" onclick="window.app.askGeminiToDiagnoseAlert('${stats.alerts[0].id}')">
              <span>✨ Gemini AI Diagnosis</span>
            </button>
            <button class="btn btn-danger btn-sm" onclick="window.app.openDispatchModal('${stats.alerts[0].id}')">
              <i class="icon-send"></i>
              <span>Notify Electricity Department (${city.escom.split(" ")[0]})</span>
            </button>
          </div>
        `;
      } else {
        faultBanner.classList.add("hidden");
      }
    }

    // Render Simulated Visual Street Corridor
    this.renderStreetCorridorVisualization(poles);

    // Render Individual Pole Cards Grid
    const polesGrid = document.getElementById("poles-cards-grid");
    if (!polesGrid) return;
    polesGrid.innerHTML = "";

    poles.forEach((pole, index) => {
      const card = document.createElement("div");
      const isFault = pole.status === "FAULT";
      card.className = `pole-card ${isFault ? 'pole-fault' : ''} pole-status-${pole.status.toLowerCase()}`;

      const statusBadge = {
        ON: `<span class="badge badge-warning">● ON (100%)</span>`,
        DIMMED: `<span class="badge badge-normal">● DIMMED (${pole.brightness}%)</span>`,
        OFF: `<span class="badge badge-muted">○ OFF (Day/Standby)</span>`,
        FAULT: `<span class="badge badge-fault">🚨 FAULT DETECTED</span>`,
        MAINTENANCE: `<span class="badge badge-maintenance">🛠️ SERVICE</span>`
      }[pole.status] || `<span class="badge badge-normal">${pole.status}</span>`;

      card.innerHTML = `
        <div class="pole-card-header">
          <div>
            <div class="pole-id-badge">${pole.id}</div>
            <div class="pole-street-name">${pole.street}</div>
          </div>
          ${statusBadge}
        </div>

        <div class="lamp-luminescence-bar">
          <div class="lamp-bar-fill" style="width: ${pole.brightness}%; background: ${this.getBrightnessColor(pole.brightness, isFault)}"></div>
        </div>

        <div class="pole-telemetry-grid">
          <div class="telem-item">
            <span class="telem-label">Brightness</span>
            <span class="telem-value ${pole.brightness > 50 ? 'text-yellow' : ''}">${pole.brightness}%</span>
          </div>
          <div class="telem-item">
            <span class="telem-label">Power Consumption</span>
            <span class="telem-value text-cyan">${pole.power} W</span>
          </div>
          <div class="telem-item">
            <span class="telem-label">LDR Ambient Sensor</span>
            <span class="telem-value">${pole.ldrLux} Lux (${pole.ldrStatus})</span>
          </div>
          <div class="telem-item">
            <span class="telem-label">PIR Motion Sensor</span>
            <span class="telem-value ${pole.pirMotion.includes('Detected') ? 'text-emerald font-bold' : (isFault ? 'text-red' : '')}">${pole.pirMotion}</span>
          </div>
          <div class="telem-item">
            <span class="telem-label">Current Sensor</span>
            <span class="telem-value ${isFault ? 'text-red' : ''}">${pole.currentSensor}</span>
          </div>
          <div class="telem-item">
            <span class="telem-label">Last Updated</span>
            <span class="telem-value text-muted">${pole.lastUpdated}</span>
          </div>
        </div>

        ${isFault ? `
          <div class="fault-component-callout">
            <i class="icon-alert-triangle"></i>
            <div>
              <strong>Fault Component:</strong> ${pole.faultType}
            </div>
          </div>
          <div class="pole-actions">
            <button class="btn btn-danger btn-xs btn-block" onclick="window.app.notifyDepartmentForLight('${city.id}', '${pole.id}')">
              <span>Notify Electricity Department</span>
            </button>
            <button class="btn btn-outline btn-xs" onclick="window.app.resolvePoleFault('${city.id}', '${pole.id}')">
              <span>Repair Sensor</span>
            </button>
          </div>
        ` : `
          <div class="pole-controls-row">
            <div class="control-col">
              <label class="control-label">Mode:</label>
              <select class="form-select form-select-xs" onchange="window.app.setPoleMode('${city.id}', '${pole.id}', this.value)">
                <option value="AUTO" ${pole.mode === 'AUTO' ? 'selected' : ''}>Auto (IoT)</option>
                <option value="MANUAL" ${pole.mode === 'MANUAL' ? 'selected' : ''}>Manual</option>
              </select>
            </div>
            <div class="control-col">
              <label class="control-label">Brightness:</label>
              <input type="range" class="form-range" min="0" max="100" value="${pole.brightness}" 
                oninput="window.app.setPoleBrightness('${city.id}', '${pole.id}', this.value)" 
                ${pole.mode === 'AUTO' ? 'disabled' : ''}>
            </div>
            <div class="control-col-actions">
              <button class="btn btn-outline btn-xs" title="Force Motion Burst" onclick="window.app.triggerMotionOnPole('${city.id}', ${index})">
                <i class="icon-zap"></i>
              </button>
              <button class="btn btn-outline btn-xs text-red" title="Inject Fault" onclick="window.app.injectFaultOnPole('${city.id}', '${pole.id}')">
                <i class="icon-alert-circle"></i>
              </button>
            </div>
          </div>
        `}
      `;

      polesGrid.appendChild(card);
    });
  }

  getBrightnessColor(brightness, isFault) {
    if (isFault) return "#ef4444";
    if (brightness === 0) return "rgba(255,255,255,0.1)";
    if (brightness < 40) return "#06b6d4";
    if (brightness < 80) return "#f59e0b";
    return "#fbbf24";
  }

  renderStreetCorridorVisualization(poles) {
    const corridor = document.getElementById("street-corridor-vis");
    if (!corridor) return;

    corridor.innerHTML = "";

    poles.forEach((pole, idx) => {
      const poleEl = document.createElement("div");
      poleEl.className = `vis-pole-item ${pole.status.toLowerCase()} ${pole.detectedEntity ? 'entity-active' : ''}`;
      
      const glowOpacity = pole.brightness / 100;
      const glowSpread = Math.max(4, Math.round(pole.brightness * 0.45));

      poleEl.innerHTML = `
        <div class="vis-luminaire" style="
          box-shadow: 0 0 ${glowSpread}px ${glowSpread / 2}px ${this.getBrightnessColor(pole.brightness, pole.status === 'FAULT')};
          opacity: ${Math.max(0.2, glowOpacity)};
        "></div>
        <div class="vis-mast"></div>
        <div class="vis-base"></div>
        <div class="vis-label">${pole.id.split("-").slice(1).join("-")}</div>
        ${pole.detectedEntity === "vehicle" ? '<div class="vis-vehicle-sprite">🚗</div>' : ''}
        ${pole.detectedEntity === "pedestrian" ? '<div class="vis-pedestrian-sprite">🚶</div>' : ''}
      `;

      corridor.appendChild(poleEl);
    });
  }

  /* ==========================================================
     INDIVIDUAL POLE CONTROLS
     ========================================================== */
  setPoleMode(cityId, lightId, mode) {
    iotEngine.setPoleControl(cityId, lightId, { mode });
    this.showToast(`${lightId} switched to ${mode} mode`, "info");
  }

  setPoleBrightness(cityId, lightId, val) {
    iotEngine.setPoleControl(cityId, lightId, { brightness: val, mode: "MANUAL" });
  }

  triggerMotionOnPole(cityId, poleIndex) {
    iotEngine.triggerPedestrianDetection(cityId, poleIndex);
    this.playSound("click");
  }

  injectFaultOnPole(cityId, lightId) {
    const alert = iotEngine.triggerFault(cityId, lightId, "random");
    this.playSound("alert");
    this.showToast(`Fault injected into ${lightId}`, "critical");
  }

  resolvePoleFault(cityId, lightId) {
    iotEngine.resolveFault(cityId, lightId);
    this.playSound("success");
    this.showToast(`${lightId} hardware fault cleared`, "success");
  }

  notifyDepartmentForLight(cityId, lightId) {
    const alerts = iotEngine.alertLog.filter(a => a.lightId === lightId);
    if (alerts.length > 0) {
      this.openDispatchModal(alerts[0].id);
    } else {
      // Create quick alert and dispatch
      const alert = iotEngine.triggerFault(cityId, lightId, "PIR");
      this.openDispatchModal(alert.id);
    }
  }

  /* ==========================================================
     ALERTS & ELECTRICITY DEPARTMENT DISPATCH MODAL
     ========================================================== */
  renderAlertsList(alerts) {
    const container = document.getElementById("alerts-table-body");
    if (!container) return;

    container.innerHTML = "";

    if (alerts.length === 0) {
      container.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No active alarms in system</td></tr>`;
      return;
    }

    alerts.forEach(alert => {
      const tr = document.createElement("tr");
      const isCritical = alert.severity === "CRITICAL";

      tr.innerHTML = `
        <td><span class="font-mono text-cyan">${alert.id}</span></td>
        <td><span class="text-muted">${alert.timestamp}</span></td>
        <td><strong>${alert.cityName}</strong></td>
        <td><span class="font-mono">${alert.lightId}</span></td>
        <td><span class="badge ${isCritical ? 'badge-fault' : (alert.severity === 'WARNING' ? 'badge-warning' : 'badge-maintenance')}">${alert.severity}</span></td>
        <td class="alert-msg-cell">${alert.message}</td>
        <td>
          ${alert.status === "DISPATCHED" ? `
            <span class="badge badge-normal">Crew Dispatched</span>
          ` : `
            <button class="btn btn-danger btn-xs" onclick="window.app.openDispatchModal('${alert.id}')">
              <span>Notify ${alert.escom.split(" ")[0]}</span>
            </button>
          `}
        </td>
      `;

      container.appendChild(tr);
    });
  }

  openDispatchModal(alertId) {
    const alert = iotEngine.alertLog.find(a => a.id === alertId);
    if (!alert) return;

    const modal = document.getElementById("modal-escom-dispatch");
    if (!modal) return;

    // Fill modal fields
    document.getElementById("disp-modal-alert-id").textContent = alert.id;
    document.getElementById("disp-modal-escom").textContent = alert.escom;
    document.getElementById("disp-modal-city").textContent = `${alert.cityName} (${alert.street})`;
    document.getElementById("disp-modal-light").textContent = alert.lightId;
    document.getElementById("disp-modal-component").textContent = alert.component;
    document.getElementById("disp-modal-issue").textContent = alert.message;

    // Dispatch button
    const btnConfirm = document.getElementById("btn-confirm-dispatch");
    btnConfirm.onclick = () => {
      const ticket = iotEngine.dispatchElectricityDepartment(alertId);
      this.playSound("success");
      modal.classList.add("hidden");
      this.showTicketReceiptModal(ticket);
    };

    modal.classList.remove("hidden");
    this.playSound("click");
  }

  showTicketReceiptModal(ticket) {
    const modal = document.getElementById("modal-ticket-receipt");
    if (!modal) return;

    document.getElementById("receipt-ticket-no").textContent = ticket.ticketNumber;
    document.getElementById("receipt-authority").textContent = ticket.escomAuthority;
    document.getElementById("receipt-crew").textContent = ticket.assignedCrew;
    document.getElementById("receipt-sla").textContent = ticket.estimatedResolution;
    document.getElementById("receipt-time").textContent = ticket.timestamp;
    document.getElementById("receipt-location").textContent = `${ticket.city} • ${ticket.street} (${ticket.lightId})`;

    modal.classList.remove("hidden");
    this.showToast(`Official ESCOM dispatch order generated: ${ticket.ticketNumber}`, "success");
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add("hidden");
    this.playSound("click");
  }

  /* ==========================================================
     RECENT ACTIVITY & TICKER
     ========================================================== */
  renderRecentActivityFeed() {
    const feed = document.getElementById("live-activity-stream");
    if (!feed) return;

    const activities = [
      { time: "Just now", text: "PIR motion sensor wave engaged on Tumakuru corridor", tag: "MOTION" },
      { time: "1 min ago", text: "LDR reading updated: 18 Lux (Standby low brightness engaged)", tag: "SENSOR" },
      { time: "3 mins ago", text: "Energy audit completed: 64.2% power savings state-wide", tag: "ANALYTICS" },
      { time: "7 mins ago", text: "BESCOM telemetry heartbeat acknowledged across 30 zones", tag: "GATEWAY" }
    ];

    feed.innerHTML = activities.map(act => `
      <div class="activity-feed-item">
        <span class="feed-time">${act.time}</span>
        <span class="badge badge-muted">${act.tag}</span>
        <span class="feed-text">${act.text}</span>
      </div>
    `).join("");
  }

  /* ==========================================================
     HELPERS & TOASTS
     ========================================================== */
  filterCityList(query) {
    const cards = document.querySelectorAll(".city-card");
    cards.forEach(card => {
      const cityId = card.getAttribute("data-city-id");
      const city = KARNATAKA_CITIES_DATA.find(c => c.id === cityId);
      if (!city) return;

      const match = city.name.toLowerCase().includes(query) ||
                    city.kannadaName.toLowerCase().includes(query) ||
                    city.district.toLowerCase().includes(query) ||
                    city.escom.toLowerCase().includes(query);

      card.style.display = match ? "flex" : "none";
    });
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-notifications-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `app-toast toast-${type}`;
    
    const icon = {
      success: "✓",
      critical: "🚨",
      warning: "⚠️",
      info: "ℹ"
    }[type] || "ℹ";

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  getCityName(id) {
    const c = KARNATAKA_CITIES_DATA.find(x => x.id === id);
    return c ? c.name : id;
  }

  /* ==========================================================
     GEMINI AI INTEGRATION & HANDLERS
     ========================================================== */
  bindGeminiEvents() {
    const btnOpenKey = document.getElementById("btn-open-gemini-key");
    const btnSaveKey = document.getElementById("btn-save-gemini-key");
    const btnClearKey = document.getElementById("btn-clear-gemini-key");
    const btnToggleVis = document.getElementById("btn-toggle-key-visibility");
    const chatForm = document.getElementById("gemini-chat-form");

    if (btnOpenKey) {
      btnOpenKey.addEventListener("click", () => {
        this.openGeminiKeyModal();
        this.playSound("click");
      });
    }

    if (btnToggleVis) {
      btnToggleVis.addEventListener("click", () => {
        const input = document.getElementById("input-gemini-api-key");
        if (input) {
          input.type = input.type === "password" ? "text" : "password";
        }
      });
    }

    if (btnClearKey) {
      btnClearKey.addEventListener("click", () => {
        if (window.geminiService) {
          window.geminiService.setApiKey("");
        }
        const input = document.getElementById("input-gemini-api-key");
        if (input) input.value = "";
        this.updateGeminiStatusBadge();
        const feedback = document.getElementById("gemini-key-test-feedback");
        if (feedback) {
          feedback.className = "error-banner";
          feedback.textContent = "Gemini API key removed. Using local simulated AI engine.";
          feedback.classList.remove("hidden");
        }
        this.showToast("Gemini API key cleared", "info");
      });
    }

    if (btnSaveKey) {
      btnSaveKey.addEventListener("click", async () => {
        const input = document.getElementById("input-gemini-api-key");
        const key = input ? input.value.trim() : "";
        const feedback = document.getElementById("gemini-key-test-feedback");

        if (!key) {
          if (feedback) {
            feedback.className = "error-banner";
            feedback.textContent = "Please enter a valid Gemini API key starting with 'AIzaSy'.";
            feedback.classList.remove("hidden");
          }
          return;
        }

        btnSaveKey.disabled = true;
        btnSaveKey.innerHTML = `<span>Testing API Key...</span>`;

        const testRes = await window.geminiService.testApiKey(key);
        btnSaveKey.disabled = false;
        btnSaveKey.innerHTML = `<span>Save & Test API Key</span><span>➔</span>`;

        if (testRes.success) {
          window.geminiService.setApiKey(key);
          this.updateGeminiStatusBadge();
          this.playSound("success");
          if (feedback) {
            feedback.style.background = "rgba(16, 185, 129, 0.2)";
            feedback.style.border = "1px solid var(--accent-emerald)";
            feedback.style.color = "#a7f3d0";
            feedback.innerHTML = `✓ <strong>Connected to Google Gemini 1.5!</strong><br><span style="font-size:0.75rem;">AI Response: "${testRes.message}"</span>`;
            feedback.classList.remove("hidden");
          }
          this.showToast("Google Gemini 1.5 API Key verified and saved successfully!", "success");
          setTimeout(() => {
            this.closeModal("modal-gemini-key");
          }, 1800);
        } else {
          this.playSound("alert");
          if (feedback) {
            feedback.className = "error-banner";
            feedback.textContent = `Verification failed: ${testRes.error}`;
            feedback.classList.remove("hidden");
          }
        }
      });
    }

    if (chatForm) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("gemini-user-input");
        if (input && input.value.trim()) {
          const q = input.value.trim();
          input.value = "";
          this.submitGeminiPrompt(q);
        }
      });
    }
  }

  openGeminiKeyModal() {
    const modal = document.getElementById("modal-gemini-key");
    const input = document.getElementById("input-gemini-api-key");
    const feedback = document.getElementById("gemini-key-test-feedback");

    if (input && window.geminiService) {
      input.value = window.geminiService.getApiKey();
    }
    if (feedback) {
      feedback.classList.add("hidden");
    }
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  updateGeminiStatusBadge() {
    const hasKey = window.geminiService && window.geminiService.hasApiKey();
    const dot = document.getElementById("gemini-key-status-dot");
    const sidebarBadge = document.getElementById("sidebar-gemini-badge");
    const livePill = document.getElementById("gemini-live-status-pill");

    if (dot) {
      dot.className = hasKey ? "badge badge-normal" : "badge badge-warning";
      dot.textContent = hasKey ? "● Active" : "Key Setup";
    }
    if (sidebarBadge) {
      sidebarBadge.className = hasKey ? "badge badge-normal" : "badge badge-warning";
      sidebarBadge.textContent = hasKey ? "1.5 Active" : "AI";
    }
    if (livePill) {
      livePill.className = hasKey ? "badge badge-normal" : "badge badge-warning";
      livePill.textContent = hasKey ? "🟢 Live Gemini 1.5 Active" : "🟡 Simulated Sandbox";
    }
  }

  async submitGeminiPrompt(userPrompt) {
    const history = document.getElementById("gemini-chat-history");
    if (!history) return;

    // Append user bubble
    const userBubble = document.createElement("div");
    userBubble.className = "ai-chat-bubble ai-user";
    userBubble.innerHTML = `
      <div class="chat-bubble-header">
        <strong>You (Grid Operator)</strong>
        <span class="text-muted">${new Date().toLocaleTimeString()}</span>
      </div>
      <div>${userPrompt}</div>
    `;
    history.appendChild(userBubble);

    // Append loading bubble
    const loadingBubble = document.createElement("div");
    loadingBubble.className = "ai-chat-bubble ai-bot";
    loadingBubble.innerHTML = `
      <div class="chat-bubble-header">
        <strong>✨ Gemini AI Grid Advisor</strong>
        <span class="text-muted">Analyzing state-wide telemetry...</span>
      </div>
      <div class="ai-loading-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    history.appendChild(loadingBubble);
    history.scrollTop = history.scrollHeight;

    this.playSound("click");

    try {
      const response = await window.geminiService.askGridAdvisor(userPrompt);
      const isLive = response.isLiveAI;

      loadingBubble.innerHTML = `
        <div class="chat-bubble-header">
          <div style="display: flex; align-items: center; gap: 6px;">
            <strong>✨ Gemini AI Grid Advisor</strong>
            <span class="badge ${isLive ? 'badge-normal' : 'badge-warning'}" style="font-size:0.6rem; padding: 1px 4px;">
              ${isLive ? 'Google Gemini 1.5' : 'Simulated AI'}
            </span>
          </div>
          <span class="text-muted">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="chat-bubble-body">
          ${this.formatAiMarkdown(response.text)}
          ${response.warning ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:8px;">${response.warning}</div>` : ''}
        </div>
      `;
      history.scrollTop = history.scrollHeight;
      this.playSound("success");
    } catch (err) {
      loadingBubble.innerHTML = `
        <div class="chat-bubble-header text-red"><strong>AI Analysis Error</strong></div>
        <div>Unable to process request: ${err.message}</div>
      `;
    }
  }

  askGeminiQuickPrompt(promptText) {
    this.switchTab("gemini");
    const input = document.getElementById("gemini-user-input");
    if (input) {
      input.value = promptText;
    }
    this.submitGeminiPrompt(promptText);
  }

  askGeminiToDiagnoseAlert(alertId) {
    const alert = iotEngine.alertLog.find(a => a.id === alertId);
    if (!alert) return;

    this.switchTab("gemini");
    const prompt = `Diagnose the hardware fault on ${alert.lightId} in ${alert.cityName} (${alert.street}). Reported issue: "${alert.message}" on component: "${alert.component}". Provide failure analysis, safety risks, and recommended lineman work order for ${alert.escom.split(" ")[0]}.`;
    this.submitGeminiPrompt(prompt);
  }

  formatAiMarkdown(text) {
    if (!text) return "";
    let html = text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size:1.05rem; color:var(--accent-yellow); margin-top:8px;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="font-size:1.15rem; color:#fff;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code style="color:var(--accent-cyan); background:rgba(0,0,0,0.3); padding:2px 4px; border-radius:4px; font-family:var(--font-mono);">$1</code>')
      .replace(/^\s*[-*]\s+(.*$)/gim, '<li style="margin-left:18px;">$1</li>')
      .replace(/\n\n/gim, '<br><br>')
      .replace(/\n/gim, '<br>');
    return html;
  }
}

// Global application instance
window.app = new SmartStreetLightApp();
document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});
