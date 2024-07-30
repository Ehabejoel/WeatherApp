document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.querySelector("#search-btn");
    const cityInput = document.querySelector("#search-input");
    const apiKey = "148160293d94b4d17eaae02d06cf0e9e";

    searchButton.addEventListener("click", async event => {
        event.preventDefault();

        const city = cityInput.value.trim();

        if (city) {
            try {
                console.log(`Fetching weather data for ${city}...`);
                const weatherData = await getWeatherData(city);
                const forecastData = await getForecastData(city);
                console.log(weatherData, forecastData);
                displayWeatherInfo(weatherData);
                displayForecastInfo(forecastData);
            } catch (error) {
                console.error(error);
                displayError(error.message);
            }
        } else {
            displayError("Please enter a city");
        }
    });

    async function getWeatherData(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Could not fetch weather data");
        }

        return await response.json();
    }

    async function getForecastData(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Could not fetch forecast data");
        }

        return await response.json();
    }

    function displayWeatherInfo(data) {
        const { name: city, main: { temp, humidity, feels_like }, weather: [{ description, id }], wind: { speed: windSpeed } } = data;

        const tempCelsius = (temp - 273.15).toFixed(1);
        const feelsLikeCelsius = (feels_like - 273.15).toFixed(1);

        document.getElementById("city-name").textContent = city;
        document.getElementById("temperature").textContent = `${tempCelsius}°C`;
        document.getElementById("weather-condition").textContent = description;
        document.getElementById("feels-like").textContent = feelsLikeCelsius;
        document.getElementById("humidity").textContent = humidity;
        document.getElementById("wind-speed").textContent = windSpeed;

        document.getElementById("weather-icon").src = getWeatherIcon(id);
    }

    function displayForecastInfo(data) {
        const days = data.list.filter((item, index) => index % 8 === 0).slice(0, 5); // Get forecast for the next 5 days
        
        days.forEach((day, index) => {
            const dayElement = document.getElementById(`day${index + 1}`);
            const date = new Date(day.dt * 1000);
            const options = { weekday: 'long' };
            const dayName = new Intl.DateTimeFormat('en-US', options).format(date);
            const tempMin = (day.main.temp_min - 273.15).toFixed(1);
            const tempMax = (day.main.temp_max - 273.15).toFixed(1);
            const description = day.weather[0].description;
            const iconCode = day.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            dayElement.innerHTML = `
                <p>${dayName}</p>
                <img src="${iconUrl}" alt="${description}">
                <p>${tempMax}° - ${tempMin}°</p>
                <p>${description}</p>
            `;
        });
    }

    function getWeatherIcon(weatherId) {
        if (weatherId >= 200 && weatherId < 300) return "thunderstorm.png";
        if (weatherId >= 300 && weatherId < 500) return "drizzle.png";
        if (weatherId >= 500 && weatherId < 600) return "rain.png";
        if (weatherId >= 600 && weatherId < 700) return "snow.png";
        if (weatherId >= 700 && weatherId < 800) return "atmosphere.png";
        if (weatherId === 800) return "clear.png";
        if (weatherId >= 801 && weatherId < 900) return "clouds.png";
        return "unknown.png";
    }

    function displayError(message) {
        console.error(message);
        document.getElementById("city-name").textContent = "Error";
        document.getElementById("temperature").textContent = "";
        document.getElementById("weather-condition").textContent = message;
        document.getElementById("feels-like").textContent = "";
        document.getElementById("humidity").textContent = "";
        document.getElementById("wind-speed").textContent = "";
        document.getElementById("weather-icon").src = "";
    }
});
