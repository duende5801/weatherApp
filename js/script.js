let url_pt1 = "http://api.openweathermap.org/data/2.5/weather?q=";
let url_city_pt2 = "Stockton,CA,us";
let url_key_pt3 = "&APPID=0e1ec07efa4a5a082c2cf3d4f8ff7764";
let url_imperial = "&units=imperial"
let url_metric = "&units=metric"

const api_url_f = url_pt1+url_city_pt2+url_imperial+url_key_pt3;
const api_url_c = url_pt1+url_city_pt2+url_metric+url_key_pt3;

//grab dom elements
//city, low, high, description, date, button
let city = document.getElementById('city');
let low = document.getElementById('low');
let high = document.getElementById('high');
let description = document.getElementById('description');
let date = document.getElementById('date');

async function getWeather(){
    const response = await fetch(api_url_f);
    const data = await response.json();
    let today = new Date().toLocaleDateString()
    console.log(data);
    console.log(data.name);
    console.log(data.main.temp_max);
    console.log(data.main.temp_min);
    console.log(data.weather[0].description);
    console.log(today)
}

getWeather();

