import { getCityCoordinates, getForecastData } from "./data.js";

let forecastData = null;

let cityElement = document.querySelector(".forecast-city");

let rainValue = document.querySelector(".rain-value");
let rainDay = document.querySelector(".rain-day");

let sunDuration = document.querySelector(".sun-duration");
let sunrise = document.querySelector(".sunrise");
let sunset = document.querySelector(".sunset");

let windValue = document.querySelector(".wind-value");
let windDay = document.querySelector(".wind-day");

let cloudValue = document.querySelector(".cloud-value");
let cloudDay = document.querySelector(".cloud-day");

let hottestDay = document.querySelector(".hottest-day");
let hottestTemp = document.querySelector(".hottest-temp");

let coldestDay = document.querySelector(".coldest-day");
let coldestTemp = document.querySelector(".coldest-temp");

let wettestDay = document.querySelector(".wettest-day");
let wettestValue = document.querySelector(".wettest-value");

let forecastDays = document.querySelector(".forecast-days");
let chart = document.querySelector(".chart-placeholder");


function formatTime(time) {
    return time.split("T")[1].slice(0, 5);
}


function getDayName(date) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "short"
    });
}


function getFullDayName(date) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "long"
    });
}


function calculateDaylight(sunriseTime, sunsetTime) {

    let sunriseDate = new Date(sunriseTime);
    let sunsetDate = new Date(sunsetTime);

    let difference = sunsetDate - sunriseDate;

    let hours = Math.floor(difference / 3600000);
    let minutes = Math.floor(
        (difference % 3600000) / 60000
    );

    return `${hours}h ${minutes}m`;
}


function getWeatherIcon(code) {

    if (code === 0) {
        return "fa-sun";
    }

    if (code <= 3) {
        return "fa-cloud-sun";
    }

    if (code <= 48) {
        return "fa-smog";
    }

    if (code <= 67) {
        return "fa-cloud-rain";
    }

    if (code <= 77) {
        return "fa-snowflake";
    }

    if (code <= 82) {
        return "fa-cloud-showers-heavy";
    }

    return "fa-cloud-bolt";
}


function updateSummary() {

    let daily = forecastData.daily;

    let maxTemps = daily.temperature_2m_max;
    let minTemps = daily.temperature_2m_min;

    let rainProbabilities =
        daily.precipitation_probability_max;

    let windSpeeds =
        daily.wind_speed_10m_max;

    let cloudCovers =
        daily.cloud_cover_mean;


    let hottestIndex = maxTemps.indexOf(
        Math.max(...maxTemps)
    );

    let coldestIndex = minTemps.indexOf(
        Math.min(...minTemps)
    );

    let wettestIndex = rainProbabilities.indexOf(
        Math.max(...rainProbabilities)
    );

    let strongestWindIndex = windSpeeds.indexOf(
        Math.max(...windSpeeds)
    );

    let cloudiestIndex = cloudCovers.indexOf(
        Math.max(...cloudCovers)
    );


    hottestDay.textContent =
        getFullDayName(daily.time[hottestIndex]);

    hottestTemp.textContent =
        `${Math.round(maxTemps[hottestIndex])}°`;


    coldestDay.textContent =
        getFullDayName(daily.time[coldestIndex]);

    coldestTemp.textContent =
        `${Math.round(minTemps[coldestIndex])}°`;


    wettestDay.textContent =
        getFullDayName(daily.time[wettestIndex]);

    wettestValue.textContent =
        `${rainProbabilities[wettestIndex]}%`;


    rainValue.textContent =
        `${rainProbabilities[wettestIndex]}%`;

    rainDay.textContent =
        getFullDayName(daily.time[wettestIndex]);


    windValue.textContent =
        `${Math.round(windSpeeds[strongestWindIndex])} km/h`;

    windDay.textContent =
        getFullDayName(daily.time[strongestWindIndex]);


    cloudValue.textContent =
        `${Math.round(cloudCovers[cloudiestIndex])}%`;

    cloudDay.textContent =
        getFullDayName(daily.time[cloudiestIndex]);


    sunrise.textContent =
        formatTime(daily.sunrise[0]);

    sunset.textContent =
        formatTime(daily.sunset[0]);

    sunDuration.textContent =
        calculateDaylight(
            daily.sunrise[0],
            daily.sunset[0]
        );
}


function createDailyCards() {

    forecastDays.innerHTML = "";

    let daily = forecastData.daily;

    daily.time.forEach((date, index) => {

        let card = document.createElement("div");

        card.classList.add("day-card");

        card.innerHTML = `
            <div class="day-name">
                ${getDayName(date)}
            </div>

            <i class="fa-solid ${getWeatherIcon(
                daily.weather_code[index]
            )}"></i>

            <div class="day-temp">
                ${Math.round(
                    daily.temperature_2m_max[index]
                )}°
            </div>

            <div class="day-min">
                ${Math.round(
                    daily.temperature_2m_min[index]
                )}°
            </div>

            <div class="rain">
                <i class="fa-solid fa-droplet"></i>
                ${daily.precipitation_probability_max[index]}%
            </div>
        `;

        forecastDays.appendChild(card);
    });
}


function createTemperatureTrend() {

    let daily = forecastData.daily;
    let temperatures = daily.temperature_2m_max;

    let min = Math.min(...temperatures);
    let max = Math.max(...temperatures);
    let range = max - min || 1;

    chart.innerHTML = "";

    let width = 1000;
    let height = 180;
    let padding = 40;

    let points = temperatures.map((temperature, index) => {

        let x =
            padding +
            (index / (temperatures.length - 1)) *
            (width - padding * 2);

        let y =
            height -
            padding -
            ((temperature - min) / range) *
            (height - padding * 2);

        return {
            x,
            y,
            temperature,
            day: getDayName(daily.time[index])
        };
    });


    let svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");


    let area = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );

    let areaPoints = [
        ...points.map(point => `${point.x},${point.y}`),
        `${points[points.length - 1].x},${height - padding}`,
        `${points[0].x},${height - padding}`
    ];

    area.setAttribute(
        "points",
        areaPoints.join(" ")
    );

    area.setAttribute(
        "fill",
        "rgba(230, 150, 70, 0.16)"
    );

    svg.appendChild(area);


    let line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
    );

    line.setAttribute(
        "points",
        points.map(point => `${point.x},${point.y}`).join(" ")
    );

    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "#8fc9df");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");

    svg.appendChild(line);


    points.forEach(point => {

        let circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", "5");
        circle.setAttribute("fill", "#e6c98a");

        svg.appendChild(circle);


        let tempText = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        tempText.setAttribute("x", point.x);
        tempText.setAttribute("y", point.y - 14);
        tempText.setAttribute("text-anchor", "middle");
        tempText.textContent =
            `${Math.round(point.temperature)}°`;

        tempText.classList.add("chart-temperature");

        svg.appendChild(tempText);


        let dayText = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        dayText.setAttribute("x", point.x);
        dayText.setAttribute("y", height - 5);
        dayText.setAttribute("text-anchor", "middle");
        dayText.textContent = point.day;

        dayText.classList.add("chart-day");

        svg.appendChild(dayText);
    });


    chart.appendChild(svg);
}

async function loadForecast(cityName) {

    try {

        let city =
            await getCityCoordinates(cityName);

        forecastData =
            await getForecastData(
                city.latitude,
                city.longitude
            );

        cityElement.textContent =
            `${city.name}, ${city.country}`;

        updateSummary();

        createDailyCards();

        createTemperatureTrend();

    } catch (error) {

        console.error(
            "Forecast Error:",
            error
        );
    }
}
let selectedCity =
    localStorage.getItem("selectedCity") || "Cairo";

loadForecast(selectedCity);

