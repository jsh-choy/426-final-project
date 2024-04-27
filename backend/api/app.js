// API Key
function fetchWeatherAndRelatedData(lat, lon) {
  const apiKey = '212bc46d8e6c2b718acea73a2843f48e';
  fetchWeather(lat, lon, apiKey);
  fetchAQI(lat, lon);
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

// Fetch UV index
function fetchUVIndex(lat, lon, apiKey) {
  const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(uvUrl)
      .then(response => response.json())
      .then(data => {
          displayUVIndex(data);
      })
      .catch(error => {
        console.error('Error fetching UV Index:', error);
        alert("Failed to fetch UV Index.");
      });
}