/* ========================================================================
   WeatherPulse — App Logic
   Async/Await, Fetch API, Open-Meteo, LocalStorage
   ======================================================================== */

(() => {
  'use strict';

  // ─── API Endpoints ───────────────────────────────────────────────
  const GEO_API  = 'https://geocoding-api.open-meteo.com/v1/search';
  const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

  // ─── DOM References ──────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    bgLayer:        $('#bgLayer'),
    searchInput:    $('#searchInput'),
    autocomplete:   $('#autocompleteList'),
    geoBtn:         $('#geoBtn'),
    recentSearches: $('#recentSearches'),
    recentChips:    $('#recentChips'),
    errorBanner:    $('#errorBanner'),
    errorText:      $('#errorText'),
    errorClose:     $('#errorClose'),
    skeleton:       $('#skeletonContainer'),
    weatherContent: $('#weatherContent'),
    cityName:       $('#cityName'),
    cityMeta:       $('#cityMeta'),
    currentEmoji:   $('#currentEmoji'),
    currentTemp:    $('#currentTemp'),
    currentCondition: $('#currentCondition'),
    humidity:       $('#humidity'),
    windSpeed:      $('#windSpeed'),
    feelsLike:      $('#feelsLike'),
    visibility:     $('#visibility'),
    pressure:       $('#pressure'),
    uvIndex:        $('#uvIndex'),
    forecastGrid:   $('#forecastGrid'),
    hourlyScroll:   $('#hourlyScroll'),
    btnC:           $('#btnCelsius'),
    btnF:           $('#btnFahrenheit'),
    themeToggle:    $('#themeToggle'),
    themeIcon:      $('#themeIcon'),
  };

  // ─── State ───────────────────────────────────────────────────────
  let state = {
    unit: localStorage.getItem('wp_unit') || 'C',
    theme: localStorage.getItem('wp_theme') || 'dark',
    recent: JSON.parse(localStorage.getItem('wp_recent') || '[]'),
    currentData: null,   // cached weather response
    currentCity: null,    // { name, country, lat, lon }
    acIndex: -1,         // autocomplete active index
  };

  // ─── Weather Code Mapping ────────────────────────────────────────
  const weatherMap = {
    0:  { condition: 'Clear Sky',        emoji: '☀️',  group: 'clear'  },
    1:  { condition: 'Mainly Clear',     emoji: '🌤️', group: 'clear'  },
    2:  { condition: 'Partly Cloudy',    emoji: '⛅',  group: 'cloudy' },
    3:  { condition: 'Overcast',         emoji: '☁️',  group: 'cloudy' },
    45: { condition: 'Fog',              emoji: '🌫️', group: 'fog'    },
    48: { condition: 'Rime Fog',         emoji: '🌫️', group: 'fog'    },
    51: { condition: 'Light Drizzle',    emoji: '🌦️', group: 'rain'   },
    53: { condition: 'Drizzle',          emoji: '🌦️', group: 'rain'   },
    55: { condition: 'Dense Drizzle',    emoji: '🌧️', group: 'rain'   },
    56: { condition: 'Freezing Drizzle', emoji: '🌧️', group: 'rain'   },
    57: { condition: 'Heavy Freezing Drizzle', emoji: '🌧️', group: 'rain' },
    61: { condition: 'Slight Rain',      emoji: '🌧️', group: 'rain'   },
    63: { condition: 'Rain',             emoji: '🌧️', group: 'rain'   },
    65: { condition: 'Heavy Rain',       emoji: '🌧️', group: 'rain'   },
    66: { condition: 'Freezing Rain',    emoji: '🌧️', group: 'rain'   },
    67: { condition: 'Heavy Freezing Rain', emoji: '🌧️', group: 'rain' },
    71: { condition: 'Slight Snow',      emoji: '🌨️', group: 'snow'   },
    73: { condition: 'Snow',             emoji: '🌨️', group: 'snow'   },
    75: { condition: 'Heavy Snow',       emoji: '❄️',  group: 'snow'   },
    77: { condition: 'Snow Grains',      emoji: '🌨️', group: 'snow'   },
    80: { condition: 'Light Showers',    emoji: '🌦️', group: 'rain'   },
    81: { condition: 'Showers',          emoji: '🌧️', group: 'rain'   },
    82: { condition: 'Heavy Showers',    emoji: '🌧️', group: 'rain'   },
    85: { condition: 'Snow Showers',     emoji: '🌨️', group: 'snow'   },
    86: { condition: 'Heavy Snow Showers', emoji: '❄️', group: 'snow'  },
    95: { condition: 'Thunderstorm',     emoji: '⛈️',  group: 'storm'  },
    96: { condition: 'Thunderstorm w/ Hail', emoji: '⛈️', group: 'storm' },
    99: { condition: 'Severe Thunderstorm', emoji: '⛈️', group: 'storm' },
  };

  function getWeatherInfo(code) {
    return weatherMap[code] || { condition: 'Unknown', emoji: '🌡️', group: 'clear' };
  }

  // ─── Utilities ───────────────────────────────────────────────────
  function debounce(fn, ms = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  function toF(c) { return (c * 9 / 5) + 32; }

  function formatTemp(celsius) {
    const val = state.unit === 'F' ? toF(celsius) : celsius;
    return `${Math.round(val)}°${state.unit}`;
  }

  function formatWindSpeed(kmh) {
    if (state.unit === 'F') {
      return `${Math.round(kmh * 0.621371)} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  }

  function isDaytime(data) {
    if (!data || !data.current) return true;
    const now = new Date(data.current.time);
    const hour = now.getHours();
    return hour >= 6 && hour < 20;
  }

  function getDayName(dateStr, short = true) {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.getTime() === today.getTime()) return 'Today';
    if (d.getTime() === tomorrow.getTime()) return 'Tmrw';
    return d.toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' });
  }

  function formatHour(isoString) {
    const d = new Date(isoString);
    const h = d.getHours();
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  }

  // ─── Dynamic Background ─────────────────────────────────────────
  function updateBackground(weatherGroup, isDay) {
    const layer = dom.bgLayer;
    // Remove all bg classes
    layer.className = 'bg-layer';
    const suffix = isDay ? 'day' : 'night';
    layer.classList.add(`bg-${weatherGroup}-${suffix}`);
  }

  // ─── Theme ──────────────────────────────────────────────────────
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    dom.themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('wp_theme', theme);
  }

  // ─── Unit Toggle ────────────────────────────────────────────────
  function applyUnit(unit) {
    state.unit = unit;
    dom.btnC.classList.toggle('active', unit === 'C');
    dom.btnF.classList.toggle('active', unit === 'F');
    dom.btnC.setAttribute('aria-pressed', unit === 'C');
    dom.btnF.setAttribute('aria-pressed', unit === 'F');
    localStorage.setItem('wp_unit', unit);
    if (state.currentData && state.currentCity) {
      renderWeather(state.currentData, state.currentCity);
    }
  }

  // ─── Error Handling ─────────────────────────────────────────────
  function showError(msg) {
    dom.errorText.textContent = msg;
    dom.errorBanner.hidden = false;
  }

  function hideError() {
    dom.errorBanner.hidden = true;
  }

  // ─── Loading State ──────────────────────────────────────────────
  function showSkeleton() {
    dom.skeleton.hidden = false;
    dom.weatherContent.hidden = true;
  }

  function hideSkeleton() {
    dom.skeleton.hidden = true;
  }

  // ─── Recent Searches ────────────────────────────────────────────
  function saveRecent(city) {
    // city = { name, country, lat, lon }
    let recent = state.recent.filter(
      (r) => !(r.lat === city.lat && r.lon === city.lon)
    );
    recent.unshift(city);
    recent = recent.slice(0, 5);
    state.recent = recent;
    localStorage.setItem('wp_recent', JSON.stringify(recent));
    renderRecent();
  }

  function renderRecent() {
    const list = state.recent;
    if (list.length === 0) {
      dom.recentSearches.classList.remove('show');
      return;
    }
    dom.recentSearches.classList.add('show');
    dom.recentChips.innerHTML = list
      .map(
        (r, i) =>
          `<button class="recent-chip" role="listitem" data-idx="${i}" aria-label="Search ${r.name}, ${r.country}">${r.name}</button>`
      )
      .join('');
  }

  // ─── Autocomplete / Geocoding ────────────────────────────────────
  async function searchCities(query) {
    if (!query || query.length < 2) {
      hideAutocomplete();
      return;
    }

    try {
      const url = `${GEO_API}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Geocoding request failed');
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        hideAutocomplete();
        return;
      }

      renderAutocomplete(data.results);
    } catch (err) {
      console.error('Geocoding error:', err);
      hideAutocomplete();
    }
  }

  function renderAutocomplete(results) {
    state.acIndex = -1;
    dom.autocomplete.innerHTML = results
      .map(
        (r, i) => `
        <li class="autocomplete-item" role="option" data-idx="${i}"
            data-lat="${r.latitude}" data-lon="${r.longitude}"
            data-name="${r.name}" data-country="${r.country || ''}"
            data-admin="${r.admin1 || ''}">
          <span class="ac-city">${r.name}</span>
          <span class="ac-meta">${[r.admin1, r.country].filter(Boolean).join(', ')}</span>
        </li>`
      )
      .join('');

    dom.autocomplete.classList.add('show');
    dom.searchInput.setAttribute('aria-expanded', 'true');
  }

  function hideAutocomplete() {
    dom.autocomplete.classList.remove('show');
    dom.autocomplete.innerHTML = '';
    state.acIndex = -1;
    dom.searchInput.setAttribute('aria-expanded', 'false');
  }

  function selectAutocompleteItem(el) {
    const city = {
      name: el.dataset.name,
      country: el.dataset.country,
      admin: el.dataset.admin,
      lat: parseFloat(el.dataset.lat),
      lon: parseFloat(el.dataset.lon),
    };
    dom.searchInput.value = '';
    hideAutocomplete();
    fetchWeather(city);
  }

  // ─── Fetch Weather Data ──────────────────────────────────────────
  async function fetchWeather(city) {
    hideError();
    showSkeleton();

    try {
      const params = new URLSearchParams({
        latitude: city.lat,
        longitude: city.lon,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'weather_code',
          'wind_speed_10m',
          'surface_pressure',
          'is_day',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
        ].join(','),
        hourly: [
          'temperature_2m',
          'weather_code',
        ].join(','),
        timezone: 'auto',
        forecast_days: 7,
        forecast_hours: 24,
      });

      const url = `${WEATHER_API}?${params}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Weather API responded with ${res.status}`);
      }

      const data = await res.json();

      state.currentData = data;
      state.currentCity = city;

      saveRecent(city);
      renderWeather(data, city);
    } catch (err) {
      console.error('Weather fetch error:', err);
      showError('Unable to fetch weather data. Please check your connection and try again.');
      dom.weatherContent.hidden = true;
    } finally {
      hideSkeleton();
    }
  }

  // ─── Render Weather ──────────────────────────────────────────────
  function renderWeather(data, city) {
    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;
    const info = getWeatherInfo(current.weather_code);
    const isDay = current.is_day === 1;

    // Background
    updateBackground(info.group, isDay);

    // City
    dom.cityName.textContent = city.name;
    const metaParts = [city.admin, city.country].filter(Boolean).join(', ');
    const now = new Date(current.time);
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    dom.cityMeta.textContent = metaParts ? `${metaParts} · ${timeStr}` : timeStr;

    // Current
    dom.currentEmoji.textContent = info.emoji;
    dom.currentTemp.textContent = formatTemp(current.temperature_2m);
    dom.currentCondition.textContent = info.condition;

    // Details
    dom.humidity.textContent = `${current.relative_humidity_2m}%`;
    dom.windSpeed.textContent = formatWindSpeed(current.wind_speed_10m);
    dom.feelsLike.textContent = formatTemp(current.apparent_temperature);
    dom.visibility.textContent = isDay ? 'Day' : 'Night';
    dom.pressure.textContent = `${Math.round(current.surface_pressure)} hPa`;
    dom.uvIndex.textContent = isDay ? '—' : '—'; // Open-Meteo free tier doesn't always include UV

    // 7-day Forecast
    dom.forecastGrid.innerHTML = '';
    for (let i = 0; i < daily.time.length; i++) {
      const dInfo = getWeatherInfo(daily.weather_code[i]);
      const card = document.createElement('div');
      card.className = 'forecast-card';
      card.setAttribute('role', 'listitem');
      card.innerHTML = `
        <span class="forecast-day">${getDayName(daily.time[i])}</span>
        <span class="forecast-emoji" aria-label="${dInfo.condition}">${dInfo.emoji}</span>
        <span class="forecast-high">${formatTemp(daily.temperature_2m_max[i])}</span>
        <span class="forecast-low">${formatTemp(daily.temperature_2m_min[i])}</span>
      `;
      dom.forecastGrid.appendChild(card);
    }

    // Hourly
    dom.hourlyScroll.innerHTML = '';
    if (hourly && hourly.time) {
      const currentHour = new Date().getHours();
      for (let i = 0; i < hourly.time.length; i++) {
        const hInfo = getWeatherInfo(hourly.weather_code[i]);
        const hDate = new Date(hourly.time[i]);
        const isNow = hDate.getHours() === currentHour && i < 2; // rough match
        const card = document.createElement('div');
        card.className = `hourly-card${isNow ? ' now' : ''}`;
        card.setAttribute('role', 'listitem');
        card.innerHTML = `
          <span class="hourly-time">${isNow ? 'Now' : formatHour(hourly.time[i])}</span>
          <span class="hourly-emoji" aria-label="${hInfo.condition}">${hInfo.emoji}</span>
          <span class="hourly-temp">${formatTemp(hourly.temperature_2m[i])}</span>
        `;
        dom.hourlyScroll.appendChild(card);
      }
    }

    dom.weatherContent.hidden = false;
  }

  // ─── Geolocation ────────────────────────────────────────────────
  async function detectLocation() {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser.');
      return;
    }

    dom.geoBtn.classList.add('loading');

    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = pos.coords;

      // Reverse geocode
      const geoRes = await fetch(
        `${GEO_API}?name=_&count=1&language=en&format=json&latitude=${latitude}&longitude=${longitude}`
      );

      // Fallback: just use coords
      let city = {
        name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
        country: '',
        admin: '',
        lat: latitude,
        lon: longitude,
      };

      // Try reverse via a small search radius approach — Open-Meteo geocoding
      // doesn't have true reverse, so we fetch weather directly with coords
      // and attempt a name lookup.
      try {
        const revRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
        );
        if (revRes.ok) {
          const revData = await revRes.json();
          if (revData && revData.address) {
            city.name = revData.address.city || revData.address.town || revData.address.village || revData.address.county || city.name;
            city.country = revData.address.country || '';
            city.admin = revData.address.state || '';
          }
        }
      } catch (_) {
        // keep fallback
      }

      await fetchWeather(city);
    } catch (err) {
      console.error('Geolocation error:', err);
      let msg = 'Unable to detect your location.';
      if (err.code === 1) msg = 'Location access denied. Please allow location access and try again.';
      if (err.code === 2) msg = 'Location unavailable. Please try again later.';
      if (err.code === 3) msg = 'Location request timed out. Please try again.';
      showError(msg);
    } finally {
      dom.geoBtn.classList.remove('loading');
    }
  }

  // ─── Event Listeners ────────────────────────────────────────────

  // Search with debounce
  const debouncedSearch = debounce(searchCities, 350);
  dom.searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value.trim());
  });

  // Keyboard navigation in autocomplete
  dom.searchInput.addEventListener('keydown', (e) => {
    const items = dom.autocomplete.querySelectorAll('.autocomplete-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.acIndex = Math.min(state.acIndex + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('active', i === state.acIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.acIndex = Math.max(state.acIndex - 1, 0);
      items.forEach((el, i) => el.classList.toggle('active', i === state.acIndex));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (state.acIndex >= 0 && items[state.acIndex]) {
        selectAutocompleteItem(items[state.acIndex]);
      }
    } else if (e.key === 'Escape') {
      hideAutocomplete();
    }
  });

  // Click on autocomplete item
  dom.autocomplete.addEventListener('click', (e) => {
    const item = e.target.closest('.autocomplete-item');
    if (item) selectAutocompleteItem(item);
  });

  // Close autocomplete on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      hideAutocomplete();
    }
  });

  // Geo button
  dom.geoBtn.addEventListener('click', detectLocation);

  // Recent chips
  dom.recentChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.recent-chip');
    if (!chip) return;
    const idx = parseInt(chip.dataset.idx, 10);
    const city = state.recent[idx];
    if (city) fetchWeather(city);
  });

  // Error close
  dom.errorClose.addEventListener('click', hideError);

  // Unit toggle
  dom.btnC.addEventListener('click', () => applyUnit('C'));
  dom.btnF.addEventListener('click', () => applyUnit('F'));

  // Theme toggle
  dom.themeToggle.addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // ─── Init ───────────────────────────────────────────────────────
  function init() {
    // Apply saved preferences
    applyTheme(state.theme);
    applyUnit(state.unit);
    renderRecent();

    // Load last city or default
    if (state.recent.length > 0) {
      fetchWeather(state.recent[0]);
    } else {
      // Default: London
      fetchWeather({
        name: 'London',
        country: 'United Kingdom',
        admin: 'England',
        lat: 51.5074,
        lon: -0.1278,
      });
    }
  }

  init();
})();
