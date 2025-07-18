const weatherApp = document.querySelector("#weather-app form");
const weatherSearch = document.getElementById("weather-search");
const weatherSection = document.getElementById("weather");
const weatherAPI = "b1c77ffbed0a997975e7fe53c6a435d3";

function formatTimestamToTime(timestampseconds) {
  var date = new Date(timestampseconds * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

async function fetchWeatherData(location) {
  weatherSection.innerHTML = " ";
  weatherSearch.value = " ";
  var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${weatherAPI}`;

  try {
    var response = await fetch(weatherURL);
    var data = await response.json();

    if (response.ok) {
      var cityName = data.name;
      var countryCode = data.sys.country;
      var latitude = data.coord.lat;
      var longitude = data.coord.lon;
      var weatherIconCode = data.weather[0].icon;
      var weatherDescription = data.weather[0].description;
      var actualTemperature = data.main.temp;
      var feelsLikeTemperature = data.main.feels_like;
      var lastUpdatedTimestamp = data.dt;

      var googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      var weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

      var lastUpdatedTime = formatTimestamToTime(lastUpdatedTimestamp);

      weatherSection.innerHTML = `
                    <h2>${cityName}, ${countryCode}</h2>
                    <a href="${googleMapsUrl}" target="__BLANK">Click to view map</a>
                    <img src="${weatherIconUrl}" alt="${weatherDescription} icon">
                    <p style="text-transform: capitalize;">${weatherDescription}</p><br>
                    <p>Current: ${actualTemperature}° F</p>
                    <p>Feels like: ${feelsLikeTemperature}° F</p><br>
                    <p>Last updated: ${lastUpdatedTime}</p>
                `;
    } else {
      weatherSection.innerHTML = "<h2>Location not Found</h2>";
      console.error("Network error", data.message);
    }
  } catch (error) {
    weatherSection.innerHTML = "<h2>Failed to fetch data. Try again./h2>";
    console.error("Network error", error);
  }
}

weatherApp.addEventListener("submit", (event) => {
  event.preventDefault();

  let location = weatherSearch.value.trim();

  if (location) {
    fetchWeatherData(location);
  } else {
    weatherSection.innerHTML = "";
  }
});
