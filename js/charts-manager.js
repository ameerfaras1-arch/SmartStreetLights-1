/**
 * Charts & Analytics Manager
 * Project: Smart Street Light Management System
 * Uses Chart.js with Cyberpunk Smart-City Palette (Dark Blue, Cyber Yellow, Electric Cyan, Neon Green)
 */

class SmartCityChartsManager {
  constructor() {
    this.currentPeriod = "TODAY"; // "TODAY", "7DAYS", "30DAYS"
    this.charts = {};
  }

  init() {
    this.initEnergyComparisonChart();
    this.initStatusDoughnutChart();
    this.initTrafficActivityChart();
    this.initFaultCategoryChart();
    this.initHourlySavingsBarChart();
  }

  // Theme color palette
  getColors() {
    return {
      yellow: "#f59e0b",
      cyan: "#06b6d4",
      emerald: "#10b981",
      red: "#ef4444",
      purple: "#8b5cf6",
      gray: "rgba(255, 255, 255, 0.15)",
      gridLines: "rgba(255, 255, 255, 0.06)",
      textMuted: "#94a3b8"
    };
  }

  setPeriod(period) {
    this.currentPeriod = period;
    this.updateAllCharts();
  }

  // 1. Energy Consumption vs Conventional Comparison
  initEnergyComparisonChart() {
    const ctx = document.getElementById("chart-energy-comparison");
    if (!ctx) return;

    const colors = this.getColors();
    const data = this.getEnergyDataset();

    this.charts.energy = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Conventional Baseline (100% On)",
            data: data.conventional,
            borderColor: "rgba(239, 68, 68, 0.8)",
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            borderDash: [5, 5],
            fill: true,
            tension: 0.35,
            pointRadius: 3
          },
          {
            label: "Smart IoT Controlled (Dynamic Dimming)",
            data: data.smart,
            borderColor: colors.emerald,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: colors.emerald
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            labels: { color: "#e2e8f0", font: { size: 12, family: "Inter, sans-serif" } }
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 1,
            titleColor: "#f8fafc",
            bodyColor: "#cbd5e1"
          }
        },
        scales: {
          x: {
            grid: { color: colors.gridLines },
            ticks: { color: colors.textMuted }
          },
          y: {
            grid: { color: colors.gridLines },
            ticks: {
              color: colors.textMuted,
              callback: value => value + " kWh"
            }
          }
        }
      }
    });
  }

  // 2. Active, Dimmed, Off, Faulty Status Doughnut
  initStatusDoughnutChart() {
    const ctx = document.getElementById("chart-light-status");
    if (!ctx) return;

    const colors = this.getColors();
    const agg = iotEngine.getAggregateStats();

    this.charts.status = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Full Active (100%)", "Dimmed Standby (30%)", "Day/Scheduled OFF", "Fault / Alarm"],
        datasets: [{
          data: [agg.lightsOn, agg.lightsDimmed, agg.lightsOff, agg.faultyLights],
          backgroundColor: [
            colors.yellow,
            colors.cyan,
            "rgba(148, 163, 184, 0.3)",
            colors.red
          ],
          borderColor: "#0f172a",
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#cbd5e1", boxWidth: 14, font: { size: 11 } }
          }
        },
        cutout: "72%"
      }
    });
  }

  // 3. Traffic Activity: Vehicles vs Pedestrians
  initTrafficActivityChart() {
    const ctx = document.getElementById("chart-traffic-activity");
    if (!ctx) return;

    const colors = this.getColors();
    const trafficData = this.getTrafficDataset();

    this.charts.traffic = new Chart(ctx, {
      type: "bar",
      data: {
        labels: trafficData.labels,
        datasets: [
          {
            label: "Vehicles Detected (PIR/Radar)",
            data: trafficData.vehicles,
            backgroundColor: "rgba(6, 182, 212, 0.8)",
            borderRadius: 4
          },
          {
            label: "Pedestrians Detected",
            data: trafficData.pedestrians,
            backgroundColor: "rgba(245, 158, 11, 0.8)",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#cbd5e1", font: { size: 12 } }
          }
        },
        scales: {
          x: {
            grid: { color: colors.gridLines },
            ticks: { color: colors.textMuted }
          },
          y: {
            grid: { color: colors.gridLines },
            ticks: { color: colors.textMuted }
          }
        }
      }
    });
  }

  // 4. Fault Categories Chart
  initFaultCategoryChart() {
    const ctx = document.getElementById("chart-fault-categories");
    if (!ctx) return;

    const colors = this.getColors();

    this.charts.faults = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "PIR Motion Sensor",
          "LED Driver / Luminaire",
          "LDR Light Sensor",
          "Surge / Overcurrent",
          "LoRaWAN Gateway Link"
        ],
        datasets: [{
          label: "Reported Anomalies across Karnataka",
          data: [4, 2, 3, 1, 1],
          backgroundColor: [
            colors.red,
            "rgba(245, 158, 11, 0.85)",
            "rgba(139, 92, 246, 0.85)",
            "rgba(239, 68, 68, 0.6)",
            "rgba(59, 130, 246, 0.85)"
          ],
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: colors.gridLines },
            ticks: { color: colors.textMuted, stepSize: 1 }
          },
          y: {
            grid: { color: colors.gridLines },
            ticks: { color: "#e2e8f0", font: { size: 11 } }
          }
        }
      }
    });
  }

  // 5. Hourly Energy Savings % Bar Chart
  initHourlySavingsBarChart() {
    const ctx = document.getElementById("chart-hourly-savings");
    if (!ctx) return;

    const colors = this.getColors();
    const savings = this.getSavingsDataset();

    this.charts.savings = new Chart(ctx, {
      type: "line",
      data: {
        labels: savings.labels,
        datasets: [{
          label: "% Energy Saved vs Conventional",
          data: savings.percent,
          borderColor: colors.yellow,
          backgroundColor: "rgba(245, 158, 11, 0.15)",
          fill: true,
          tension: 0.3,
          pointBackgroundColor: colors.yellow
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#cbd5e1" } }
        },
        scales: {
          x: {
            grid: { color: colors.gridLines },
            ticks: { color: colors.textMuted }
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: colors.gridLines },
            ticks: {
              color: colors.textMuted,
              callback: v => v + "%"
            }
          }
        }
      }
    });
  }

  getEnergyDataset() {
    if (this.currentPeriod === "TODAY") {
      return {
        labels: ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00"],
        conventional: [3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 3200, 1600],
        smart: [1950, 2100, 1850, 1540, 1180, 950, 720, 680, 640, 710, 890, 1240, 480]
      };
    } else if (this.currentPeriod === "7DAYS") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        conventional: [38400, 38400, 38400, 38400, 38400, 38400, 38400],
        smart: [14200, 13850, 14100, 13600, 15200, 16800, 15900]
      };
    } else {
      // 30 Days
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        conventional: [268800, 268800, 268800, 268800],
        smart: [99400, 96800, 102100, 97500]
      };
    }
  }

  getTrafficDataset() {
    if (this.currentPeriod === "TODAY") {
      return {
        labels: ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00"],
        vehicles: [480, 520, 430, 310, 210, 130, 80, 45, 30, 65, 140, 290],
        pedestrians: [340, 390, 290, 180, 95, 45, 20, 12, 8, 18, 55, 160]
      };
    } else if (this.currentPeriod === "7DAYS") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        vehicles: [3200, 3450, 3310, 3400, 4100, 4800, 4200],
        pedestrians: [2100, 2250, 2180, 2300, 2950, 3600, 3100]
      };
    } else {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        vehicles: [24800, 25600, 26400, 27100],
        pedestrians: [16800, 17200, 18100, 18900]
      };
    }
  }

  getSavingsDataset() {
    if (this.currentPeriod === "TODAY") {
      return {
        labels: ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00"],
        percent: [39, 34, 42, 52, 63, 70, 78, 79, 80, 78, 72, 61]
      };
    } else if (this.currentPeriod === "7DAYS") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        percent: [63, 64, 63, 65, 60, 56, 58]
      };
    } else {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        percent: [63, 64, 62, 64]
      };
    }
  }

  updateAllCharts() {
    const energyData = this.getEnergyDataset();
    if (this.charts.energy) {
      this.charts.energy.data.labels = energyData.labels;
      this.charts.energy.data.datasets[0].data = energyData.conventional;
      this.charts.energy.data.datasets[1].data = energyData.smart;
      this.charts.energy.update();
    }

    const trafficData = this.getTrafficDataset();
    if (this.charts.traffic) {
      this.charts.traffic.data.labels = trafficData.labels;
      this.charts.traffic.data.datasets[0].data = trafficData.vehicles;
      this.charts.traffic.data.datasets[1].data = trafficData.pedestrians;
      this.charts.traffic.update();
    }

    const savingsData = this.getSavingsDataset();
    if (this.charts.savings) {
      this.charts.savings.data.labels = savingsData.labels;
      this.charts.savings.data.datasets[0].data = savingsData.percent;
      this.charts.savings.update();
    }

    if (this.charts.status) {
      const agg = iotEngine.getAggregateStats();
      this.charts.status.data.datasets[0].data = [
        agg.lightsOn,
        agg.lightsDimmed,
        agg.lightsOff,
        agg.faultyLights
      ];
      this.charts.status.update();
    }
  }
}
