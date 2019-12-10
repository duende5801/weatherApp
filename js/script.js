//grab dom elements
//city, low, high, description, date, delete, user-input, add
let city = document.getElementById('city');
let low = document.getElementById('low');
let high = document.getElementById('high');
let description = document.getElementById('description');
let date = document.getElementById('date');
let del = document.getElementById('delete');
let add = document.getElementById('add');
let user_input = document.getElementById('user-input');

let myArr = [];

let counter =0;
//---------Load Your JSON Weather File--------//

function loadWeather(URL) {
    let xmlhttp = new XMLHttpRequest();
    //Put your weather API URL and KEY here
    //let url = "";

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let cityWeather = JSON.parse(this.responseText);
            myArr.push(cityWeather);
            getWeather(myArr.indexOf(cityWeather));
        }
    };
    xmlhttp.open("GET", URL, true);
    xmlhttp.send();
}

function getWeather(currentCity) {
    console.log(myArr[currentCity]);
        //Dom elements to update and change
        city.innerText = myArr[currentCity].name
        low.innerText = myArr[currentCity].main.temp_min + '°';
        high.innerText = myArr[currentCity].main.temp_max + '°';
        description.innerText = myArr[currentCity].weather[0].description;
        //date.innerText = today;    
}

add.addEventListener('click', function (e) {
    //building a url
    //urls Concatenate
    let url_pt1 = "http://api.openweathermap.org/data/2.5/weather?q=";
    let url_city_pt2 = user_input.value;
    let url_imperial = "&units=imperial"
    let url_key_pt3 = "&APPID=0e1ec07efa4a5a082c2cf3d4f8ff7764";
    let fullURL = url_pt1 + url_city_pt2 + url_imperial + url_key_pt3;

    loadWeather(fullURL);

});

/* async function getWeather() {
    const response = await fetch(api_url_f);
    const data = await response.json();
    let today = new Date().toLocaleDateString()

    //Dom elements to update and change
    city.innerText = data.name
    low.innerText = data.main.temp_min + '°';
    high.innerText = data.main.temp_max + '°';
    description.innerText = data.weather[0].description;
    date.innerText = today;

    //console logs below are all data that needs to be pulled
    console.log(data);
    console.log(data.name);
    console.log(data.main.temp_max);
    console.log(data.main.temp_min);
    console.log(data.weather[0].description);
    console.log(today)
} */

