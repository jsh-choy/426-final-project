document.addEventListener('DOMContentLoaded', function() {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetchWeatherAndRelatedData(latitude, longitude);
  }, () => {
    console.error('Geolocation is not supported by this browser.');
    fetchNews();
  });
});


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
    })
    .catch(error => {
        // Check if the weather is fetching
        console.error('Error fetching weather:', error);
        alert("Failed to fetch weather data.");
    });
}

function displayWeather(data) {
  console.log(data.weather[0].main); // Log the main weather condition to the console

  const temperature = document.getElementById('temperature');
  const conditions = document.getElementById('conditions');

  temperature.innerHTML = `${data.main.temp} °F <i class="${getTemperatureIcon(data.main.temp)}"></i>`;
  conditions.innerHTML = `${data.weather[0].main} <i class="${getWeatherIcon(data.weather[0].main.toLowerCase())}"></i>`;
}

function getWeatherIcon(condition) {
  const weatherIcons = {
      clear: 'wi wi-day-sunny',
      clouds: 'wi wi-cloudy',
      rain: 'wi wi-rain',
      snow: 'wi wi-snow',
      thunderstorm: 'wi wi-thunderstorm',
      mist: 'wi wi-fog',
      smoke: 'wi wi-smoke',
      haze: 'wi wi-day-haze',
      dust: 'wi wi-dust',
      fog: 'wi wi-fog',
      sand: 'wi wi-sandstorm',
      ash: 'wi wi-volcano',
      squall: 'wi wi-strong-wind',
      tornado: 'wi wi-tornado'
  };
  return weatherIcons[condition] || 'wi wi-cloud'; // Default icon
}

function getTemperatureIcon(temp) {
  if (temp <= 0) {
      return 'fas fa-temperature-low'; // Cold
  } else if (temp > 0 && temp < 20) {
      return 'fas fa-thermometer-half'; // Mild
  } else {
      return 'fas fa-temperature-high'; // Hot
  }
}