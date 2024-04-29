// API Key
function fetchWeatherAndRelatedData(lat, lon) {
  const apiKey = '212bc46d8e6c2b718acea73a2843f48e';
  fetchWeather(lat, lon, apiKey);
}

// Fetch weather data
function fetchWeather(lat, lon, apiKey) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
        displayWeather(data);
        fetchUVIndex(lat, lon, apiKey);
    })
    .catch(error => {
        // Check if the weather is fetching
        console.error('Error fetching weather:', error);
        alert("Failed to fetch weather data.");
    });
}