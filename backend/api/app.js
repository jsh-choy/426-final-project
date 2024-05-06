document.addEventListener('DOMContentLoaded', async function() {
  try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const data = await fetchWeather(latitude, longitude);
      displayWeather(data);
  } catch (error) {
      console.error('Error:', error);
      handleLocationError(error);
  }
});

async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function fetchWeather(lat, lon) {
  const apiKey = '212bc46d8e6c2b718acea73a2843f48e'; // Consider moving to server-side or environment variable
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  const response = await fetch(url);
  if (!response.ok) {
      throw new Error('Failed to fetch weather data');
  }
  return response.json();
};

function displayWeather(data) {
  const temperature = document.getElementById('temperature');
  const conditions = document.getElementById('conditions');

  temperature.innerHTML = `${data.main.temp} °F <i class="${getTemperatureIcon(data.main.temp)}"></i>`;
  conditions.innerHTML = `${data.weather[0].main} <i class="${getWeatherIcon(data.weather[0].main.toLowerCase())}"></i>`;
};

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
};

function getTemperatureIcon(temp) {
  if (temp <= 0) {
      return 'fas fa-temperature-low'; // Cold
  } else if (temp > 0 && temp < 20) {
      return 'fas fa-thermometer-half'; // Mild
  } else {
      return 'fas fa-temperature-high'; // Hot
  }
};

function handleLocationError(error) {
  console.error('Geolocation error:', error);
  alert('Geolocation is not supported by this browser.');
};