const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";

export async function getCityCoordinates(city) {

    const response = await fetch(
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    if (!response.ok) {
        throw new Error("Failed to find city");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }
    return data.results[0];
}


export async function getWeather(latitude, longitude) {

    const response = await fetch(
        `${WEATHER_API}?` +
        `latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=` +
        `temperature_2m,` +
        `relative_humidity_2m,` +
        `apparent_temperature,` +
        `precipitation,` +
        `weather_code,` +
        `wind_speed_10m` +
        `&hourly=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&past_hours=7` +
        `&forecast_days=7` +
        `&timezone=auto`
    );

    if (!response.ok) {
        throw new Error("Failed to get weather data");
    }

    return await response.json();
}

function getCondition(code) {

    if (code === 0) {
        return "Sunny";
    }

    if (code === 1 || code === 2) {
        return "Partly Cloudy";
    }

    if (code === 3) {
        return "Cloudy";
    }

    if ([45, 48].includes(code)) {
        return "Fog";
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return "Drizzle";
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return "Rainy";
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return "Snow";
    }

    if ([95, 96, 99].includes(code)) {
        return "Storm";
    }

    return "Sunny";
}

function formatHour(time) {

    const hourNumber = Number(
        time.split("T")[1].split(":")[0]
    );

    const period = hourNumber >= 12 ? "PM" : "AM";

    const hour =
        hourNumber % 12 || 12;

    return `${hour}:00 ${period}`;
}

function getHourlyForDay(weather, dayDate) {

    const currentTime = weather.current.time;
    const currentDate = currentTime.split("T")[0];

    const hourlyData = weather.hourly.time.map((time, index) => {

        const hour =
            Number(
                time.split("T")[1].split(":")[0]
            );

        const code =
            weather.hourly.weather_code[index];

        return {
            date: time.split("T")[0],
            time: formatHour(time),
            temperature:
                Math.round(
                    weather.hourly.temperature_2m[index]
                ),
            condition: getCondition(code),
            isNight: hour < 6 || hour >= 18,
            fullTime: time
        };
    });

    if (dayDate === currentDate) {

        const startIndex =
            hourlyData.findIndex(
                (item) => item.fullTime > currentTime
            );

        return hourlyData
            .slice(startIndex, startIndex + 8)
            .map(({ fullTime, ...item }) => item);
    }

    return hourlyData
        .filter((item) => item.date === dayDate)
        .slice(0, 8)
        .map(({ fullTime, ...item }) => item);
}


export function formatWeatherData(cityData, weather) {

    const forecast =
        weather.daily.time.map((date, index) => {

            const dayName =
                new Date(`${date}T12:00:00`)
                    .toLocaleDateString(
                        "en-US",
                        {
                            weekday: "long"
                        }
                    );
                    

            return {

                date: date,

                day: dayName,

                minTemperature:
                    Math.round(
                        weather.daily
                            .temperature_2m_min[index]
                    ),

                maxTemperature:
                    Math.round(
                        weather.daily
                            .temperature_2m_max[index]
                    ),

                condition:
                    getCondition(
                        weather.daily
                            .weather_code[index]
                    ),

                hourly:
                    getHourlyForDay(
                        weather,
                        date
                    )
                    
            };

        });


    return {

        city: cityData.name,
        isNight:
        Number(weather.current.time.split("T")[1].split(":")[0]) < 6 ||
        Number(weather.current.time.split("T")[1].split(":")[0]) >= 18,

        country: cityData.country,

        temperature:
            Math.round(
                weather.current.temperature_2m
            ),

        condition:
            getCondition(
                weather.current.weather_code
            ),

        feelsLike:
            Math.round(
                weather.current.apparent_temperature
            ),

        humidity:
            weather.current.relative_humidity_2m,

        windSpeed:
            Math.round(
                weather.current.wind_speed_10m
            ),

        precipitation:
            weather.current.precipitation,

        forecast

    };
}


export async function getWeatherForCity(cityName) {

    const city =
        await getCityCoordinates(cityName);

    const weather =
        await getWeather(
            city.latitude,
            city.longitude
        );

    return formatWeatherData(
        city,
        weather
    );
}

export async function getMapWeather(latitude, longitude) {
    const response = await fetch(
        `${WEATHER_API}?` +
        `latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=cloud_cover,visibility` +
        `&daily=sunrise,sunset` +
        `&timezone=auto`
    );

    if (!response.ok) {
        throw new Error("Failed to get map weather data");
    }

    return await response.json();
}

export async function getForecastData(latitude, longitude) {

    const response = await fetch(
        `${WEATHER_API}?` +
        `latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&daily=` +
        `weather_code,` +
        `temperature_2m_max,` +
        `temperature_2m_min,` +
        `precipitation_probability_max,` +
        `precipitation_sum,` +
        `sunrise,` +
        `sunset,` +
        `wind_speed_10m_max,` +
        `wind_direction_10m_dominant,` +
        `cloud_cover_mean` +
        `&forecast_days=7` +
        `&timezone=auto`
    );

    if (!response.ok) {
        throw new Error("Failed to get forecast data");
    }

    return await response.json();
}