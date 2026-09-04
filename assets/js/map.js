import { getCityCoordinates, getMapWeather } from "./data.js";

let iFrame = document.createElement("iframe");
iFrame.classList.add("gmap_iframe");

let searchInput = document.querySelector(".search-input");
let btn = document.querySelector(".btn");
let mapContainer = document.querySelector(".gmap_canvas");

mapContainer.append(iFrame);

iFrame.src = `https://www.google.com/maps?q=Cairo&z=15&t=m&hl=en&output=embed`;
iFrame.frameborder = "0";
iFrame.scrolling = "no";

let mapCity = document.querySelector(".map-city");
let mapCountry = document.querySelector(".map-country");
let mapLocalTime = document.querySelector(".map-local-time");
let mapLatitude = document.querySelector(".map-latitude");
let mapLongitude = document.querySelector(".map-longitude");
let mapSunrise = document.querySelector(".map-sunrise");
let mapSunset = document.querySelector(".map-sunset");
let mapCloud = document.querySelector(".map-cloud");
let mapVisibility = document.querySelector(".map-visibility");

let clockInterval;

function formatTime(time) {
    return time.split("T")[1].slice(0, 5);
}

async function searchMap(cityName) {
    try {
        let city = await getCityCoordinates(cityName);

        let weather = await getMapWeather(
            city.latitude,
            city.longitude
        );

        iFrame.src =
            `https://www.google.com/maps?q=${encodeURIComponent(city.name)}` +
            `&z=15&t=m&hl=en&output=embed`;

        mapCity.textContent = city.name;
        mapCountry.textContent = city.country || "";

        let timezone = weather.timezone;

        function updateLocalTime() {
            let now = new Date();

            let time = new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }).format(now);

            mapLocalTime.textContent = time;
        }

        clearInterval(clockInterval);

        updateLocalTime();

        clockInterval = setInterval(updateLocalTime, 1000);

        mapLatitude.textContent =
            `${Number(city.latitude).toFixed(2)}°`;

        mapLongitude.textContent =
            `${Number(city.longitude).toFixed(2)}°`;

        mapSunrise.textContent =
            formatTime(weather.daily.sunrise[0]);

        mapSunset.textContent =
            formatTime(weather.daily.sunset[0]);

        mapCloud.textContent =
            `${weather.current.cloud_cover}%`;

        mapVisibility.textContent =
            `${(weather.current.visibility / 1000).toFixed(1)} km`;

    } catch (error) {
        console.error("Map Error:", error);
    }
}

btn.addEventListener("click", () => {
    let search_user = searchInput.value.trim();

    if (search_user === "") return;

    searchMap(search_user);
});

searchMap("Cairo");