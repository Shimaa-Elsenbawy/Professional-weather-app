import { getWeatherForCity } from './data.js';

let weatherData = null;
let selectedDay = null;


let nowWeather = document.createElement("h1");
let country = document.querySelector(".country");
let searchInput = document.querySelector(".search-input");
let btn = document.querySelector(".btn");
let temp = document.querySelector(".weather-temperature > h1");
let dateElement = document.createElement("p");
let imgNowStatus = document.createElement("img");
let imgNowStatusDiv = document.querySelector(".imgNowStatus");
let cards = document.querySelectorAll(".cards h2");

let AllDays = document.querySelector(".dailay-forecast");
let AllHours = document.querySelector(".AllHours");
let daySelect = document.querySelector(".day-select");
let heroFeelsLike = document.querySelector(".hero-feels-like");


let feelsLikeValue = document.querySelector(".feels-like-value");
let humidityValue = document.querySelector(".humidity-value");
let windValue = document.querySelector(".wind-value");
let precipitationValue = document.querySelector(".precipitation-value");

let feelsLikeCircle = document.querySelector("#feelsLikeCircle");
let humidityCircle = document.querySelector("#humidityCircle");
let precipitationCircle = document.querySelector("#precipitationCircle");

let windBar = document.querySelector("#windBar");


country.append(nowWeather, dateElement);
imgNowStatusDiv.append(imgNowStatus);

function getWeatherIcon(condition, isNight = false) {

    const icons = {
        "Sunny": isNight
            ? "assets/images/icon-clear-night.png"
            : "assets/images/icon-sunny.webp",

        "Partly Cloudy": isNight
            ? "assets/images/icon-overcast.webp"
            : "assets/images/icon-partly-cloudy.webp",

        "Cloudy": "assets/images/icon-overcast.webp",
        "Rainy": "assets/images/icon-rain.webp",
        "Fog": "assets/images/icon-fog.webp",
        "Storm": "assets/images/icon-storm.webp",
        "Drizzle": "assets/images/icon-drizzle.webp",
        "Snow": "assets/images/icon-snow.webp"
    };

    return icons[condition];
}
function updateDaySelect() {

    daySelect.innerHTML = "";

    weatherData.forecast.forEach((f) => {

        let option = document.createElement("option");

        option.value = f.day;
        option.textContent = f.day;

        daySelect.appendChild(option);

    });

    daySelect.value = selectedDay || weatherData.forecast[0].day;
}

function updateNow(weather) {

    nowWeather.textContent =
        `${weather.city}, ${weather.country}`;

    temp.textContent =
        `${weather.temperature}°`;

    imgNowStatus.src =
        getWeatherIcon(
            weather.condition,
            weather.isNight
        );


    heroFeelsLike.textContent =
        weather.feelsLike;

    dateElement.textContent =
        `${weather.forecast[0].day}, ${new Date().getFullYear()}`;


    /* =====================
       Metric Values
    ===================== */

    feelsLikeValue.textContent =
        `${weather.feelsLike}°`;

    humidityValue.textContent =
        `${weather.humidity}%`;

    windValue.textContent =
        `${weather.windSpeed} km/h`;

    precipitationValue.textContent =
        `${weather.precipitation} mm`;


    /* =====================
       Circular Progress
    ===================== */

    /*
       Feels like:
       Normalize temperature
       between 0 → 50
    */

    let feelsLikeProgress =
        Math.min(
            (weather.feelsLike / 50) * 100,
            100
        );

    feelsLikeCircle.style
        .setProperty(
            "--progress",
            feelsLikeProgress
        );

    feelsLikeCircle.querySelector("span")
        .textContent =
        `${Math.round(feelsLikeProgress)}%`;


    /*
       Humidity
       already percentage
    */

    humidityCircle.style
        .setProperty(
            "--progress",
            weather.humidity
        );

    humidityCircle.querySelector("span")
        .textContent =
        `${weather.humidity}%`;


    /*
       Precipitation
       0 → 10 mm
    */

    let precipitationProgress =
        Math.min(
            (weather.precipitation / 10) * 100,
            100
        );

    precipitationCircle.style
        .setProperty(
            "--progress",
            precipitationProgress
        );

    precipitationCircle.querySelector("span")
        .textContent =
        `${weather.precipitation}mm`;


    /*
       Wind
       0 → 50 km/h
    */

    let windProgress =
        Math.min(
            (weather.windSpeed / 50) * 100,
            100
        );

    windBar.style.width =
        `${windProgress}%`;
}

function ForeCast() {

    AllDays.innerHTML = "";

    weatherData.forecast.forEach((f) => {

        let dailyForecast = document.createElement("div");
        let day = document.createElement("h3");
        let imgStatus = document.createElement("img");

        let minMax = document.createElement("div");
        let minTemperature = document.createElement("p");
        let maxTemperature = document.createElement("p");

        dailyForecast.classList.add("dailyForecast");
        minMax.classList.add("minMax");
        imgStatus.classList.add("imgStatus");

        day.textContent =
            `${f.day[0]}${f.day[1]}${f.day[2]}`;

        minTemperature.textContent =
            `${f.minTemperature}°`;

        maxTemperature.textContent =
            `${f.maxTemperature}°`;

        imgStatus.src =
            getWeatherIcon(f.condition);

        minMax.append(
            maxTemperature,
            minTemperature
        );

        dailyForecast.append(
            day,
            imgStatus,
            minMax
        );

        AllDays.appendChild(dailyForecast);

        dailyForecast.addEventListener("click", () => {
            document.querySelectorAll(".dailyForecast").forEach((day) => { day.classList.remove("selected"); });

            selectedDay = f.day;
            dailyForecast.classList.add("selected")

            temp.textContent = `${f.maxTemperature}°`;

            imgNowStatus.src = getWeatherIcon(f.condition);

            dateElement.textContent =
                `${selectedDay}, ${new Date().getFullYear()}`;

            daySelect.value = selectedDay;

            hourlyWeather(selectedDay);

        });

    });
}

function hourlyWeather(day) {

    AllHours.innerHTML = "";

    const selectedForecast =
        weatherData.forecast.find(
            (f) => f.day === day
        );

    if (!selectedForecast || !selectedForecast.hourly) {

        AllHours.innerHTML =
            "<h1>NO DATA</h1>";

        return;
    }

    selectedForecast.hourly.forEach((h) => {

        let HourlyWeather =
            document.createElement("div");

        HourlyWeather.classList.add(
            "hourly-weather"
        );

        let HoursAndStatus =
            document.createElement("div");

        HoursAndStatus.classList.add(
            "HoursAndStatus"
        );

        let imgStatusHourly =
            document.createElement("img");

        let hour =
            document.createElement("h3");

        let hourlyTemp =
            document.createElement("h3");

        imgStatusHourly.src =
            getWeatherIcon(h.condition, h.isNight);

        hour.textContent =
            h.time;

        hourlyTemp.textContent =
            `${h.temperature}°`;

        HoursAndStatus.append(
            imgStatusHourly,
            hour
        );

        HourlyWeather.append(
            HoursAndStatus,
            hourlyTemp
        );

        AllHours.appendChild(
            HourlyWeather
        );
    });
}

async function searchCity(cityName) {


    try {

        btn.disabled = true;

        weatherData = await getWeatherForCity(cityName);

        selectedDay =
            weatherData.forecast[0].day;

        updateNow(weatherData);

        updateDaySelect();

        ForeCast();

        hourlyWeather(selectedDay);
        localStorage.setItem("selectedCity", cityName);

    } catch (error) {

        nowWeather.textContent =
            "NO DATA FOUND!";

        temp.textContent = "";

        dateElement.textContent = "";

        imgNowStatus.src = "";

        cards[0].textContent = "?";
        cards[1].textContent = "?";
        cards[2].textContent = "?";
        cards[3].textContent = "?";

        AllDays.innerHTML = "";

        AllHours.innerHTML =
            "<h1>ERROR INPUT</h1>";

        console.error(error);

    } finally {

        btn.disabled = false;

    }
}

btn.addEventListener("click", () => {

    let searchUser =
        searchInput.value.trim();

    if (searchUser === "") {
        return;
    }

    searchCity(searchUser);

});


daySelect.addEventListener("change", () => {

    selectedDay = daySelect.value;

    hourlyWeather(selectedDay);

});

searchCity("Cairo");




const suggestions = document.querySelector(".suggestions");

let searchTimeout;

async function searchCities(value) {

    if (value.length < 2) {
        suggestions.innerHTML = "";
        suggestions.style.display = "none";
        return;
    }

    try {

        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(value)}&count=100&language=en&format=json`
        );

        const data = await response.json();

        suggestions.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            suggestions.style.display = "none";
            return;
        }

        data.results.forEach(city => {

            const item = document.createElement("div");

            item.classList.add("suggestion");

            item.innerHTML = `
                <strong>${city.name}</strong>
                <span>${city.country || ""}</span>
            `;

            item.addEventListener("click", () => {

                searchInput.value = city.name;

                suggestions.innerHTML = "";
                suggestions.style.display = "none";

                searchCity(city.name);

            });

            suggestions.appendChild(item);

        });

        suggestions.style.display = "block";

    } catch (error) {

        console.error("Error searching cities:", error);

        suggestions.innerHTML = "";
        suggestions.style.display = "none";

    }
}


searchInput.addEventListener("input", () => {

    const value = searchInput.value.trim();

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        searchCities(value);
    }, 300);

});




