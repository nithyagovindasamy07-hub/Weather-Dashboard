
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weatherResult");

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    message.textContent = "Please enter a city name!";
    weatherResult.hidden = true;
    return;
  }

  message.textContent = "Loading weather...";
  weatherResult.hidden = true;

  try {
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoURL);

    if (!geoResponse.ok) {
      throw new Error("Unable to find city.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Please try another city.");
    }

    const place = geoData.results[0];

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
      throw new Error("Unable to get weather data.");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    document.getElementById("cityName").textContent =
      place.name + (place.country ? ", " + place.country : "");

    document.getElementById("temperature").textContent =
      current.temperature_2m + " °C";

    document.getElementById("humidity").textContent =
      current.relative_humidity_2m + "%";

    document.getElementById("wind").textContent =
      current.wind_speed_10m + " km/h";

    const codes = {
      0: "Clear sky ☀️",
      1: "Mainly clear 🌤️",
      2: "Partly cloudy ⛅",
      3: "Overcast ☁️",
      45: "Fog 🌫️",
      48: "Fog 🌫️",
      51: "Light drizzle 🌦️",
      61: "Rain 🌧️",
      63: "Rain 🌧️",
      65: "Heavy rain 🌧️",
      71: "Snow ❄️",
      80: "Rain showers 🌦️",
      95: "Thunderstorm ⛈️"
    };

    document.getElementById("condition").textContent =
      codes[current.weather_code] || "Weather information available";

    weatherResult.hidden = false;
    message.textContent = "";

  } catch (error) {
    message.textContent = error.message;
    weatherResult.hidden = true;
  }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
