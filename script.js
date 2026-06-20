let key = `bd4ea33ecf905116d12af172e008dbae`;

const weatherBackgrounds = {
    // Clear
    'clear sky': 
{
    day: 'backgrounds/clear-day.mp4',
    night: 'backgrounds/clear-night.mp4'
},
    // Clouds
    'few clouds': 'backgrounds/few-cloudy.mp4',
    'scattered clouds': 'backgrounds/scattered-clouds.mp4',
    'broken clouds': 'backgrounds/broken-clouds.mp4',
    'overcast clouds': 'backgrounds/overcast.mp4',
    // Rain
    'light rain': 'backgrounds/light-rain.mp4',
    'heavy rain': 'backgrounds/heavy-rain.mp4',
    'shower rain': 'backgrounds/shower-rain.mp4',
    // Snow
    'light snow': 'backgrounds/light-snow.mp4',
    'heavy snow': 'backgrounds/heavy-snow.mp4',
    // Atmosphere
    'mist': 'backgrounds/mist.jpg',
    'fog': 'backgrounds/fog.jpg',
    'thunderstorm': 'backgrounds/thunderstorm.mp4',
    'haze': 'backgrounds/haze.mp4'
};

function setWeatherBackground(weatherDescription, isDay) 
{
    const body = document.body;
    const existingVideo = document.querySelector('.weather-background-video');
    if (existingVideo) 
        {
        existingVideo.remove();
    }
    let background = weatherBackgrounds[weatherDescription.toLowerCase()];
    if (background && background.day && background.night) 
        {
        background = isDay ? background.day : background.night;
    }
    if (!background) 
        {
        background = 'backgrounds/default.jpg';
    }
    if (background.endsWith('.mp4')) 
        {
        const video = document.createElement('video');
        video.className = 'weather-background-video';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.cssText = `
            position: fixed;
            right: 0;
            bottom: 0;
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            z-index: -1;
            object-fit: cover;
        `;
        video.src = background;
        document.body.insertBefore(video, document.body.firstChild);
    } 
    else 
    {
        body.style.backgroundImage = `url('${background}')`;
    }
}

async function getWeather() 
{
    let city = document.getElementById("city").value;
    let country = document.getElementById("country").value;
    let weatherInfo = document.querySelector(".weather-info");

    if (city === "" || country === "") {
        alert("Please enter both city and country!");
        return;
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&lang=en&units=metric&appid=${key}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        if (data.cod === 200) {
            document.getElementById("location").innerText = `📍 ${data.name}, ${data.sys.country}`;
            document.getElementById("temperature").innerHTML = `🌡 Temperature: <b>${data.main.temp}°C</b>`;
            document.getElementById("weatherDescription").innerHTML = `⛅ ${data.weather[0].description}`;
            document.getElementById("feelsLike").innerHTML = `🔥 Feels Like: <b>${data.main.feels_like}°C</b>`;
            document.getElementById("humidity").innerHTML = `💧 Humidity: <b>${data.main.humidity}%</b>`;
            weatherInfo.style.display = "block";
            const isDay = data.dt > data.sys.sunrise && data.dt < data.sys.sunset;
            setWeatherBackground(data.weather[0].description, isDay);
        } 
        else 
        {
            alert("City not found. Please try again.");
        }
    } 
    catch (error) 
    {
        console.error("Error fetching weather data:", error);
    }
}