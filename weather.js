/* ==========================================================================
   API INTEGRATION HUB - WEATHER STATION MODULE (weather.js)
   ========================================================================== */

window.WeatherController = {
    // Preset coordinates to accelerate loading times and ensure high reliability
    presets: {
        'Mumbai': { lat: 19.0760, lon: 72.8777, country: 'India' },
        'New York': { lat: 40.7128, lon: -74.0060, country: 'United States' },
        'London': { lat: 51.5074, lon: -0.1278, country: 'United Kingdom' },
        'Tokyo': { lat: 35.6762, lon: 139.6503, country: 'Japan' },
        'Paris': { lat: 48.8566, lon: 2.3522, country: 'France' }
    },

    // Map Open-Meteo WMO weather codes to user-friendly strings & SVGs
    // Info: https://open-meteo.com/en/docs
    weatherCodes: {
        0: { label: "Clear Sky", icon: "sunny" },
        1: { label: "Mainly Clear", icon: "sunny-cloudy" },
        2: { label: "Partly Cloudy", icon: "cloudy-sun" },
        3: { label: "Overcast", icon: "cloudy" },
        45: { label: "Foggy", icon: "fog" },
        48: { label: "Depositing Rime Fog", icon: "fog" },
        51: { label: "Light Drizzle", icon: "rain-light" },
        53: { label: "Moderate Drizzle", icon: "rain-light" },
        55: { label: "Dense Drizzle", icon: "rain-light" },
        61: { label: "Slight Rain", icon: "rain-moderate" },
        63: { label: "Moderate Rain", icon: "rain-moderate" },
        65: { label: "Heavy Rain", icon: "rain-heavy" },
        71: { label: "Slight Snow", icon: "snow" },
        73: { label: "Moderate Snow", icon: "snow" },
        75: { label: "Heavy Snow", icon: "snow" },
        80: { label: "Slight Rain Showers", icon: "rain-heavy" },
        81: { label: "Moderate Rain Showers", icon: "rain-heavy" },
        82: { label: "Violent Rain Showers", icon: "rain-heavy" },
        95: { label: "Thunderstorm", icon: "storm" },
        96: { label: "Thunderstorm with Hail", icon: "storm" },
        99: { label: "Severe Thunderstorm", icon: "storm" }
    },

    // Return responsive SVG inline icon based on weather state name
    getWeatherSvg(iconType, isLarge = false) {
        const sizeClass = isLarge ? "weather-svg-large" : "weather-svg-small";
        
        switch (iconType) {
            case "sunny":
                return `
                    <svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                    </svg>
                `;
            case "sunny-cloudy":
            case "cloudy-sun":
                return `
                    <svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41" stroke="#eab308"></path>
                        <circle cx="12" cy="12" r="4" stroke="#eab308"></circle>
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="var(--bg-card)" stroke="currentColor"></path>
                    </svg>
                `;
            case "cloudy":
                return `
                    <svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="var(--bg-input)" stroke="currentColor"></path>
                    </svg>
                `;
            case "fog":
                return `
                    <svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor"></path>
                        <line x1="5" y1="22" x2="19" y2="22"></line>
                        <line x1="8" y1="18" x2="16" y2="18"></line>
                    </svg>
                `;
            case "rain-light":
            case "rain-moderate":
                return `
                    <svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor"></path>
                        <line x1="10" y1="21" x2="10" y2="23"></line>
                        <line x1="14" y1="21" x2="14" y2="23"></line>
                    </svg>
                `;
            case "rain-heavy":
                return `
                    <svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor"></path>
                        <line x1="8" y1="21" x2="6" y2="23"></line>
                        <line x1="12" y1="21" x2="10" y2="23"></line>
                        <line x1="16" y1="21" x2="14" y2="23"></line>
                    </svg>
                `;
            case "storm":
                return `
                    <svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor"></path>
                        <polyline points="13 18 9 22 12 22 10 26" stroke="#f59e0b" stroke-width="2.5"></polyline>
                    </svg>
                `;
            case "snow":
                return `
                    <svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor"></path>
                        <line x1="12" y1="20" x2="12" y2="24"></line>
                        <line x1="10" y1="22" x2="14" y2="22"></line>
                    </svg>
                `;
            default:
                return `
                    <svg class="${sizeClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                `;
        }
    },

    init() {
        this.resultsContainer = document.getElementById('weather-results');
        this.searchForm = document.getElementById('weather-search-form');
        this.cityInput = document.getElementById('weather-city-input');
        
        // Custom preset selectors
        const presetsRow = document.getElementById('preset-cities-container');
        if (presetsRow) {
            presetsRow.addEventListener('click', (e) => {
                const btn = e.target.closest('.preset-btn');
                if (!btn) return;
                
                // Highlight select preset
                presetsRow.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const city = btn.getAttribute('data-city');
                this.loadPresetCity(city);
            });
        }
        
        // Search submit listener
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const searchVal = this.cityInput.value.trim();
                if (searchVal) {
                    this.searchCustomCity(searchVal);
                }
            });
        }
        
        // Initialize on preset Mumbai (first)
        this.loadPresetCity('Mumbai');
    },

    renderSkeleton() {
        this.resultsContainer.innerHTML = `
            <div class="skeleton-loader weather-dashboard">
                <div class="weather-main-grid">
                    <!-- Today skeleton -->
                    <div class="skeleton-block skeleton-rect" style="height: 220px;"></div>
                    
                    <!-- Stats skeleton -->
                    <div class="weather-details-block">
                        <div class="skeleton-block skeleton-rect" style="height: 102px;"></div>
                        <div class="skeleton-block skeleton-rect" style="height: 102px;"></div>
                        <div class="skeleton-block skeleton-rect" style="height: 102px;"></div>
                        <div class="skeleton-block skeleton-rect" style="height: 102px;"></div>
                    </div>
                </div>
                
                <!-- 5-Day forecast skeleton title -->
                <div class="skeleton-block skeleton-text heading" style="width: 20%; margin-top: 10px;"></div>
                
                <!-- 5-Day items skeleton -->
                <div class="forecast-grid">
                    <div class="skeleton-block skeleton-rect" style="height: 140px;"></div>
                    <div class="skeleton-block skeleton-rect" style="height: 140px;"></div>
                    <div class="skeleton-block skeleton-rect" style="height: 140px;"></div>
                    <div class="skeleton-block skeleton-rect" style="height: 140px;"></div>
                    <div class="skeleton-block skeleton-rect" style="height: 140px;"></div>
                </div>
            </div>
        `;
    },

    loadPresetCity(cityName) {
        const coords = this.presets[cityName];
        if (coords) {
            this.fetchWeatherData(cityName, coords.country, coords.lat, coords.lon);
        }
    },

    async searchCustomCity(cityName) {
        // Clear active selection states from buttons
        const presetsRow = document.getElementById('preset-cities-container');
        if (presetsRow) {
            presetsRow.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        }
        
        this.renderSkeleton();
        
        try {
            // Fetch coordinate locations via keyless geocoding API
            const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
            const geoRes = await fetch(geocodeUrl);
            
            if (!geoRes.ok) {
                throw new Error("Geocoding service unavailable.");
            }
            
            const geoData = await geoRes.json();
            
            if (!geoData.results || geoData.results.length === 0) {
                this.renderErrorState(`City "${cityName}" not found!`, "Please double-check spelling or try searching another location.");
                return;
            }
            
            const match = geoData.results[0];
            const resolvedName = match.name;
            const country = match.country || 'Unknown';
            
            this.fetchWeatherData(resolvedName, country, match.latitude, match.longitude);
            
        } catch (err) {
            console.error(err);
            this.renderErrorState("Unable to search locations.", "Network failure or rate limits hit. Please check your connection and retry.");
        }
    },

    async fetchWeatherData(cityName, country, lat, lon) {
        this.renderSkeleton();
        
        try {
            // Open-Meteo keyless weather forecast query
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
            const res = await fetch(weatherUrl);
            
            if (!res.ok) {
                throw new Error(`Weather service responded with status ${res.status}`);
            }
            
            const data = await res.json();
            this.renderWeatherDashboard(cityName, country, data);
            
        } catch (err) {
            console.error(err);
            this.renderErrorState("Failed to retrieve weather data.", "Unable to establish contact with Open-Meteo API servers. Please check your internet connection.");
        }
    },

    renderWeatherDashboard(cityName, country, data) {
        const cur = data.current_weather;
        const curCode = cur.weathercode;
        const mappedCode = this.weatherCodes[curCode] || { label: "Moderate Conditions", icon: "cloudy" };
        
        // 1. Compile 5-day Forecast Data
        let forecastHtml = '';
        const daily = data.daily;
        
        for (let i = 1; i <= 5; i++) {
            if (!daily.time[i]) break;
            
            const dateStr = daily.time[i];
            const dateObj = new Date(dateStr);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const fCode = daily.weathercode[i];
            const fMapped = this.weatherCodes[fCode] || { label: "Overcast", icon: "cloudy" };
            
            forecastHtml += `
                <div class="forecast-card">
                    <span class="forecast-day">${dayName}</span>
                    <span class="forecast-date">${monthDay}</span>
                    ${this.getWeatherSvg(fMapped.icon, false)}
                    <span class="forecast-temps" title="${fMapped.label}">
                        <span class="forecast-temp-max">${maxTemp}°</span>
                        <span class="forecast-temp-min">${minTemp}°</span>
                    </span>
                </div>
            `;
        }
        
        // 2. Compile Dashboard HTML
        this.resultsContainer.innerHTML = `
            <div class="weather-dashboard animate-fade-in">
                
                <!-- Main Grid block -->
                <div class="weather-main-grid">
                    
                    <!-- Card 1: Main Temp details -->
                    <div class="weather-now-card">
                        <div class="weather-now-header">
                            <div class="weather-now-title">
                                <h3>${cityName}</h3>
                                <p>${country}</p>
                            </div>
                            ${this.getWeatherSvg(mappedCode.icon, true)}
                        </div>
                        
                        <div style="margin-top: auto;">
                            <div class="weather-temp-row">
                                <span class="weather-temp-large">${Math.round(cur.temperature)}</span>
                                <span class="weather-temp-unit">°C</span>
                            </div>
                            <span class="weather-now-condition">${mappedCode.label}</span>
                        </div>
                    </div>
                    
                    <!-- Card 2: Stats Grid detail -->
                    <div class="weather-details-block">
                        
                        <!-- Windspeed -->
                        <div class="weather-metric-card">
                            <div class="weather-metric-icon">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                                </svg>
                            </div>
                            <div class="weather-metric-info">
                                <span class="weather-metric-val">${cur.windspeed} km/h</span>
                                <span class="weather-metric-lbl">Windspeed</span>
                            </div>
                        </div>
                        
                        <!-- Longitude -->
                        <div class="weather-metric-card">
                            <div class="weather-metric-icon">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="2" y1="12" x2="22" y2="12"></line>
                                    <line x1="12" y1="2" x2="12" y2="22"></line>
                                </svg>
                            </div>
                            <div class="weather-metric-info">
                                <span class="weather-metric-val">${Number(data.longitude).toFixed(2)}°E</span>
                                <span class="weather-metric-lbl">Longitude</span>
                            </div>
                        </div>
                        
                        <!-- Latitude -->
                        <div class="weather-metric-card">
                            <div class="weather-metric-icon">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                </svg>
                            </div>
                            <div class="weather-metric-info">
                                <span class="weather-metric-val">${Number(data.latitude).toFixed(2)}°N</span>
                                <span class="weather-metric-lbl">Latitude</span>
                            </div>
                        </div>
                        
                        <!-- Timezone -->
                        <div class="weather-metric-card">
                            <div class="weather-metric-icon">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div class="weather-metric-info">
                                <span class="weather-metric-val">${data.timezone_abbreviation || 'GMT'}</span>
                                <span class="weather-metric-lbl">Time Zone</span>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                
                <!-- 5-Day Forecast Grid -->
                <h4 class="forecast-section-title">5-Day Forecast Details</h4>
                <div class="forecast-grid">
                    ${forecastHtml}
                </div>
                
            </div>
        `;
    },

    renderErrorState(title, description) {
        this.resultsContainer.innerHTML = `
            <div class="error-state">
                <div class="error-icon">⚠️</div>
                <h3>${title}</h3>
                <p>${description}</p>
                <button class="btn btn-secondary btn-retry" id="btn-weather-retry">
                    Return to Defaults
                </button>
            </div>
        `;
        
        document.getElementById('btn-weather-retry').addEventListener('click', () => {
            // Restore active state to Mumbai preset
            const presetsRow = document.getElementById('preset-cities-container');
            if (presetsRow) {
                presetsRow.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                const mumBtn = presetsRow.querySelector('[data-city="Mumbai"]');
                if (mumBtn) mumBtn.classList.add('active');
            }
            this.loadPresetCity('Mumbai');
        });
    }
};
