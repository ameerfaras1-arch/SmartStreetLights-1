/**
 * Karnataka 30 Cities Dataset & Smart Street Light Poles
 * Project: Smart Street Light Management System
 * IoT-Based Intelligent Street Lighting & Energy Management for Karnataka
 */

const KARNATAKA_CITIES_DATA = [
  {
    id: "bengaluru",
    name: "Bengaluru",
    kannadaName: "ಬೆಂಗಳೂರು",
    lat: 12.9716,
    lng: 77.5946,
    escom: "BESCOM (Bangalore Electricity Supply Company)",
    district: "Bengaluru Urban",
    status: "normal", // normal, warning, fault, maintenance
    totalLights: 2850,
    streets: [
      "MG Road - Metro Corridor",
      "Outer Ring Road - Marathahalli",
      "Indiranagar 100ft Road",
      "Vidhana Soudha Avenue",
      "Koramangala 80ft Road",
      "Electronic City Phase 1",
      "Whitefield Main Boulevard",
      "Hebbal Flyover Expressway"
    ]
  },
  {
    id: "mysuru",
    name: "Mysuru",
    kannadaName: "ಮೈಸೂರು",
    lat: 12.2958,
    lng: 76.6394,
    escom: "CHESCOM (Chamundeshwari Electricity Supply Corporation)",
    district: "Mysuru",
    status: "normal",
    totalLights: 1420,
    streets: [
      "Sayyaji Rao Road",
      "Krishnaraja Boulevard",
      "Chamundi Hill Approach",
      "Ring Road North Junction",
      "Dhanvantri Road",
      "Hunsur Highway Stretch"
    ]
  },
  {
    id: "mangaluru",
    name: "Mangaluru",
    kannadaName: "ಮಂಗಳೂರು",
    lat: 12.9141,
    lng: 74.8560,
    escom: "MESCOM (Mangalore Electricity Supply Company)",
    district: "Dakshina Kannada",
    status: "normal",
    totalLights: 980,
    streets: [
      "Hampankatta Central Ring",
      "Kadri Park Boulevard",
      "Kavoor - Airport Road",
      "Panambur Port Access Way",
      "MG Road Mangalore"
    ]
  },
  {
    id: "hubballi",
    name: "Hubballi",
    kannadaName: "ಹುಬ್ಬಳ್ಳಿ",
    lat: 15.3647,
    lng: 75.1240,
    escom: "HESCOM (Hubli Electricity Supply Company)",
    district: "Dharwad",
    status: "normal",
    totalLights: 1120,
    streets: [
      "Gokul Road Industrial Way",
      "Chennamma Circle Arterial",
      "Koppikar Road Promenade",
      "PB Road Expressway",
      "Keshwapur Main Road"
    ]
  },
  {
    id: "dharwad",
    name: "Dharwad",
    kannadaName: "ಧಾರವಾಡ",
    lat: 15.4589,
    lng: 75.0078,
    escom: "HESCOM (Hubli Electricity Supply Company)",
    district: "Dharwad",
    status: "normal",
    totalLights: 680,
    streets: [
      "Karnatak University Road",
      "Jubilee Circle",
      "Kelgeri Lake Drive",
      "Court Circle Junction"
    ]
  },
  {
    id: "belagavi",
    name: "Belagavi",
    kannadaName: "ಬೆಳಗಾವಿ",
    lat: 15.8497,
    lng: 74.4977,
    escom: "HESCOM (Hubli Electricity Supply Company)",
    district: "Belagavi",
    status: "normal",
    totalLights: 1050,
    streets: [
      "College Road Promenade",
      "Camp Area Boulevard",
      "Khanapur Road Sector",
      "Fort Lake Ring"
    ]
  },
  {
    id: "shivamogga",
    name: "Shivamogga",
    kannadaName: "ಶಿವಮೊಗ್ಗ",
    lat: 13.9299,
    lng: 75.5681,
    escom: "MESCOM (Mangalore Electricity Supply Company)",
    district: "Shivamogga",
    status: "normal",
    totalLights: 760,
    streets: [
      "Gopi Circle Central",
      "Sagar Road Arterial",
      "Bypass Bypass Ring",
      "Nehru Road Sector"
    ]
  },
  {
    id: "tumakuru",
    name: "Tumakuru",
    kannadaName: "ತುಮಕೂರು",
    lat: 13.3409,
    lng: 77.1010,
    escom: "BESCOM (Bangalore Electricity Supply Company)",
    district: "Tumakuru",
    status: "fault", // Demonstrates simulated fault requested by user prompt
    totalLights: 840,
    streets: [
      "BH Road Corridor - Pole 104", // Specific fault target: SL-104
      "Ashoka Nagar Main Ave",
      "Gubbi Gate Smart Stretch",
      "Ring Road Bypass Link",
      "Siddaganga Mutt Way"
    ]
  },
  {
    id: "davanagere",
    name: "Davanagere",
    kannadaName: "ದಾವಣಗೆರೆ",
    lat: 14.4644,
    lng: 75.9218,
    escom: "BESCOM (Bangalore Electricity Supply Company)",
    district: "Davanagere",
    status: "normal",
    totalLights: 720,
    streets: [
      "PB Road Commercial Ring",
      "Hadadi Road Corridor",
      "MCC B-Block Arterial",
      "Vidyanagar Main Sector"
    ]
  },
  {
    id: "ballari",
    name: "Ballari",
    kannadaName: "ಬಳ್ಳಾರಿ",
    lat: 15.1394,
    lng: 76.9214,
    escom: "GESCOM (Gulbarga Electricity Supply Company)",
    district: "Ballari",
    status: "warning", // Mild sensor calibration warning
    totalLights: 890,
    streets: [
      "Cantonment Main Road",
      "Siruguppa Road Highway",
      "Fort View Ring",
      "Infantry Road Sector"
    ]
  },
  {
    id: "kalaburagi",
    name: "Kalaburagi",
    kannadaName: "ಕಲಬುರಗಿ",
    lat: 17.3297,
    lng: 76.8343,
    escom: "GESCOM (Gulbarga Electricity Supply Company)",
    district: "Kalaburagi",
    status: "normal",
    totalLights: 830,
    streets: [
      "Sedam Road High-Tech Zone",
      "Super Market Circle",
      "Central University Corridor",
      "Ring Road Ring 2"
    ]
  },
  {
    id: "vijayapura",
    name: "Vijayapura",
    kannadaName: "ವಿಜಯಪುರ",
    lat: 16.8302,
    lng: 75.7100,
    escom: "HESCOM (Hubli Electricity Supply Company)",
    district: "Vijayapura",
    status: "normal",
    totalLights: 690,
    streets: [
      "Gol Gumbaz Heritage Blvd",
      "Station Road Arterial",
      "Athani Road Avenue",
      "Solapur Bypass Link"
    ]
  },
  {
    id: "raichur",
    name: "Raichur",
    kannadaName: "ರಾಯಚೂರು",
    lat: 16.2120,
    lng: 77.3439,
    escom: "GESCOM (Gulbarga Electricity Supply Company)",
    district: "Raichur",
    status: "normal",
    totalLights: 580,
    streets: [
      "Station Road Commercial",
      "Mantralayam Road",
      "Lingsugur Bypass Route",
      "Thermal Power Access Way"
    ]
  },
  {
    id: "hassan",
    name: "Hassan",
    kannadaName: "ಹಾಸನ",
    lat: 13.0033,
    lng: 76.1004,
    escom: "CHESCOM (Chamundeshwari Electricity Supply Corporation)",
    district: "Hassan",
    status: "normal",
    totalLights: 610,
    streets: [
      "BM Road (NH-75 Link)",
      "Dairy Circle Boulevard",
      "Shanthi Grama Corridor",
      "Holenarasipura Road"
    ]
  },
  {
    id: "mandya",
    name: "Mandya",
    kannadaName: "ಮಂಡ್ಯ",
    lat: 12.5218,
    lng: 76.8951,
    escom: "CHESCOM (Chamundeshwari Electricity Supply Corporation)",
    district: "Mandya",
    status: "normal",
    totalLights: 530,
    streets: [
      "Bengaluru-Mysuru Expressway Link",
      "Sugar Town Boulevard",
      "PES College Road",
      "Melukote Access Road"
    ]
  },
  {
    id: "chitradurga",
    name: "Chitradurga",
    kannadaName: "ಚಿತ್ರದುರ್ಗ",
    lat: 14.2251,
    lng: 76.3980,
    escom: "BESCOM (Bangalore Electricity Supply Company)",
    district: "Chitradurga",
    status: "normal",
    totalLights: 560,
    streets: [
      "Fort View Ring Corridor",
      "BD Road Central Axis",
      "Holalkere Road Link",
      "NH-48 Bypass Sector"
    ]
  },
  {
    id: "udupi",
    name: "Udupi",
    kannadaName: "ಉಡುಪಿ",
    lat: 13.3409,
    lng: 74.7421,
    escom: "MESCOM (Mangalore Electricity Supply Company)",
    district: "Udupi",
    status: "normal",
    totalLights: 640,
    streets: [
      "Car Street Temple Ring",
      "Manipal High Street Corridor",
      "Malpe Beach Expressway",
      "NH-66 Coastal Avenue"
    ]
  },
  {
    id: "chikkamagaluru",
    name: "Chikkamagaluru",
    kannadaName: "ಚಿಕ್ಕಮಗಳೂರು",
    lat: 13.3161,
    lng: 75.7720,
    escom: "MESCOM (Mangalore Electricity Supply Company)",
    district: "Chikkamagaluru",
    status: "normal",
    totalLights: 480,
    streets: [
      "MG Road Commercial Way",
      "Mullayanagiri Ghat Link",
      "Kadur Bypass Road",
      "IG Road Central"
    ]
  },
  {
    id: "kolar",
    name: "Kolar",
    kannadaName: "ಕೋಲಾರ",
    lat: 13.1367,
    lng: 78.1291,
    escom: "BESCOM (Bangalore Electricity Supply Company)",
    district: "Kolar",
    status: "normal",
    totalLights: 490,
    streets: [
      "Chennai Highway Link",
      "Clock Tower Square",
      "Gold Fields Transit Road",
      "Bangarpet Road Sector"
    ]
  },
  {
    id: "bengaluru-rural",
    name: "Bengaluru Rural",
    kannadaName: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ",
    lat: 13.2847,
    lng: 77.5732,
    escom: "BESCOM (Bangalore Electricity Supply Company)",
    district: "Bengaluru Rural (Doddaballapura)",
    status: "normal",
    totalLights: 510,
    streets: [
      "Doddaballapura Industrial Corridor",
      "Devanahalli Airport Bypass",
      "Nelamangala Highway Junction",
      "STRR Smart Arterial"
    ]
  },
  {
    id: "bidar",
    name: "Bidar",
    kannadaName: "ಬೀದರ್",
    lat: 17.9104,
    lng: 77.5199,
    escom: "GESCOM (Gulbarga Electricity Supply Company)",
    district: "Bidar",
    status: "normal",
    totalLights: 450,
    streets: [
      "Fort Gate Avenue",
      "Gurudwara Nanaksar Road",
      "Chidri Road Arterial",
      "Air Force Station Approach"
    ]
  },
  {
    id: "yadgir",
    name: "Yadgir",
    kannadaName: "ಯಾದಗಿರಿ",
    lat: 16.7628,
    lng: 77.1378,
    escom: "GESCOM (Gulbarga Electricity Supply Company)",
    district: "Yadgir",
    status: "normal",
    totalLights: 390,
    streets: [
      "Chittapur Road",
      "DC Office Boulevard",
      "Station Approach Corridor",
      "Shorapur Highway Link"
    ]
  },
  {
    id: "gadag",
    name: "Gadag",
    kannadaName: "ಗದಗ",
    lat: 15.4167,
    lng: 75.6333,
    escom: "HESCOM (Hubli Electricity Supply Company)",
    district: "Gadag",
    status: "normal",
    totalLights: 440,
    streets: [
      "Betageri Twin-City Road",
      "Pala-Badami Highway Link",
      "Veeranarayana Temple Way",
      "Wind Farm Transit Route"
    ]
  },
  {
    id: "bagalkot",
    name: "Bagalkot",
    kannadaName: "ಬಾಗಲಕೋಟೆ",
    lat: 16.1817,
    lng: 75.6615,
    escom: "HESCOM (Hubli Electricity Supply Company)",
    district: "Bagalkot",
    status: "normal",
    totalLights: 470,
    streets: [
      "Navanagar Sector 1 Boulevard",
      "Ghataprabha River Bridge Road",
      "Badami Road Arterial",
      "Engineering College Drive"
    ]
  },
  {
    id: "koppal",
    name: "Koppal",
    kannadaName: "ಕೊಪ್ಪಳ",
    lat: 15.3456,
    lng: 76.1558,
    escom: "GESCOM (Gulbarga Electricity Supply Company)",
    district: "Koppal",
    status: "normal",
    totalLights: 410,
    streets: [
      "Hospet Highway Arterial",
      "Fort Hill Road",
      "Gavi Siddeshwara Math Ring",
      "Kinnal Craft Corridor"
    ]
  },
  {
    id: "kodagu",
    name: "Kodagu",
    kannadaName: "ಕೊಡಗು",
    lat: 12.4244,
    lng: 75.7382,
    escom: "CHESCOM (Chamundeshwari Electricity Supply Corporation)",
    district: "Kodagu (Madikeri)",
    status: "normal",
    totalLights: 360,
    streets: [
      "Madikeri Raja Seat Promenade",
      "Mangalore Ghat Road",
      "Kushalnagar Highway Road",
      "Gonikoppal Junction"
    ]
  },
  {
    id: "chamarajanagar",
    name: "Chamarajanagar",
    kannadaName: "ಚಾಮರಾಜನಗರ",
    lat: 11.9261,
    lng: 76.9437,
    escom: "CHESCOM (Chamundeshwari Electricity Supply Corporation)",
    district: "Chamarajanagar",
    status: "normal",
    totalLights: 380,
    streets: [
      "Gundlupet National Highway",
      "B R Hills Approach Way",
      "Santhemarahalli Road",
      "Court Complex Boulevard"
    ]
  },
  {
    id: "ramanagara",
    name: "Ramanagara",
    kannadaName: "ರಾಮನಗರ",
    lat: 12.7209,
    lng: 77.2799,
    escom: "BESCOM (Bangalore Electricity Supply Company)",
    district: "Ramanagara",
    status: "normal",
    totalLights: 430,
    streets: [
      "Silk Silk City Boulevard",
      "Ramadevara Betta Foothill Way",
      "Channapatna Border Link",
      "BM Road Commercial Stretch"
    ]
  },
  {
    id: "uttara-kannada",
    name: "Uttara Kannada",
    kannadaName: "ಉತ್ತರ ಕನ್ನಡ",
    lat: 14.7954,
    lng: 74.1302,
    escom: "HESCOM (Hubli Electricity Supply Company)",
    district: "Uttara Kannada (Karwar)",
    status: "maintenance", // 1 City under routine scheduled maintenance
    totalLights: 510,
    streets: [
      "Karwar Marine Drive",
      "Gokarna Coastal Approach",
      "Rabindranath Tagore Beach Road",
      "NH-66 Kali River Bridge Link"
    ]
  },
  {
    id: "chikkaballapur",
    name: "Chikkaballapur",
    kannadaName: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
    lat: 13.4325,
    lng: 77.7275,
    escom: "BESCOM (Bangalore Electricity Supply Company)",
    district: "Chikkaballapur",
    status: "normal",
    totalLights: 420,
    streets: [
      "Nandi Hills Highway Way",
      "Sir MV Road Central",
      "Bagepalli Arterial",
      "Gauribidanur Cross Link"
    ]
  }
];

/**
 * Generate simulated street light poles for a city
 */
function generateStreetLightsForCity(city, isNightMode = false) {
  const poles = [];
  const count = city.streets.length >= 6 ? city.streets.length : 8;
  const cityCode = city.id.substring(0, 3).toUpperCase();

  for (let i = 0; i < count; i++) {
    const lightNum = 101 + i;
    const lightId = `${cityCode}-SL-${lightNum}`;
    const streetName = city.streets[i % city.streets.length];

    // Special case for Tumakuru SL-104 (required in prompt)
    const isTumakuru104 = city.id === "tumakuru" && lightNum === 104;
    const isBallariWarning = city.id === "ballari" && lightNum === 102;
    const isMaintenancePole = city.status === "maintenance" && i === 1;

    let status = "DIMMED";
    let faultType = null;
    let pirMotion = "Idle";
    let brightness = isNightMode ? 30 : 0;
    let power = isNightMode ? 45 : 0; // 150W max LED
    let ldrLux = isNightMode ? 28 : 820; // lux
    let ldrStatus = isNightMode ? "Dark (<50 Lux)" : "Bright (>700 Lux)";
    let currentSensor = isNightMode ? "Normal (0.35A)" : "Standby (0.00A)";

    if (!isNightMode && !isTumakuru104 && !isBallariWarning) {
      status = "OFF";
      brightness = 0;
      power = 0;
      currentSensor = "Standby (0.00A)";
    }

    if (isTumakuru104) {
      status = "FAULT";
      faultType = "PIR sensor failure";
      brightness = 0;
      power = 0;
      pirMotion = "SENSOR ERROR (E-204)";
      currentSensor = "Open Circuit (0.00A)";
    } else if (isBallariWarning) {
      status = "WARNING";
      faultType = "LDR Lux Drift (+18%)";
      ldrStatus = "Calibration Drift";
      brightness = 40;
      power = 60;
    } else if (isMaintenancePole) {
      status = "MAINTENANCE";
      faultType = "Scheduled Luminaire Service";
      brightness = 15;
      power = 22;
    }

    poles.push({
      id: lightId,
      cityId: city.id,
      cityName: city.name,
      poleCode: `POLE-${String(i + 1).padStart(2, "0")}`,
      street: streetName,
      status: status,
      brightness: brightness,
      power: power,
      maxWattage: 150,
      ldrLux: ldrLux,
      ldrStatus: ldrStatus,
      pirMotion: pirMotion,
      currentSensor: currentSensor,
      lastUpdated: new Date().toLocaleTimeString(),
      faultType: faultType,
      mode: "AUTO", // AUTO or MANUAL
      detectedEntity: null, // "vehicle", "pedestrian" or null
      lastMotionTimestamp: Date.now() - (i * 35000),
      escom: city.escom
    });
  }

  return poles;
}

// Global registry of instantiated city poles
const CITY_STREET_LIGHTS = {};
KARNATAKA_CITIES_DATA.forEach(city => {
  CITY_STREET_LIGHTS[city.id] = generateStreetLightsForCity(city, false);
});
