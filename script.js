const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '9caf0a5d3dmsh84cdf605a43bcb7p1ebd41jsnd1d6bd076b60',
		'X-RapidAPI-Host': 'geocodeapi.p.rapidapi.com'
	}
};
let isDark = false
function DarkmodeToggleClick() {
    const search_icon = document.getElementById('search-icon')
    search_icon.classList.toggle('icon-invert-color')
    if(isDark) {
        document.documentElement.style.setProperty('--main-color', '#ffffff');
        document.documentElement.style.setProperty('--second-color', '#eef0f2');
        document.documentElement.style.setProperty('--text-color', '#000000');
        isDark = false
        return
    }
    document.documentElement.style.setProperty('--main-color', '#01497c');
    document.documentElement.style.setProperty('--second-color', '#003566');
    document.documentElement.style.setProperty('--text-color', '#ffffff');
    isDark = true
}
function TodayClick() {
    const current = document.getElementById('current')
    current.classList.remove('hidden')
    const nearby = document.getElementById('nearby')
    nearby.classList.remove('hidden')
    const five_day = document.getElementById('five-day')
    five_day.classList.add('hidden')
}
function FiveDaysClick() {
    const current = document.getElementById('current')
    current.classList.add('hidden')
    const nearby = document.getElementById('nearby')
    nearby.classList.add('hidden')
    const five_day = document.getElementById('five-day')
    five_day.classList.remove('hidden')
}
function isDay() {
    let day = false
    if (GetCurrentHour() >= 6 && GetCurrentHour() <= 21)
        day = true
    return day
}
function CheckWeatherImage(weather) {
    weatherImage = ''
    switch(weather) {
        case 'Clear': weatherImage = './weather/Clear'; break;
        case 'Clouds': weatherImage =  './weather/Clouds'; break;
        case 'Drizzle': weatherImage = './weather/Drizzle'; break;
        case 'Fog': return './weather/Fog.png';
        case 'Rain': weatherImage = './weather/Rain'; break;
        case 'Snow': weatherImage = './weather/Snow'; break;
        case 'Thunderstorm': weatherImage = './weather/Thunderstorm'; break;
        default: return './weather/Wind.png'
    };
    if(!isDay())
        return weatherImage += "_Night.png"
    return weatherImage += "_Day.png"
}

function GetCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return formattedToday = dd + '.' + mm + '.' + yyyy;
}

function GetCurrentHour() {
    const date = new Date()
    return 19
}

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function GetWeekDayByDate(date) {
    const d = new Date(date);
    return weekday[d.getDay()];
}

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function GetMonthByDate(date) {
    const d = new Date(date);
    return month[d.getMonth()].slice(0, 3).toUpperCase()
}

function GetDayByDate(date) {
    const d = new Date(date);
    return d.getDate()
}

const directions = ["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
function GetDirection(angle) {
	let section = parseInt( angle / 22.5 + 0.5 );
	section = section % 16;
	return directions[section];
}

const appid = '77a086f5b12ff5e805496caae1be5afb'

function CheckDayNight() {
    const date = new Date()
    hour = date.getHours()
    if(hour >= 4 && hour <= 24)
        return "TODAY"
    return "TONIGHT"
}

function getHourFormatFromMilliSeconds(millisec) {
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(Number(seconds) / 60).toString();
    let hours;
    if (Number(minutes) > 59) {
      hours = Math.floor(Number(minutes) / 60);
      hours = (hours >= 10) ? hours : hours;
      minutes = (Number(minutes) - (hours * 60)).toString();
      minutes = (Number(minutes) >= 10) ? minutes : "0" + minutes;
    }
    if (!hours) {
      hours = "00";
    }
    if (!minutes) {
      minutes = "00";
    }
    if (hours.toString.length == 1){
        hours = '0' + hours
    }
    if (minutes.toString.length == 1){
        minutes = '0' + minutes
    }
    return hours + ":" + minutes
}

async function Search(city) {
    const searchInput = document.getElementById('search-input')
    if (city != undefined)
        searchInput.value = city
    await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.value}&limit=5&appid=${appid}`)
    .then(response => response.json())
    .then(json => {
        const current = document.getElementById('current')
        current.classList.remove('hidden')
        const hourly = document.getElementById('hourly')
        hourly.classList.remove('hidden')
        const nav = document.getElementById('nav')
        nav.classList.remove('hidden')
        const nearby = document.getElementById('nearby')
        nearby.classList.remove('hidden')
        const error = document.getElementById('error')
        error.classList.add('hidden')
        const shape = document.getElementById('shape')
        shape.classList.add('hidden')
        lat = json[0].lat
        lon = json[0].lon
        FillNearbyPlacesContainer(json[0].lat, json[0].lon)
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${json[0].lat}&lon=${json[0].lon}&appid=${appid}&units=metric`)
        .then(response => response.json())
        .then(json => {
            sunriceDate = new Date(json.sys.sunrise * 1000)
            sunsetDate = new Date(json.sys.sunset * 1000)
            difference = Math.abs(sunriceDate - sunsetDate);
            const feels_like = document.getElementById('feels-like')
            feels_like.innerHTML = "Real Feel " + Math.round(json.main.feels_like) + '°C'
            const weather_img = document.getElementById('weather-img')
            const main = document.getElementById('main')
            const temp = document.getElementById('temp')
            const sunrise = document.getElementById('sunrise')
            const sunset = document.getElementById('sunset')
            const duration = document.getElementById('duration')
            const date = document.getElementById('date')
            date.innerHTML = GetCurrentDate()
            weather = json.weather[0].main
            description = json.weather[0].description
            main.innerHTML = weather
            temp.innerHTML = Math.round(json.main.temp) + '°C'
            sunrise.innerHTML = sunriceDate.toString().split(' ')[4].slice(0, 5) + " AM"
            sunset.innerHTML = sunsetDate.toString().split(' ')[4].slice(0, 5) + " PM"
            duration.innerHTML = getHourFormatFromMilliSeconds(difference) + " hr"
            weather_img.src = CheckWeatherImage(weather)
            const five_days = document.getElementById('five-day')
            five_days.innerHTML = `
                <div id="current-day" class="day-weather">
                    <p class="important-text">${CheckDayNight()}</p>
                    <p>${GetMonthByDate(new Date())} ${GetDayByDate(new Date())}</p>
                    <div class="img-container">
                        <img src="${CheckWeatherImage(weather)}" alt="">
                    </div>
                    <div>
                        <div class="huge-temperature-container">
                        <p class="huge-temperature">${Math.round(json.main.temp)}°C</p>
                        </div>
                        <p>${description}</p>
                    </div>
                </div>`
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${json.coord.lat}&lon=${json.coord.lon}&appid=${appid}&units=metric`)
            .then(response => response.json())
            .then(json => { 
                FillHourlyContainer(json.list, new Date())
                FiveDayForecast(json)
            })
        })
    }).catch(json => {
        const shape = document.getElementById('shape')
        shape.classList.remove('hidden')
        const current = document.getElementById('current')
        current.classList.add('hidden')
        const nav = document.getElementById('nav')
        nav.classList.add('hidden')
        const nearby = document.getElementById('nearby')
        nearby.classList.add('hidden')
        const hourly = document.getElementById('hourly')
        hourly.classList.add('hidden')
        const five_day = document.getElementById('five-day')
        five_day.classList.add('hidden')
        const error = document.getElementById('error')
        error.classList.remove('hidden')
    })
}

function FillHourlyContainer(list, date) {
    const hourly_container = document.getElementById('hourly-container')
        hourly_container.innerHTML = `
            <td>
                <p>${GetWeekDayByDate(date)}</p>
                <div class="small-img-container">
                    <img src="" alt="">
                </div>
                <p>Forecast</p><hr>
                <p>Temp(°C)</p><hr>
                <p>Real Feel</p><hr>
                <p>Wind(km/h)</p>
            </td>`
        for(let i = 0; i < 6; i++) {
            hourly_container.innerHTML += `
                <td>
                    <p>${list[i].dt_txt.split(' ')[1].slice(0, -3)}</p>
                    <div class="small-img-container">
                        <img src="${CheckWeatherImage(list[i].weather[0].main)}" alt="">
                    </div>
                    <p>${list[i].weather[0].main}</p><hr>
                    <p>${Math.round(list[i].main.temp)}°</p><hr>
                    <p>${Math.round(list[i].main.feels_like)}°</p><hr>
                    <p>${Math.round(list[i].wind.speed)} ${GetDirection(list[i].wind.deg)}</p>
                </td>
            `
            }
}

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}

function GetAverageTemperature(temperatures) {
    let sum = 0
    for (let i = 0; i < temperatures.length; i++) {
        sum += temperatures[i]
    }
    return Math.round(sum / temperatures.length)
}

function TodayElementsCount(json) {
    day = GetDayByDate(new Date())
    let count = 0
    for(let j = 0; j < json.list.length; j++) {
        date = formatDate(new Date())
        if (json.list[j].dt_txt.split(' ')[0] == date) {
            count++
        }
    }
    return count
}

let forecast
let toSkip

function FiveDayForecast(json) {
    const five_days = document.getElementById('five-day')
    toSkip = TodayElementsCount(json)
    list = json.list
    forecast = list
    let count = toSkip
    let temperatures = new Array(8)
    for(let i = 0; i < 4; i++) {
        temperatures = []
        description = list[count].weather[0].description
        weather = list[count].weather[0].main
        date = json.list[count].dt_txt.split(' ')[0]
        let f = 0
        for(let j = count; j < count + 8; j++) {
            temperatures[f] = Math.round(list[j].main.temp)
            f++
        }
        count += 8
        five_days.innerHTML += `
        <div id="${count - 8 - toSkip}" class="day-weather">
            <p class="important-text">${GetWeekDayByDate(date).slice(0, 3).toUpperCase()}</p>
            <p>${GetMonthByDate(date)} ${GetDayByDate(date)}</p>
            <div class="img-container">
                <img src="${CheckWeatherImage(weather)}" alt="">
            </div>
            <div>
                <div class="huge-temperature-container">
                    <p class="huge-temperature">${GetAverageTemperature(temperatures)}°C</p>
                </div>
                <p>${description}</p>
            </div>
        </div>`
    }
}

function GetCity(callback) {
    $.get("https://ipinfo.io", function(response) {
      var city = response.city
      callback(city)
    }, "jsonp")
}

function SetBackgroundGradient(hour) {
    const body = document.getElementById('body')
    if (hour >= 22 || hour < 6) { body.classList.add('night') }
    if (hour >= 6 && hour < 12) { body.classList.add('morning') }
    if (hour >= 12 && hour < 18) { body.classList.add('afternoon') }
    if (hour >= 18 && hour < 22) { body.classList.add('evening') }
}

$('#five-day').on('click','.day-weather',function(evt) {
    let id = this.id
    if(id == "current-day") {
        FillHourlyContainer(forecast, new Date())
    }
    else {
        id = Number(this.id)
        let list = []
        let j = 0
        for(let i = id + toSkip + 2; i < forecast.length; i++) {
            list[j] = forecast[i]
            j++
        }
        FillHourlyContainer(list, list[0].dt_txt.split(' ')[0])
    }
})

SetBackgroundGradient(GetCurrentHour())
GetCity(Search)

function FillNearbyPlacesContainer(lat, lon) {
    fetch(`https://geocodeapi.p.rapidapi.com/GetNearestCities?latitude=${lat}&longitude=${lon}&range=0`, options)
	.then(response => response.json())
	.then(json => {
        nearby_places = document.getElementById('nearby-places')
        nearby_places.innerHTML = ''
        cities = json.slice(1, 5)
        for (const i of cities) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${i.Latitude}&lon=${i.Longitude}&appid=${appid}&units=metric`)
            .then(response => response.json())
            .then(json => { 
                nearby_places.innerHTML += `
                <div>
                    <p>${i.City}</p>
                    <div>
                        <div class="icon-container">
                            <img src="${CheckWeatherImage(json.weather[0].main)}" alt="">
                        </div>
                        <p>${Math.round(json.main.temp)}°C</p>
                    </div>
                </div>
            `
            })
        }   
    })
	.catch(err => console.error(err));
}