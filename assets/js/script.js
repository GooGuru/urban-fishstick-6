const apiKey = '7861c8d0df70f9154f90fa869bb4f940';

// Event listeners
document.getElementById('searchBtn').addEventListener('click', fetchWeather);
document.querySelectorAll('.city-btn').forEach(button => {
    button.addEventListener('click', () => {
        const city = button.textContent;
        fetchWeatherByCity(city);
    });
});

// Fetch weather data
function fetchWeather() {
    const city = document.getElementById('cityInput').value;
    fetchWeatherByCity(city);
}

function fetchWeatherByCity(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    
    fetch(apiURL)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error('Error fetching data:', error));
}

function displayWeather(data) {
    document.getElementById('cityName').textContent = `${data.name} (${new Date().toLocaleDateString()})`;
    document.getElementById('currentTemp').textContent = `Temp: ${data.main.temp} °F`;
    document.getElementById('currentWind').textContent = `Wind: ${data.wind.speed} MPH`;
    document.getElementById('currentHumidity').textContent = `Humidity: ${data.main.humidity} %`;

    // Fetch the 5-day forecast data
    fetchForecast(data.coord.lat, data.coord.lon);
}

function fetchForecast(lat, lon) {
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    
    fetch(apiURL)
        .then(response => response.json())
        .then(data => displayForecast(data.list))
        .catch(error => console.error('Error fetching forecast:', error));
}

function displayForecast(forecastData) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ''; // Clear previous data

    // Filter data to show once per day (noon time)
    const dailyData = forecastData.filter(item => item.dt_txt.includes("12:00:00"));
    
    dailyData.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('forecast-day');
        dayDiv.innerHTML = `
            <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
            <p>Temp: ${day.main.temp} °F</p>
            <p>Wind: ${day.wind.speed} MPH</p>
            <p>Humidity: ${day.main.humidity} %</p>
        `;
        forecastDiv.appendChild(dayDiv);
    });
}
