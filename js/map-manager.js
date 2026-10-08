/**
 * Interactive Karnataka Map Manager
 * Project: Smart Street Light Management System
 * Powered by Leaflet.js with Dark High-Tech Smart-City Styling & Pulsing Status Markers
 */

class KarnatakaMapManager {
  constructor(mapContainerId, onCitySelectCallback) {
    this.containerId = mapContainerId;
    this.onCitySelect = onCitySelectCallback;
    this.map = null;
    this.markers = {};
    this.filterStatus = "ALL";
    this.karnatakaCenter = [14.5204, 75.7224];
    this.defaultZoom = 7;
  }

  init() {
    const mapEl = document.getElementById(this.containerId);
    if (!mapEl) return;

    // Initialize Leaflet map
    this.map = L.map(this.containerId, {
      center: this.karnatakaCenter,
      zoom: this.defaultZoom,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: true,
      attributionControl: false
    });

    // Dark Cyberpunk / Command-Center Map Tile Layer (CartoDB Dark Matter)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(this.map);

    // Render Karnataka 30 city markers
    this.renderMarkers();

    // Map bounds fitting Karnataka
    const bounds = L.latLngBounds(KARNATAKA_CITIES_DATA.map(c => [c.lat, c.lng]));
    this.map.fitBounds(bounds, { padding: [40, 40] });

    // Handle map resize when switching tabs
    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);
  }

  getMarkerHtml(status, name) {
    const colorMap = {
      normal: "#10b981",    // Neon Emerald Green
      warning: "#f59e0b",   // Neon Amber / Yellow
      fault: "#ef4444",     // Glowing Crimson Red
      maintenance: "#3b82f6" // Glowing Cyan / Blue
    };

    const color = colorMap[status] || "#10b981";
    const isPulsing = status === "fault" || status === "warning";

    return `
      <div class="custom-map-pin ${status} ${isPulsing ? 'pulse-anim' : ''}" style="--pin-color: ${color}">
        <div class="pin-ring"></div>
        <div class="pin-core">
          <i class="pin-dot"></i>
        </div>
        <div class="pin-label">${name}</div>
      </div>
    `;
  }

  renderMarkers() {
    // Clear existing markers if any
    Object.values(this.markers).forEach(m => this.map.removeLayer(m));
    this.markers = {};

    KARNATAKA_CITIES_DATA.forEach(city => {
      if (this.filterStatus !== "ALL" && city.status !== this.filterStatus) {
        return;
      }

      const icon = L.divIcon({
        className: "custom-leaflet-marker",
        html: this.getMarkerHtml(city.status, city.name),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([city.lat, city.lng], { icon: icon });

      // Click event on marker opens city page and popup
      marker.on("click", () => {
        this.updatePopupContent(city, marker);
      });

      marker.bindPopup(() => this.createPopupElement(city), {
        className: "smart-city-popup",
        maxWidth: 320,
        closeButton: true
      });

      marker.addTo(this.map);
      this.markers[city.id] = marker;
    });
  }

  createPopupElement(city) {
    const stats = iotEngine.getCityStats(city.id);
    const statusBadges = {
      normal: `<span class="badge badge-normal">● Normal Operational</span>`,
      warning: `<span class="badge badge-warning">⚠️ Sensor Warning</span>`,
      fault: `<span class="badge badge-fault">🚨 System Fault Active</span>`,
      maintenance: `<span class="badge badge-maintenance">🛠️ Scheduled Service</span>`
    };

    const statusBadge = statusBadges[city.status] || statusBadges.normal;
    const alertHtml = stats.alerts.length > 0
      ? `<div class="popup-alert-box">${stats.alerts[0].message}</div>`
      : `<div class="popup-alert-none">No active critical alarms</div>`;

    const div = document.createElement("div");
    div.className = "hud-popup-card";
    div.innerHTML = `
      <div class="popup-header">
        <div>
          <h3 class="popup-title">${city.name} <span class="kannada-text">(${city.kannadaName})</span></h3>
          <span class="popup-subtitle">${city.district} • ${city.escom.split(" ")[0]}</span>
        </div>
        ${statusBadge}
      </div>

      <div class="popup-kpis-grid">
        <div class="popup-kpi-item">
          <div class="kpi-label">Total Lights</div>
          <div class="kpi-val">${city.totalLights.toLocaleString()}</div>
        </div>
        <div class="popup-kpi-item">
          <div class="kpi-label">Active Lights</div>
          <div class="kpi-val text-cyan">${stats.activeLights.toLocaleString()}</div>
        </div>
        <div class="popup-kpi-item">
          <div class="kpi-label">Faulty Lights</div>
          <div class="kpi-val ${stats.faultyLights > 0 ? 'text-red' : 'text-muted'}">${stats.faultyLights}</div>
        </div>
        <div class="popup-kpi-item">
          <div class="kpi-label">Power (kW)</div>
          <div class="kpi-val text-yellow">${stats.energyConsumptionKW} kW</div>
        </div>
      </div>

      <div class="popup-alerts-section">
        <div class="section-micro-label">Active IoT Telemetry Alert:</div>
        ${alertHtml}
      </div>

      <div class="popup-actions">
        <button class="btn btn-primary btn-sm btn-block" onclick="window.app.openCityDetails('${city.id}')">
          <span>Open Street Light Monitoring</span>
          <i class="icon-arrow-right"></i>
        </button>
      </div>
    `;

    return div;
  }

  updatePopupContent(city, marker) {
    if (marker && marker.getPopup()) {
      marker.getPopup().setContent(this.createPopupElement(city));
    }
  }

  setFilter(status) {
    this.filterStatus = status;
    this.renderMarkers();
  }

  flyToCity(cityId) {
    const city = KARNATAKA_CITIES_DATA.find(c => c.id === cityId);
    if (!city || !this.map) return;

    this.map.flyTo([city.lat, city.lng], 12, {
      duration: 1.5,
      easeLinearity: 0.25
    });

    const marker = this.markers[cityId];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 1400);
    }
  }

  resetView() {
    if (!this.map) return;
    const bounds = L.latLngBounds(KARNATAKA_CITIES_DATA.map(c => [c.lat, c.lng]));
    this.map.flyToBounds(bounds, { padding: [40, 40], duration: 1.2 });
  }

  updateAllMarkers() {
    KARNATAKA_CITIES_DATA.forEach(city => {
      const marker = this.markers[city.id];
      if (marker) {
        const icon = L.divIcon({
          className: "custom-leaflet-marker",
          html: this.getMarkerHtml(city.status, city.name),
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18]
        });
        marker.setIcon(icon);
      }
    });
  }
}
