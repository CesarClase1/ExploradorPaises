const mapObject = document.getElementById('world-map');
const flagModal = document.getElementById('flag-modal');
const flagImage = document.getElementById('flag-image');
const infoModal = document.getElementById('info-modal');
const infoContent = document.getElementById('info-content');
const closeFlagModal = document.getElementById('close-flag');
const closeInfoModal = document.getElementById('close-info');
const API_BASE = 'https://restcountries.com/v3.1';
const WIKI_API_URL = 'https://es.wikipedia.org/api/rest_v1/page/summary/';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const UNSPLASH_API_URL = 'https://source.unsplash.com/1600x900/?';
let currentScale = 1;
let isDragging = false;
let startX, startY;
let currentTranslateX = 0, currentTranslateY = 0;

const countryIdToName = {
  "AF": "Afghanistan",
  "AL": "Albania",
  "DZ": "Algeria",
  "AS": "American Samoa",
  "AD": "Andorra",
  "AO": "Angola",
  "AI": "Anguilla",
  "AQ": "Antarctica",
  "AG": "Antigua and Barbuda",
  "AR": "Argentina",
  "AM": "Armenia",
  "AW": "Aruba",
  "AU": "Australia",
  "AT": "Austria",
  "AZ": "Azerbaijan",
  "BS": "Bahamas",
  "BH": "Bahrain",
  "BD": "Bangladesh",
  "BB": "Barbados",
  "BY": "Belarus",
  "BE": "Belgium",
  "BZ": "Belize",
  "BJ": "Benin",
  "BM": "Bermuda",
  "BT": "Bhutan",
  "BO": "Bolivia",
  "BQ": "Bonaire",
  "BA": "Bosnia and Herzegovina",
  "BW": "Botswana",
  "BV": "Bouvet Island",
  "BR": "Brazil",
  "IO": "British Indian Ocean Territory",
  "BN": "Brunei Darussalam",
  "BG": "Bulgaria",
  "BF": "Burkina Faso",
  "BI": "Burundi",
  "CV": "Cabo Verde",
  "KH": "Cambodia",
  "CM": "Cameroon",
  "CA": "Canada",
  "KY": "Cayman Islands",
  "CF": "Central African Republic",
  "TD": "Chad",
  "CL": "Chile",
  "CN": "China",
  "CX": "Christmas Island",
  "CC": "Cocos (Keeling) Islands",
  "CO": "Colombia",
  "KM": "Comoros",
  "CD": "Democratic Republic of the Congo",
  "CG": "Republic of Congo",
  "CK": "Cook Islands",
  "CR": "Costa Rica",
  "CI": "Côte d'Ivoire",
  "HR": "Croatia",
  "CU": "Cuba",
  "CW": "Curaçao",
  "CY": "Cyprus",
  "CZ": "Czech Republic",
  "DK": "Denmark",
  "DJ": "Djibouti",
  "DM": "Dominica",
  "DO": "Dominican Republic",
  "EC": "Ecuador",
  "EG": "Egypt",
  "SV": "El Salvador",
  "GQ": "Equatorial Guinea",
  "ER": "Eritrea",
  "EE": "Estonia",
  "SZ": "Eswatini",
  "ET": "Ethiopia",
  "FK": "Falkland Islands",
  "FO": "Faroe Islands",
  "FJ": "Fiji",
  "FI": "Finland",
  "FR": "France",
  "GF": "French Guiana",
  "PF": "French Polynesia",
  "TF": "French Southern Territories",
  "GA": "Gabon",
  "GM": "Gambia",
  "GE": "Georgia",
  "DE": "Germany",
  "GH": "Ghana",
  "GI": "Gibraltar",
  "GR": "Greece",
  "GL": "Greenland",
  "GD": "Grenada",
  "GP": "Guadeloupe",
  "GU": "Guam",
  "GT": "Guatemala",
  "GG": "Guernsey",
  "GN": "Guinea",
  "GW": "Guinea-Bissau",
  "GY": "Guyana",
  "HT": "Haiti",
  "HM": "Heard Island and McDonald Islands",
  "VA": "Holy See",
  "HN": "Honduras",
  "HK": "Hong Kong",
  "HU": "Hungary",
  "IS": "Iceland",
  "IN": "India",
  "ID": "Indonesia",
  "IR": "Iran",
  "IQ": "Iraq",
  "IE": "Ireland",
  "IM": "Isle of Man",
  "IL": "Israel",
  "IT": "Italy",
  "JM": "Jamaica",
  "JP": "Japan",
  "JE": "Jersey",
  "JO": "Jordan",
  "KZ": "Kazakhstan",
  "KE": "Kenya",
  "KI": "Kiribati",
  "KP": "North Korea",
  "KR": "South Korea",
  "XK": "Kosovo",
  "KW": "Kuwait",
  "KG": "Kyrgyzstan",
  "LA": "Laos",
  "LV": "Latvia",
  "LB": "Lebanon",
  "LS": "Lesotho",
  "LR": "Liberia",
  "LY": "Libya",
  "LI": "Liechtenstein",
  "LT": "Lithuania",
  "LU": "Luxembourg",
  "MO": "Macao",
  "MG": "Madagascar",
  "MW": "Malawi",
  "MY": "Malaysia",
  "MV": "Maldives",
  "ML": "Mali",
  "MT": "Malta",
  "MH": "Marshall Islands",
  "MQ": "Martinique",
  "MR": "Mauritania",
  "MU": "Mauritius",
  "YT": "Mayotte",
  "MX": "Mexico",
  "FM": "Micronesia",
  "MD": "Moldova",
  "MC": "Monaco",
  "MN": "Mongolia",
  "ME": "Montenegro",
  "MS": "Montserrat",
  "MA": "Morocco",
  "MZ": "Mozambique",
  "MM": "Myanmar",
  "NA": "Namibia",
  "NR": "Nauru",
  "NP": "Nepal",
  "NL": "Netherlands",
  "NC": "New Caledonia",
  "NZ": "New Zealand",
  "NI": "Nicaragua",
  "NE": "Niger",
  "NG": "Nigeria",
  "NU": "Niue",
  "NF": "Norfolk Island",
  "MP": "Northern Mariana Islands",
  "NO": "Norway",
  "OM": "Oman",
  "PK": "Pakistan",
  "PW": "Palau",
  "PS": "Palestine",
  "PA": "Panama",
  "PG": "Papua New Guinea",
  "PY": "Paraguay",
  "PE": "Peru",
  "PH": "Philippines",
  "PN": "Pitcairn",
  "PL": "Poland",
  "PT": "Portugal",
  "PR": "Puerto Rico",
  "QA": "Qatar",
  "RE": "Réunion",
  "RO": "Romania",
  "RU": "Russia",
  "RW": "Rwanda",
  "BL": "Saint Barthélemy",
  "SH": "Saint Helena",
  "KN": "Saint Kitts and Nevis",
  "LC": "Saint Lucia",
  "MF": "Saint Martin",
  "PM": "Saint Pierre and Miquelon",
  "VC": "Saint Vincent and the Grenadines",
  "WS": "Samoa",
  "SM": "San Marino",
  "ST": "Sao Tome and Principe",
  "SA": "Saudi Arabia",
  "SN": "Senegal",
  "RS": "Serbia",
  "SC": "Seychelles",
  "SL": "Sierra Leone",
  "SG": "Singapore",
  "SX": "Sint Maarten",
  "SK": "Slovakia",
  "SI": "Slovenia",
  "SB": "Solomon Islands",
  "SO": "Somalia",
  "ZA": "South Africa",
  "GS": "South Georgia",
  "SS": "South Sudan",
  "ES": "Spain",
  "LK": "Sri Lanka",
  "SD": "Sudan",
  "SR": "Suriname",
  "SJ": "Svalbard and Jan Mayen",
  "SE": "Sweden",
  "CH": "Switzerland",
  "SY": "Syria",
  "TW": "Taiwan",
  "TJ": "Tajikistan",
  "TZ": "Tanzania",
  "TH": "Thailand",
  "TL": "Timor-Leste",
  "TG": "Togo",
  "TK": "Tokelau",
  "TO": "Tonga",
  "TT": "Trinidad and Tobago",
  "TN": "Tunisia",
  "TR": "Turkey",
  "TM": "Turkmenistan",
  "TC": "Turks and Caicos Islands",
  "TV": "Tuvalu",
  "UG": "Uganda",
  "UA": "Ukraine",
  "AE": "United Arab Emirates",
  "GB": "United Kingdom",
  "US": "United States",
  "UM": "United States Minor Outlying Islands",
  "UY": "Uruguay",
  "UZ": "Uzbekistan",
  "VU": "Vanuatu",
  "VE": "Venezuela",
  "VN": "Vietnam",
  "VG": "Virgin Islands (British)",
  "VI": "Virgin Islands (U.S.)",
  "WF": "Wallis and Futuna",
  "EH": "Western Sahara",
  "YE": "Yemen",
  "ZM": "Zambia",
  "ZW": "Zimbabwe",
  "BQBO": "Bonaire (Netherlands)",
  "BQSA": "Saba (Netherlands)",
  "BQSE": "St. Eustatius (Netherlands)"
};

mapObject.addEventListener('load', function() { 
  const svgDoc = mapObject.contentDocument;
  const countries = svgDoc.querySelectorAll('path, polygon');

  countries.forEach(country => {
    country.style.cursor = 'pointer';

    country.addEventListener('click', async function() {
      const countryId = country.getAttribute('id') || country.getAttribute('data-name');
      const countryName = countryIdToName[countryId];
      
      if (countryName) {
        loadingModal.style.display = 'block';

        loadingFlag.src = '';
        loadingFlag.onload = null;
        loadingFlag.onerror = null;

        const countryData = await fetchCountryInfo(countryName);
        
        if (countryData) {
          loadingFlag.src = countryData.flag;

          loadingFlag.onload = () => {
            setTimeout(() => {
              loadingModal.style.display = 'none';
              showInfoModal(countryData);
            }, 2000);
          };

          loadingFlag.onerror = () => {
            loadingModal.style.display = 'none';
            alert("No se pudo cargar la bandera del país.");
          };
        }
      } else {
        alert('No tenemos configurado este país: ' + countryId);
      }
    });
  });
});




async function fetchCountryInfo(countryName) {
  try {
    const exactSearch = await fetch(`${API_BASE}/name/${encodeURIComponent(countryName)}?fullText=true`);
    if (!exactSearch.ok) {
      console.warn(`No se encontró información para: ${countryName}`);
      return null;
    }
    const country = (await exactSearch.json())[0];
    const [lat, lon] = country.latlng;

    const weatherData = await fetch(`${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const weather = weatherData.ok ? await weatherData.json() : null;

    const languageDetails = await fetchLanguageInfo(country.languages);

    const images = [
      `https://source.unsplash.com/600x400/?${encodeURIComponent(country.name.common)}`,
      `https://source.unsplash.com/600x400/?${encodeURIComponent(country.capital?.[0] || '')}`,
      `https://source.unsplash.com/600x400/?${encodeURIComponent(country.region)}`
    ];

    const economyData = await fetchEconomyData(country.cca2.toLowerCase());

    const cultureData = await fetchCultureData(country.name.common);

    const cultureText = cultureData?.description || "No disponible";

const sportsData = await fetchSportsByCountry(country.name.common);


    return {
      name: country.name.common,
      officialName: country.name.official,
      flag: country.flags.svg,
      capital: country.capital?.[0] || "N/A",
      population: country.population.toLocaleString(),
      region: country.region,
      subregion: country.subregion,
      coordinates: country.latlng,
      area: `${country.area.toLocaleString()} km²`,
      borders: country.borders?.join(", ") || "Ninguna",
      timezones: country.timezones.join(", "),
      currencies: Object.values(country.currencies || {}).map(c => `${c.name} (${c.symbol || 'N/S'})`).join(", "),
      languages: Object.values(country.languages || {}).join(", "),
      weather: weather ? `${weather.current_weather.temperature}°C, Viento ${weather.current_weather.windspeed} km/h` : 'No disponible',
      languageDetails,
      images,

      geography: `
        <p><strong>Región:</strong> ${country.region}</p>
        <p><strong>Subregión:</strong> ${country.subregion || 'No disponible'}</p>
        <p><strong>Coordenadas:</strong> Lat ${lat}, Lon ${lon}</p>
        <p><strong>Área total:</strong> ${country.area.toLocaleString()} km²</p>
        <p><strong>Fronteras con:</strong> ${country.borders?.join(", ") || "Ninguna"}</p>
        <p><strong>Zonas horarias:</strong> ${country.timezones.join(", ")}</p>
        <p><strong>Clima actual:</strong> ${weather ? `${weather.current_weather.temperature}°C, Viento ${weather.current_weather.windspeed} km/h` : 'No disponible'}</p>
      `,

      economy: `
        <p><strong>Moneda(s):</strong> ${Object.values(country.currencies || {}).map(c => `${c.name} (${c.symbol || 'N/S'})`).join(", ")}</p>
        <p><strong>PIB total:</strong> ${economyData.gdp}</p>
        <p><strong>PIB per cápita:</strong> ${economyData.gdpPerCapita}</p>
        <p><strong>Principales exportaciones:</strong> ${economyData.mainExports}</p>
        <p><strong>Principales importaciones:</strong> ${economyData.mainImports}</p>
        <p><strong>Socios comerciales clave:</strong> ${economyData.tradingPartners}</p>
        <p><strong>Tasa de desempleo:</strong> ${economyData.unemploymentRate}</p>
        <p><strong>Principales sectores económicos:</strong> ${economyData.economicSectors}</p>
        <p><strong>Inflación anual:</strong> ${economyData.inflation}</p>
        <p><strong>Deuda pública:</strong> ${economyData.publicDebt}</p>
        <p><strong>Reservas internacionales:</strong> ${economyData.internationalReserves}</p>
        <p><strong>Tipo de cambio (USD):</strong> ${economyData.exchangeRate}</p>
      `,

      culture: `<p>${cultureText}</p>`,
  sports: sportsData.length > 0 
    ? sportsData.map(league => ({
        name: league.strLeague,
        sport: league.strSport,
        logo: league.strLogo || null
      }))
    : null
};

  } catch (error) {
    console.error("Error fetching country:", error);
    return null;
  }
}


async function fetchEconomyData(countryCode) {
  const indicators = {
    gdp: "NY.GDP.MKTP.CD",
    gdpPerCapita: "NY.GDP.PCAP.CD",
    unemploymentRate: "SL.UEM.TOTL.ZS",
    inflation: "FP.CPI.TOTL.ZG",
    publicDebt: "GC.DOD.TOTL.GD.ZS"
  };

  const economyData = {};

  for (const [key, indicator] of Object.entries(indicators)) {
    try {
      const res = await fetch(`https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=1&date=2022`);
      if (!res.ok) {
        economyData[key] = "No disponible";
        continue;
      }
      const json = await res.json();
      economyData[key] = json[1]?.[0]?.value ? json[1][0].value.toLocaleString() : "No disponible";
    } catch {
      economyData[key] = "No disponible";
    }
  }

  // Para los datos que no da World Bank (exportaciones, importaciones, tradingPartners, sectores, reservas, tipo de cambio)
  // podrías intentar usar otra API o dejarlos como "No disponible" por ahora.

  economyData.mainExports = "No disponible";
  economyData.mainImports = "No disponible";
  economyData.tradingPartners = "No disponible";
  economyData.economicSectors = "No disponible";
  economyData.internationalReserves = "No disponible";
  economyData.exchangeRate = "No disponible";

  return economyData;
}

async function fetchCultureData(countryName) {
  try {
    const res = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      description: data.extract || "No disponible"
    };
  } catch {
    return null;
  }
}

const API_KEY = '123';

async function fetchSportsByCountry(countryName) {
  try {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/${API_KEY}/search_all_leagues.php?c=${encodeURIComponent(countryName)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.countrys || []; // Nota: La API devuelve "countrys" (con y) en lugar de "countries"
  } catch (error) {
    console.error("Error fetching sports data:", error);
    return [];
  }
}

async function mostrarDeportes(countryName) {
  const sportsData = await fetchSportsByCountry(countryName);

  if (sportsData.length === 0) {
    document.getElementById('sports-content').innerHTML = `<p>No se encontraron datos deportivos para ${countryName}.</p>`;
    return;
  }

  let html = '<h3>Ligas deportivas en ' + countryName + '</h3><ul>';
  sportsData.forEach(league => {
    html += `<li><strong>${league.strLeague}</strong> - ${league.strSport}</li>`;
  });
  html += '</ul>';

  document.getElementById('sports-content').innerHTML = html;
}


async function fetchLanguageInfo(languages) {
  if (!languages || typeof languages !== 'object') return null;

const COMPLETE_LANGUAGE_DB = {
  // ASIA (Oriente y Sureste)
  'zh': { name: 'Chino Mandarín', family: 'Sino-Tibetana', speakers: 1120, script: 'Hanzi', region: 'Asia Oriental' },
  'yue': { name: 'Cantonés', family: 'Sino-Tibetana', speakers: 85, script: 'Hanzi', region: 'Asia Oriental' },
  'ja': { name: 'Japonés', family: 'Japónica', speakers: 126, script: 'Kanji/Kana', region: 'Asia Oriental' },
  'ko': { name: 'Coreano', family: 'Coreánica', speakers: 81, script: 'Hangul', region: 'Asia Oriental' },
  'vi': { name: 'Vietnamita', family: 'Austroasiática', speakers: 85, script: 'Latino', region: 'Sudeste Asiático' },
  'th': { name: 'Tailandés', family: 'Tai-Kadai', speakers: 61, script: 'Tailandés', region: 'Sudeste Asiático' },
  'id': { name: 'Indonesio', family: 'Austronesia', speakers: 200, script: 'Latino', region: 'Sudeste Asiático' },
  'ms': { name: 'Malayo', family: 'Austronesia', speakers: 77, script: 'Latino', region: 'Sudeste Asiático' },
  'tl': { name: 'Tagalo', family: 'Austronesia', speakers: 28, script: 'Latino', region: 'Sudeste Asiático' },

  // ASIA (Sur y Central)
  'hi': { name: 'Hindi', family: 'Indoaria', speakers: 600, script: 'Devanagari', region: 'Asia Meridional' },
  'bn': { name: 'Bengalí', family: 'Indoaria', speakers: 300, script: 'Bengalí', region: 'Asia Meridional' },
  'pa': { name: 'Panyabí', family: 'Indoaria', speakers: 125, script: 'Gurmukhī', region: 'Asia Meridional' },
  'ta': { name: 'Tamil', family: 'Dravídica', speakers: 85, script: 'Tamil', region: 'Asia Meridional' },
  'te': { name: 'Telugú', family: 'Dravídica', speakers: 82, script: 'Telugú', region: 'Asia Meridional' },
  'ur': { name: 'Urdu', family: 'Indoaria', speakers: 170, script: 'Árabe', region: 'Asia Meridional' },
  'fa': { name: 'Persa', family: 'Indoeuropea', speakers: 77, script: 'Árabe', region: 'Asia Central' },
  'kk': { name: 'Kazajo', family: 'Turca', speakers: 13, script: 'Cirílico', region: 'Asia Central' },
  'uz': { name: 'Uzbeko', family: 'Turca', speakers: 33, script: 'Latino/Cirílico', region: 'Asia Central' },

  // EUROPA
  'en': { name: 'Inglés', family: 'Germánica', speakers: 1500, script: 'Latino', region: 'Global' },
  'de': { name: 'Alemán', family: 'Germánica', speakers: 135, script: 'Latino', region: 'Europa Central' },
  'nl': { name: 'Neerlandés', family: 'Germánica', speakers: 24, script: 'Latino', region: 'Europa Occidental' },
  'sv': { name: 'Sueco', family: 'Germánica', speakers: 13, script: 'Latino', region: 'Europa Nórdica' },
  'fr': { name: 'Francés', family: 'Romance', speakers: 280, script: 'Latino', region: 'Europa Occidental' },
  'es': { name: 'Español', family: 'Romance', speakers: 580, script: 'Latino', region: 'Europa/América' },
  'it': { name: 'Italiano', family: 'Romance', speakers: 67, script: 'Latino', region: 'Europa Meridional' },
  'pt': { name: 'Portugués', family: 'Romance', speakers: 260, script: 'Latino', region: 'Europa/América' },
  'ru': { name: 'Ruso', family: 'Eslava', speakers: 258, script: 'Cirílico', region: 'Europa Oriental' },
  'pl': { name: 'Polaco', family: 'Eslava', speakers: 45, script: 'Latino', region: 'Europa Central' },
  'uk': { name: 'Ucraniano', family: 'Eslava', speakers: 45, script: 'Cirílico', region: 'Europa Oriental' },

  // MEDIO ORIENTE y ÁFRICA del NORTE
  'ar': { name: 'Árabe', family: 'Semítica', speakers: 274, script: 'Árabe', region: 'Medio Oriente' },
  'he': { name: 'Hebreo', family: 'Semítica', speakers: 9, script: 'Hebreo', region: 'Medio Oriente' },
  'tr': { name: 'Turco', family: 'Turca', speakers: 88, script: 'Latino', region: 'Medio Oriente' },
  'ku': { name: 'Kurdo', family: 'Indoeuropea', speakers: 30, script: 'Latino/Árabe', region: 'Medio Oriente' },
  'am': { name: 'Amárico', family: 'Semítica', speakers: 32, script: 'Geʽez', region: 'África Oriental' },

  // ÁFRICA SUBSAHARIANA
  'sw': { name: 'Swahili', family: 'Niger-Congo', speakers: 98, script: 'Latino', region: 'África Oriental' },
  'ha': { name: 'Hausa', family: 'Afroasiática', speakers: 63, script: 'Latino', region: 'África Occidental' },
  'yo': { name: 'Yoruba', family: 'Niger-Congo', speakers: 45, script: 'Latino', region: 'África Occidental' },
  'ig': { name: 'Igbo', family: 'Niger-Congo', speakers: 27, script: 'Latino', region: 'África Occidental' },
  'zu': { name: 'Zulú', family: 'Niger-Congo', speakers: 12, script: 'Latino', region: 'África Austral' },
  'xh': { name: 'Xhosa', family: 'Niger-Congo', speakers: 8, script: 'Latino', region: 'África Austral' },

  // AMÉRICA (Indígenas)
  'qu': { name: 'Quechua', family: 'Quechua', speakers: 8, script: 'Latino', region: 'América del Sur' },
  'ay': { name: 'Aimara', family: 'Aimara', speakers: 2.5, script: 'Latino', region: 'América del Sur' },
  'gn': { name: 'Guaraní', family: 'Tupí-Guaraní', speakers: 6, script: 'Latino', region: 'América del Sur' },
  'nah': { name: 'Náhuatl', family: 'Uto-Azteca', speakers: 1.7, script: 'Latino', region: 'América Central' },

  // ALIASES (ISO 639-2/B y otros)
  'ara': 'ar', 'chi': 'zh', 'zho': 'zh', 'cze': 'cs', 'ces': 'cs', 'wel': 'cy', 'ger': 'de', 'deu': 'de',
  'gre': 'el', 'ell': 'el', 'baq': 'eu', 'eus': 'eu', 'per': 'fa', 'fas': 'fa', 'fre': 'fr', 'fra': 'fr',
  'geo': 'ka', 'kat': 'ka', 'arm': 'hy', 'hye': 'hy', 'ice': 'is', 'isl': 'is', 'mac': 'mk', 'mkd': 'mk',
  'mao': 'mi', 'mri': 'mi', 'may': 'ms', 'msa': 'ms', 'bur': 'my', 'mya': 'my', 'dut': 'nl', 'nld': 'nl',
  'rum': 'ro', 'ron': 'ro', 'slo': 'sk', 'slk': 'sk', 'alb': 'sq', 'sqi': 'sq', 'tib': 'bo', 'bod': 'bo',
  'jpn': 'ja', 'kor': 'ko', 'eng': 'en', 'spa': 'es', 'kaz': 'kk', 'rus': 'ru', 'tur': 'tr', 'vie': 'vi',
  'fin': 'fi', 'swe': 'sv', 'dan': 'da', 'nor': 'no', 'pol': 'pl', 'ukr': 'uk', 'hun': 'hu', 'ron': 'ro',
  'srp': 'sr', 'hrv': 'hr', 'bul': 'bg', 'bel': 'be', 'lit': 'lt', 'lav': 'lv', 'est': 'et', 'glg': 'gl',
  'cat': 'ca', 'slv': 'sl', 'epo': 'eo', 'iku': 'iu', 'oci': 'oc', 'gla': 'gd', 'bre': 'br', 'cos': 'co',
  'div': 'dv', 'fao': 'fo', 'fry': 'fy', 'gle': 'ga', 'glv': 'gv', 'hat': 'ht', 'hmo': 'ho', 'ibo': 'ig',
  'iku': 'iu', 'ipk': 'ik', 'jav': 'jv', 'kik': 'ki', 'kin': 'rw', 'kir': 'ky', 'kom': 'kv', 'kon': 'kg',
  'kua': 'kj', 'lim': 'li', 'lin': 'ln', 'ltz': 'lb', 'lub': 'lu', 'lug': 'lg', 'mah': 'mh', 'mal': 'ml',
  'mlg': 'mg', 'mlt': 'mt', 'mon': 'mn', 'nau': 'na', 'nav': 'nv', 'nde': 'nd', 'ndo': 'ng', 'nep': 'ne',
  'nno': 'nn', 'nob': 'nb', 'nya': 'ny', 'oji': 'oj', 'ori': 'or', 'orm': 'om', 'oss': 'os', 'pli': 'pi',
  'que': 'qu', 'roh': 'rm', 'run': 'rn', 'sag': 'sg', 'san': 'sa', 'sin': 'si', 'sme': 'se', 'smo': 'sm',
  'sna': 'sn', 'snd': 'sd', 'som': 'so', 'sot': 'st', 'srd': 'sc', 'ssw': 'ss', 'sun': 'su', 'swa': 'sw',
  'tah': 'ty', 'tgk': 'tg', 'tir': 'ti', 'ton': 'to', 'tsn': 'tn', 'tso': 'ts', 'tuk': 'tk', 'twi': 'tw',
  'uig': 'ug', 'ven': 've', 'vol': 'vo', 'wln': 'wa', 'wol': 'wo', 'yor': 'yo', 'zha': 'za'
};

  const results = [];
  
  for (const code of Object.keys(languages)) {
    // Normalización del código
    const normalizedCode = COMPLETE_LANGUAGE_DB[code] && typeof COMPLETE_LANGUAGE_DB[code] === 'object' 
      ? code 
      : COMPLETE_LANGUAGE_DB[code.toLowerCase()] || code;
    
    // Resolución de aliases (como 'ara' -> 'ar')
    const finalCode = typeof COMPLETE_LANGUAGE_DB[normalizedCode] === 'string'
      ? COMPLETE_LANGUAGE_DB[normalizedCode]
      : normalizedCode;
    
    // Obtener datos de la base de datos local
    const dbData = COMPLETE_LANGUAGE_DB[finalCode] || {};
    
    // Datos mínimos garantizados
    const languageInfo = {
      name: dbData.name || languages[code] || finalCode,
      code: code,
      family: dbData.family || 'Familia desconocida',
      speakers: dbData.speakers ? `${dbData.speakers} millones` : 'No disponible',
      script: dbData.script || 'Escritura no especificada',
      source: dbData.name ? 'Local DB' : 'Fallback'
    };
    
    results.push(languageInfo);
  }

  return results;
}


function showInfoModal(country) {
  infoModal.style.display = 'block';
  activateTab('general');

  const imageGallery = country.images.map(src => `
    <img src="${src}" alt="Imagen de ${country.name}" style="width:100%; margin-bottom: 10px; border-radius: 8px;">
  `).join('');

  // Diccionarios para corregir los datos faltantes
  const familiasCorregidas = {
    spa: "Indoeuropea",
    cat: "Indoeuropea",
    glc: "Indoeuropea",
    eus: "Lengua aislada"
  };

  const hablantesCorregidos = {
    spa: "~480 millones",
    cat: "~9 millones",
    glc: "~2,5 millones",
    eus: "~750.000"
  };

  const escrituraCorregida = {
    spa: "Alfabeto latino",
    cat: "Alfabeto latino",
    glc: "Alfabeto latino",
    eus: "Alfabeto latino"
  };

  const languageSection = `
    <h3>🗣️ Idiomas oficiales</h3>
    <p><strong>${country.languages}</strong></p>
    
    <div class="language-grid">
      ${
        country.languageDetails ? country.languageDetails.map(lang => {
          const family = lang.family === "Desconocida" ? (familiasCorregidas[lang.code] || "No especificado") : lang.family;
          const speakers = lang.speakers === "Datos no disponibles" ? (hablantesCorregidos[lang.code] || "No especificado") : lang.speakers;
          const script = lang.script === "No especificado" ? (escrituraCorregida[lang.code] || "No especificado") : lang.script;

          return `
            <div class="language-card">
              <h4>${lang.name} <small>(${lang.code})</small></h4>
              <p><strong>Familia:</strong> ${family}</p>
              <p><strong>Hablantes:</strong> ${speakers}</p>
              <p><strong>Escritura:</strong> ${script}</p>
            </div>
          `;
        }).join('') : '<p>No hay detalles adicionales disponibles.</p>'
      }
    </div>

    <div class="api-credit">
      <em>Datos lingüísticos de <a href="https://rapidapi.com/kdictionaries/api/lexicala/" target="_blank">Lexicala API</a></em>
    </div>
  `;

  const sections = {
    general: `
      <h2>${country.name}</h2>
      <img src="${country.flag}" alt="Bandera de ${country.name}" style="max-width:100%; margin:10px 0;">
      <p><strong>Nombre oficial:</strong> ${country.officialName}</p>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Población:</strong> ${country.population}</p>
    `,
geography: country.geography,
    language: languageSection, 
economy: country.economy,
  culture: country.culture,
  sports: country.sports,

  };

  Object.keys(sections).forEach(section => {
    const contentDiv = document.getElementById(`${section}-content`);
    if (contentDiv) contentDiv.innerHTML = sections[section] || "<p>Información no disponible.</p>";
  });
}



function activateTab(tabName) {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.style.display = 'none';
  });

  document.querySelector(`.tab-button[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`${tabName}-content`).style.display = 'block';
}

document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.getAttribute('data-tab');
    activateTab(tabName);
  });
});

closeInfoModal.addEventListener('click', function() {
  infoModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target == infoModal) {
    infoModal.style.display = 'none';
  }
});

mapObject.addEventListener('mousedown', function(event) {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
});

mapObject.addEventListener('mousemove', function(event) {
  if (isDragging) {
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    mapObject.style.transform = `translate(${currentTranslateX + dx}px, ${currentTranslateY + dy}px) scale(${currentScale})`;
  }
});

mapObject.addEventListener('mouseup', function() {
  isDragging = false;
  const transform = getComputedStyle(mapObject).transform;
  const matrix = new DOMMatrix(transform);
  currentTranslateX = matrix.m41;
  currentTranslateY = matrix.m42;
});

zoomInBtn.addEventListener('click', function() {
  currentScale *= 1.1;
  mapObject.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
});

zoomOutBtn.addEventListener('click', function() {
  currentScale *= 0.9;
  mapObject.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
});

