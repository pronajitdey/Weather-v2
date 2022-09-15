const cityName = document.querySelector(".city-name");
const currTemp = document.querySelector(".curr-temp");
const weatherCondition = document.querySelector(".weather-condition");
const date = document.querySelector(".date");
const weatherIcon = document.querySelector(".weather-icon");
const windData = document.querySelector(".wind-data");
const humidityData = document.querySelector(".humidity-data");
const pressureData = document.querySelector(".pressure-data");

const currTime = document.querySelector(".curr-time");
const nextHour3 = document.querySelector(".next-hour3");
const nextHour6 = document.querySelector(".next-hour6");
const nextHour9 = document.querySelector(".next-hour9");

const currHourTemp = document.querySelector(".curr-hour-temp");
const nextHour3Temp = document.querySelector(".next-hour3-temp");
const nextHour6Temp = document.querySelector(".next-hour6-temp");
const nextHour9Temp = document.querySelector(".next-hour9-temp");

const currIcon = document.querySelector(".curr-icon");
const next3Icon = document.querySelector(".next3-icon");
const next6Icon = document.querySelector(".next6-icon");
const next9Icon = document.querySelector(".next9-icon");

const API_KEY = "32688692992f26715e3f688cac2f209c";

window.addEventListener("load", getWeatherData());

let today = new Date();
const options = {
  weekday: "long",
  day: "numeric",
  month: "long"
};
date.innerHTML = today.toLocaleDateString("en-US", options);

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=current,hourly,minutely&units=metric&appid=${API_KEY}`).then((response) => {
      return response.json();
    }).then(data => {
      // console.log(data);
      showWeatherData(data);
    })
  });
}

function showWeatherData(data) {
  let { name } = data;
  let { temp, humidity, pressure } = data.main;
  let { description, icon } = data.weather[0];
  let speed = data.wind.speed;

  cityName.innerHTML = `${name}`;
  currTemp.innerHTML = `${Math.round(temp)}`;
  weatherCondition.innerHTML = `${description}`;
  weatherIcon.src = `images/${icon}.png`;

  windData.innerHTML = `${speed} m/s`;
  humidityData.innerHTML = `${humidity}%`;
  pressureData.innerHTML = `${pressure} hPa`;
  
  showHourly3(temp, icon);
}

// api provides forecast for every 3 hours
function showHourly3(temp, icon) {
  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then((response) => {
      return response.json();
    }).then(data => {
      // console.log(data);

      let hour = today.getHours();
      let currHour = hour < 10 ? "0" + hour : hour;
      currTime.innerHTML = `${currHour}:00`;

      currHourTemp.innerHTML = `${Math.round(temp)}`;
      currIcon.src = `images/${icon}.png`;
      
      let hour3, hour6, hour9;

      let idx = 0;
      if (hour >= 21) {
        while (new Date(data.list[idx].dt_txt).getHours() != "00") {
          idx++;
        }
      } else {
        while (new Date(data.list[idx].dt_txt).getHours() <= hour) {
          idx++;
        }
      }
      
      hour3 = new Date(data.list[idx].dt_txt).getHours();
      hour6 = new Date(data.list[idx + 1].dt_txt).getHours();
      hour9 = new Date(data.list[idx + 2].dt_txt).getHours();

      nextHour3.innerHTML = `${hour3}:00`;
      nextHour6.innerHTML = `${hour6}:00`;
      nextHour9.innerHTML = `${hour9}:00`;

      nextHour3Temp.innerHTML = `${Math.round(data.list[idx].main.temp)}`;
      next3Icon.src = `images/${data.list[idx].weather[0].icon}.png`;
      
      nextHour6Temp.innerHTML = `${Math.round(data.list[idx + 1].main.temp)}`;
      next6Icon.src = `images/${data.list[idx + 1].weather[0].icon}.png`;
      
      nextHour9Temp.innerHTML = `${Math.round(data.list[idx + 2].main.temp)}`;
      next9Icon.src = `images/${data.list[idx + 2].weather[0].icon}.png`;
    });
  });
}