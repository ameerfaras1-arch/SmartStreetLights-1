/**
 * IoT Simulation Engine & State Machine
 * Project: Smart Street Light Management System
 * Simulates LDR, PIR, Current Sensor, Vehicle/Pedestrian Waves, and Energy Analytics
 */

class IoTSimulationEngine {
  constructor() {
    this.timeOfDay = "NIGHT"; // "DAY", "DUSK", "NIGHT"
    this.simHour = 20; // 8:00 PM
    this.isAutoTrafficEnabled = true;
    this.simSpeed = 1; // 1x, 5x, 10x
    this.trafficCounter = {
      vehicles: 1240,
      pedestrians: 875
    };
    this.alertLog = [
      {
        id: "ALT-9042",
        timestamp: new Date(Date.now() - 1000 * 60 * 14).toLocaleTimeString(),
        cityId: "tumakuru",
        cityName: "Tumakuru",
        lightId: "TMK-SL-104",
        street: "BH Road Corridor - Pole 104",
        severity: "CRITICAL",
        component: "PIR Motion Sensor",
        message: "⚠️ Street Light SL-104 in Tumakuru has reported a PIR sensor failure.",
        status: "OPEN",
        escom: "BESCOM (Bangalore Electricity Supply Company)"
      },
      {
        id: "ALT-9038",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(),
        cityId: "ballari",
        cityName: "Ballari",
        lightId: "BAL-SL-102",
        street: "Siruguppa Road Highway",
        severity: "WARNING",
        component: "LDR Lux Sensor",
        message: "⚠️ Street Light BAL-SL-102 in Ballari detected LDR sensor calibration drift (+18%).",
        status: "OPEN",
        escom: "GESCOM (Gulbarga Electricity Supply Company)"
      },
      {
        id: "ALT-9011",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleTimeString(),
        cityId: "uttara-kannada",
        cityName: "Uttara Kannada",
        lightId: "UTT-SL-102",
        street: "Karwar Marine Drive",
        severity: "MAINTENANCE",
        component: "Luminaire Enclosure",
        message: "ℹ️ Scheduled preventative maintenance ticket underway for Karwar Coastal sector.",
        status: "IN_PROGRESS",
        escom: "HESCOM (Hubli Electricity Supply Company)"
      }
    ];

    this.ticketsDispatched = [];
    this.listeners = [];
    this.tickerInterval = null;
    this.waveIntervals = [];

    this.init();
  }

  init() {
    // Start background simulation cycle
    this.startSimulationLoop();
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.getState());
      } catch (e) {
        console.error("Simulation listener error:", e);
      }
    });
  }

  setTimeOfDay(mode) {
    this.timeOfDay = mode;
    if (mode === "DAY") {
      this.simHour = 12; // 12:00 PM
    } else if (mode === "DUSK") {
      this.simHour = 18; // 6:00 PM
    } else {
      this.simHour = 22; // 10:00 PM
    }

    // Update all poles across all 30 cities
    KARNATAKA_CITIES_DATA.forEach(city => {
      const poles = CITY_STREET_LIGHTS[city.id];
      if (!poles) return;

      poles.forEach(pole => {
        if (pole.status === "FAULT") return; // Faulty stay faulty

        if (this.timeOfDay === "DAY") {
          pole.ldrLux = 850 + Math.floor(Math.random() * 80);
          pole.ldrStatus = "Bright Daylight (>800 Lux)";
          if (pole.mode === "AUTO") {
            pole.status = "OFF";
            pole.brightness = 0;
            pole.power = 0;
            pole.currentSensor = "Standby (0.00A)";
            pole.pirMotion = "Idle (Day Mode)";
          }
        } else if (this.timeOfDay === "DUSK") {
          pole.ldrLux = 180 + Math.floor(Math.random() * 30);
          pole.ldrStatus = "Dusk / Twilight (180 Lux)";
          if (pole.mode === "AUTO") {
            pole.status = "DIMMED";
            pole.brightness = 40;
            pole.power = 60;
            pole.currentSensor = "Normal (0.42A)";
          }
        } else {
          // Night
          pole.ldrLux = 15 + Math.floor(Math.random() * 15);
          pole.ldrStatus = "Night (<30 Lux)";
          if (pole.mode === "AUTO") {
            // Standby low brightness
            pole.status = "DIMMED";
            pole.brightness = 30;
            pole.power = 45;
            pole.currentSensor = "Normal (0.32A)";
          }
        }
        pole.lastUpdated = new Date().toLocaleTimeString();
      });
    });

    this.notify();
  }

  /**
   * Simulate a vehicle driving down a city road.
   * Lights sequentially ignite to 100% and then decay to standby.
   */
  triggerVehicleDetection(cityId = null) {
    const targetCityId = cityId || this.getRandomActiveCity();
    const city = KARNATAKA_CITIES_DATA.find(c => c.id === targetCityId);
    if (!city) return;

    const poles = CITY_STREET_LIGHTS[targetCityId];
    if (!poles || poles.length === 0) return;

    this.trafficCounter.vehicles += 1;

    // Trigger sequential wave down the poles
    poles.forEach((pole, index) => {
      setTimeout(() => {
        if (pole.status !== "FAULT" && pole.mode === "AUTO") {
          pole.pirMotion = "Vehicle Detected (PIR Trig)";
          pole.detectedEntity = "vehicle";
          pole.status = "ON";
          pole.brightness = 100;
          pole.power = pole.maxWattage; // 150W
          pole.currentSensor = "Peak (0.95A)";
          pole.lastUpdated = new Date().toLocaleTimeString();
          pole.lastMotionTimestamp = Date.now();
          this.notify();

          // After movement passes, decay after 4 seconds
          setTimeout(() => {
            if (pole.status !== "FAULT" && pole.mode === "AUTO" && pole.detectedEntity === "vehicle") {
              // Smooth step down
              pole.pirMotion = "Idle";
              pole.detectedEntity = null;
              if (this.timeOfDay === "DAY") {
                pole.status = "OFF";
                pole.brightness = 0;
                pole.power = 0;
                pole.currentSensor = "Standby (0.00A)";
              } else {
                pole.status = "DIMMED";
                pole.brightness = 30;
                pole.power = 45;
                pole.currentSensor = "Normal (0.32A)";
              }
              pole.lastUpdated = new Date().toLocaleTimeString();
              this.notify();
            }
          }, 4500);
        }
      }, index * 400); // 400ms delay between poles creates a moving vehicle wave!
    });
  }

  /**
   * Simulate a pedestrian walking down a street
   */
  triggerPedestrianDetection(cityId = null, poleIndex = null) {
    const targetCityId = cityId || this.getRandomActiveCity();
    const poles = CITY_STREET_LIGHTS[targetCityId];
    if (!poles || poles.length === 0) return;

    this.trafficCounter.pedestrians += 1;

    const pIdx = poleIndex !== null ? poleIndex : Math.floor(Math.random() * poles.length);
    const targetPole = poles[pIdx];

    if (targetPole && targetPole.status !== "FAULT" && targetPole.mode === "AUTO") {
      targetPole.pirMotion = "Pedestrian Detected";
      targetPole.detectedEntity = "pedestrian";
      targetPole.status = "ON";
      targetPole.brightness = 90;
      targetPole.power = 135;
      targetPole.currentSensor = "Active (0.85A)";
      targetPole.lastUpdated = new Date().toLocaleTimeString();
      targetPole.lastMotionTimestamp = Date.now();
      this.notify();

      setTimeout(() => {
        if (targetPole.status !== "FAULT" && targetPole.mode === "AUTO" && targetPole.detectedEntity === "pedestrian") {
          targetPole.pirMotion = "Idle";
          targetPole.detectedEntity = null;
          if (this.timeOfDay === "DAY") {
            targetPole.status = "OFF";
            targetPole.brightness = 0;
            targetPole.power = 0;
            targetPole.currentSensor = "Standby (0.00A)";
          } else {
            targetPole.status = "DIMMED";
            targetPole.brightness = 30;
            targetPole.power = 45;
            targetPole.currentSensor = "Normal (0.32A)";
          }
          targetPole.lastUpdated = new Date().toLocaleTimeString();
          this.notify();
        }
      }, 6000); // 6s duration for walking pedestrian
    }
  }

  /**
   * Inject sensor failure or lamp blowout
   */
  triggerFault(cityId = null, lightId = null, faultKind = "random") {
    const targetCityId = cityId || this.getRandomActiveCity();
    const city = KARNATAKA_CITIES_DATA.find(c => c.id === targetCityId);
    const poles = CITY_STREET_LIGHTS[targetCityId];
    if (!city || !poles) return null;

    let pole = lightId ? poles.find(p => p.id === lightId) : poles[Math.floor(Math.random() * poles.length)];
    if (!pole) pole = poles[0];

    const faultOptions = [
      {
        name: "PIR motion sensor failure",
        component: "PIR Sensor",
        pir: "HARDWARE FAILURE (ERR_PIR_TIMEOUT)",
        current: "Fault (0.00A)"
      },
      {
        name: "LED luminaire driver failure",
        component: "LED Driver Board",
        pir: "Normal",
        current: "Open Circuit (0.00A)"
      },
      {
        name: "LDR ambient lux sensor short-circuit",
        component: "LDR Photocell",
        pir: "Normal",
        current: "Abnormal Lux Reading (ERR_ADC_0)"
      },
      {
        name: "Overcurrent / Surge detected (2.8A)",
        component: "Power Surge Protector",
        pir: "Disabled",
        current: "SURGE OVERLOAD (2.85A)"
      }
    ];

    const selectedFault = faultKind === "random"
      ? faultOptions[Math.floor(Math.random() * faultOptions.length)]
      : (faultOptions.find(f => f.component.toLowerCase().includes(faultKind.toLowerCase())) || faultOptions[0]);

    pole.status = "FAULT";
    pole.brightness = 0;
    pole.power = 0;
    pole.faultType = selectedFault.name;
    pole.pirMotion = selectedFault.pir;
    pole.currentSensor = selectedFault.current;
    pole.lastUpdated = new Date().toLocaleTimeString();

    // Mark city status as fault if not already
    city.status = "fault";

    // Add to alerts log
    const alertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAlert = {
      id: alertId,
      timestamp: new Date().toLocaleTimeString(),
      cityId: city.id,
      cityName: city.name,
      lightId: pole.id,
      street: pole.street,
      severity: "CRITICAL",
      component: selectedFault.component,
      message: `⚠️ Street Light ${pole.id} in ${city.name} has reported a ${selectedFault.name}.`,
      status: "OPEN",
      escom: city.escom
    };

    this.alertLog.unshift(newAlert);
    this.notify();
    return newAlert;
  }

  /**
   * Resolve a fault or all faults
   */
  resolveFault(cityId, lightId) {
    const city = KARNATAKA_CITIES_DATA.find(c => c.id === cityId);
    const poles = CITY_STREET_LIGHTS[cityId];
    if (!city || !poles) return;

    const pole = poles.find(p => p.id === lightId);
    if (pole) {
      pole.status = this.timeOfDay === "DAY" ? "OFF" : "DIMMED";
      pole.brightness = this.timeOfDay === "DAY" ? 0 : 30;
      pole.power = this.timeOfDay === "DAY" ? 0 : 45;
      pole.faultType = null;
      pole.pirMotion = "Idle";
      pole.currentSensor = this.timeOfDay === "DAY" ? "Standby (0.00A)" : "Normal (0.32A)";
      pole.lastUpdated = new Date().toLocaleTimeString();

      // Check if city has any remaining faults
      const remainingFaults = poles.filter(p => p.status === "FAULT");
      if (remainingFaults.length === 0) {
        city.status = "normal";
      }

      // Mark alert resolved
      this.alertLog.forEach(alt => {
        if (alt.lightId === lightId) alt.status = "RESOLVED";
      });

      this.notify();
    }
  }

  /**
   * Resolve all faults across entire state
   */
  resolveAllFaults() {
    KARNATAKA_CITIES_DATA.forEach(city => {
      const poles = CITY_STREET_LIGHTS[city.id];
      if (poles) {
        poles.forEach(pole => {
          if (pole.status === "FAULT") {
            pole.status = this.timeOfDay === "DAY" ? "OFF" : "DIMMED";
            pole.brightness = this.timeOfDay === "DAY" ? 0 : 30;
            pole.power = this.timeOfDay === "DAY" ? 0 : 45;
            pole.faultType = null;
            pole.pirMotion = "Idle";
            pole.currentSensor = this.timeOfDay === "DAY" ? "Standby (0.00A)" : "Normal (0.32A)";
            pole.lastUpdated = new Date().toLocaleTimeString();
          }
        });
      }
      if (city.status === "fault") {
        city.status = "normal";
      }
    });

    this.alertLog.forEach(alt => {
      alt.status = "RESOLVED";
    });

    this.notify();
  }

  /**
   * Set individual street light controls (manual override)
   */
  setPoleControl(cityId, lightId, { mode, brightness, forceStatus }) {
    const poles = CITY_STREET_LIGHTS[cityId];
    if (!poles) return;
    const pole = poles.find(p => p.id === lightId);
    if (!pole) return;

    if (mode) pole.mode = mode;

    if (forceStatus) {
      pole.status = forceStatus;
      if (forceStatus === "OFF") {
        pole.brightness = 0;
        pole.power = 0;
        pole.currentSensor = "Standby (0.00A)";
      } else if (forceStatus === "ON") {
        pole.brightness = 100;
        pole.power = pole.maxWattage;
        pole.currentSensor = "Active (0.95A)";
      } else if (forceStatus === "DIMMED") {
        pole.brightness = 35;
        pole.power = 52;
        pole.currentSensor = "Normal (0.38A)";
      }
    } else if (brightness !== undefined) {
      pole.brightness = parseInt(brightness, 10);
      pole.power = Math.round((pole.brightness / 100) * pole.maxWattage);
      pole.status = pole.brightness === 0 ? "OFF" : (pole.brightness > 60 ? "ON" : "DIMMED");
      pole.currentSensor = pole.brightness === 0 ? "Standby (0.00A)" : `Manual (${(0.1 + (pole.brightness / 100) * 0.85).toFixed(2)}A)`;
    }

    pole.lastUpdated = new Date().toLocaleTimeString();
    this.notify();
  }

  /**
   * Dispatch official Karnataka ESCOM maintenance ticket
   */
  dispatchElectricityDepartment(alertId) {
    const alert = this.alertLog.find(a => a.id === alertId);
    if (!alert) return null;

    const ticketNumber = `KAR-ESCOM-${Math.floor(100000 + Math.random() * 900000)}`;
    const crewUnits = [
      "Rapid Response Unit #4 (Subdivision Central)",
      "Electrical Lineman Squad Alpha-2",
      "IoT Field Engineering Team B-7",
      "High-Mast Maintenance Crane Crew 1"
    ];
    const crew = crewUnits[Math.floor(Math.random() * crewUnits.length)];

    const ticket = {
      ticketNumber: ticketNumber,
      alertId: alert.id,
      timestamp: new Date().toLocaleString(),
      escomAuthority: alert.escom,
      city: alert.cityName,
      lightId: alert.lightId,
      street: alert.street,
      issue: alert.message,
      assignedCrew: crew,
      estimatedResolution: "Within 2 Hours (SLA Class-1 Smart City Priority)",
      status: "DISPATCHED"
    };

    alert.status = "DISPATCHED";
    this.ticketsDispatched.unshift(ticket);
    this.notify();
    return ticket;
  }

  /**
   * Start dynamic live background simulation loop
   */
  startSimulationLoop() {
    if (this.tickerInterval) clearInterval(this.tickerInterval);

    this.tickerInterval = setInterval(() => {
      // Auto traffic spawning
      if (this.isAutoTrafficEnabled) {
        const rand = Math.random();
        if (rand < 0.45) {
          // 45% chance: vehicle detected in random city
          this.triggerVehicleDetection();
        } else if (rand < 0.75) {
          // 30% chance: pedestrian detected
          this.triggerPedestrianDetection();
        }
      }

      // Small jitter to LDR and Power for realism
      const randomCity = this.getRandomActiveCity();
      const poles = CITY_STREET_LIGHTS[randomCity];
      if (poles && poles.length > 0) {
        const p = poles[Math.floor(Math.random() * poles.length)];
        if (p.status !== "FAULT" && p.status !== "OFF") {
          // Small realistic sensor variance ±1W
          const variance = (Math.random() * 2 - 1).toFixed(1);
          p.power = Math.max(0, Math.min(150, Math.round(p.power + parseFloat(variance))));
        }
      }

      this.notify();
    }, 3500);
  }

  getRandomActiveCity() {
    const list = ["bengaluru", "mysuru", "tumakuru", "hubballi", "mangaluru", "belagavi", "davanagere", "ballari"];
    return list[Math.floor(Math.random() * list.length)];
  }

  /**
   * Aggregate statistics across all 30 Karnataka cities
   */
  getAggregateStats() {
    let totalLightsMonitored = 0;
    let lightsOn = 0;
    let lightsOff = 0;
    let lightsDimmed = 0;
    let faultyLights = 0;
    let autoOperating = 0;
    let currentPowerWatts = 0;
    let conventionalPowerWatts = 0;

    KARNATAKA_CITIES_DATA.forEach(city => {
      totalLightsMonitored += city.totalLights;
      const poles = CITY_STREET_LIGHTS[city.id] || [];

      // Scale factors from sample poles to total city light count
      const poleCount = poles.length;
      if (poleCount === 0) return;

      const scale = city.totalLights / poleCount;

      poles.forEach(p => {
        if (p.status === "FAULT") {
          faultyLights += Math.round(1 * (p.id.includes("104") ? 1 : 2));
        } else if (p.status === "ON") {
          lightsOn += Math.round(1 * scale);
        } else if (p.status === "OFF") {
          lightsOff += Math.round(1 * scale);
        } else if (p.status === "DIMMED") {
          lightsDimmed += Math.round(1 * scale);
        }

        if (p.mode === "AUTO") {
          autoOperating += Math.round(1 * scale);
        }

        currentPowerWatts += (p.power * scale);
        // Conventional street lights are 150W whenever turned on at night (or 0 during day)
        conventionalPowerWatts += ((this.timeOfDay === "DAY" ? 0 : 150) * scale);
      });
    });

    // Ensure balanced sums
    const activeLightsTotal = lightsOn + lightsDimmed;
    const currentPowerKW = Math.round(currentPowerWatts / 1000);
    const conventionalKW = Math.max(currentPowerKW, Math.round(conventionalPowerWatts / 1000));
    const powerSavedKW = Math.max(0, conventionalKW - currentPowerKW);
    const energySavedPercent = conventionalKW > 0
      ? Math.round((powerSavedKW / conventionalKW) * 100)
      : (this.timeOfDay === "DAY" ? 100 : 64);

    // Karnataka electricity cost ₹8.5/unit, CO2 0.82kg/kWh
    const dailyCostSavedINR = Math.round(powerSavedKW * 12 * 8.5);
    const co2SavedKg = Math.round(powerSavedKW * 12 * 0.82);

    const openAlertsCount = this.alertLog.filter(a => a.status === "OPEN").length;

    return {
      totalCities: KARNATAKA_CITIES_DATA.length, // 30
      totalStreetLights: totalLightsMonitored, // ~22,000+
      lightsOn: lightsOn,
      lightsOff: lightsOff,
      lightsDimmed: lightsDimmed,
      activeLights: activeLightsTotal,
      autoOperating: autoOperating,
      faultyLights: Math.max(faultyLights, 1),
      currentPowerKW: currentPowerKW,
      conventionalKW: conventionalKW,
      powerSavedKW: powerSavedKW,
      energySavedPercent: energySavedPercent,
      dailyCostSavedINR: dailyCostSavedINR,
      co2SavedKg: co2SavedKg,
      openAlertsCount: openAlertsCount,
      vehicleDetections: this.trafficCounter.vehicles,
      pedestrianDetections: this.trafficCounter.pedestrians,
      timeOfDay: this.timeOfDay,
      simHour: this.simHour
    };
  }

  /**
   * Get City specific statistics
   */
  getCityStats(cityId) {
    const city = KARNATAKA_CITIES_DATA.find(c => c.id === cityId);
    if (!city) return null;

    const poles = CITY_STREET_LIGHTS[cityId] || [];
    let onCount = 0;
    let offCount = 0;
    let dimmedCount = 0;
    let faultCount = 0;
    let totalPolesPower = 0;

    poles.forEach(p => {
      if (p.status === "FAULT") faultCount++;
      else if (p.status === "ON") onCount++;
      else if (p.status === "OFF") offCount++;
      else if (p.status === "DIMMED") dimmedCount++;
      totalPolesPower += p.power;
    });

    const activeCount = onCount + dimmedCount;
    const cityAlerts = this.alertLog.filter(a => a.cityId === cityId && a.status === "OPEN");

    return {
      city: city,
      poles: poles,
      totalLights: city.totalLights,
      activeLights: Math.round((activeCount / poles.length) * city.totalLights),
      faultyLights: faultCount,
      energyConsumptionKW: ((totalPolesPower / poles.length) * (city.totalLights / 1000)).toFixed(1),
      alerts: cityAlerts,
      escom: city.escom
    };
  }

  getState() {
    return {
      timeOfDay: this.timeOfDay,
      isAutoTrafficEnabled: this.isAutoTrafficEnabled,
      trafficCounter: this.trafficCounter,
      aggregate: this.getAggregateStats(),
      alerts: this.alertLog,
      tickets: this.ticketsDispatched
    };
  }
}

// Global simulation singleton instance
const iotEngine = new IoTSimulationEngine();
