//---------------grab dom elements--------------------//

//city, current-temp, low, high, description, date, delete, user-input, add
let city = document.getElementById('city');
let curTemp = document.getElementById('current-temp');
let low = document.getElementById('low');
let high = document.getElementById('high');
let description = document.getElementById('description');
let date = document.getElementById('date');
let del = document.getElementById('delete');
let add = document.getElementById('add');
let user_input = document.getElementById('user-input');
let wIcon = document.getElementById('wIcon');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let today = new Date().toLocaleDateString()

//--------------global variables-------------------//
let cityWeather = [];
let cityForcast = [];
let counter = 0;

//-------------on load---------------------------//
if(localStorage.getItem('savedCities')){
    cityWeather = JSON.parse(localStorage.getItem('savedCities'))
}

//------------------------------Load Your JSON Weather File--------------------------//
function loadWeather(URL) {
    let xmlhttp = new XMLHttpRequest();
    //Put your weather API URL and KEY here
    //let url = "";
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let myArr = JSON.parse(this.responseText);
            cityWeather.push(myArr);
            getWeather(cityWeather.indexOf(myArr));
        }
    };
    xmlhttp.open("GET", URL, true);
    xmlhttp.send();
}
function loadForecast(URL) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let myArr = JSON.parse(this.responseText);
            cityForcast.push(myArr);
            getForcast(cityForcast.indexOf(myArr));
        }
    };
    xmlhttp.open("GET", URL, true);
    xmlhttp.send();
}

//-----------------Add event listeners-------------------//
add.addEventListener('click', buildURL)

user_input.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        buildURL();
    }
});
del.addEventListener('click', function (e) {
    cityWeather.splice(cityWeather.indexOf(counter), 1);
    saveData();
    if(cityWeather.length>0){
        prevCity();
    }
    else{
        city.innerText = '';
        curTemp.innerText = '';
        low.innerText = '';
        high.innerText = '';
        description.innerText = '';
        wIcon.setAttribute('src', '');
        date.innerText = '';
    }
});
next.addEventListener('click', nextCity)
prev.addEventListener('click', prevCity)


//----------------------------------------REPETITVE FUNCTIONS-----------------------------------------------//

function buildURL(){
    let url_pt1 = "http://api.openweathermap.org/data/2.5/weather?q=";
    let url_city_pt2 = user_input.value;
    let url_imperial = "&units=imperial";
    let url_key_pt3 = "&APPID=0e1ec07efa4a5a082c2cf3d4f8ff7764";
    let api_url = url_pt1 + url_city_pt2 + url_imperial + url_key_pt3;
    loadWeather(api_url);
    let for_pt1 = "http://api.openweathermap.org/data/2.5/forecast?q=";
    let for_city_pt2 = user_input.value;
    let for_imperial = "&units=imperial";
    let for_key_pt3 = "&APPID=0e1ec07efa4a5a082c2cf3d4f8ff7764";
    let for_url = for_pt1+for_city_pt2+for_imperial+for_key_pt3;
    loadWeather(for_url);
    user_input.value =''
}
//-----------PARSEing out the respective city's info for front end/DOM manipulation--------------//
function getWeather(currentCity) {
    console.log(cityWeather[currentCity]);
    //Dom elements to update and change
    city.innerText = cityWeather[currentCity].name;
    curTemp.innerText = cityWeather[currentCity].main.temp;
    low.innerText = 'low ' + cityWeather[currentCity].main.temp_min + '°';
    high.innerText = 'high ' + cityWeather[currentCity].main.temp_max + '°';
    description.innerText = cityWeather[currentCity].weather[0].description;
    wIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + cityWeather[currentCity].weather[0].icon + '@2x.png');
    date.innerText = today;
    counter = currentCity;
    saveData();
}
function getForcast(currentCity) {
    console.log(cityWeather[currentCity]);
    //Dom elements to update and change
    low.innerText = 'low ' + cityForcast[currentCity].list[0].main.temp_min + '°';
    high.innerText = 'high ' + cityForcast[currentCity].list[0].main.temp_max + '°';
    wIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + cityForcast[currentCity].list[0].weather[0].icon + '@2x.png');
    counter = currentCity;
    saveData();
}
function saveData(){
    localStorage.setItem('savedCities', JSON.stringify(cityWeather));
}
function prevCity(){
    if (cityWeather.length > 0) {
        if (counter > 0) counter--;
        else counter = cityWeather.length - 1;
        getWeather(counter);
    }
}
function nextCity(){
    if (cityWeather.length > 0) {
        if (counter < cityWeather.length - 1) counter++;
        else counter = 0;
        getWeather(counter);
    }
}


//----------THIS FUNCTION DOES THE REQEST/SEND AND DOM MANIPULATION ALL IN ONE
//----------THIS FUNCTION WORKS REALLY WELL WITH ONE SINGLE API URL
//----------WOULD BE USEFUL IF IN THE APP, WE USED GEOLOCATER AND
//----------GRABBED USER'S CURRENT LOCATION. ONCE MORE URL'S ARE INTRODUCED
//----------SOMETHING GETS SCREWED UP. UNLESS I JUST DID SOMETHING WRONG AND
//----------GAVE UP TOO QUICK.

/* async function getWeather() {
    const response = await fetch(api_url);
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

