//--------------global variables-------------------//
let cityWeather = [];
let cityForcast = [];
let geoCurrent =[];
let geoFor =[];
let counter = 0;
let check;
let user;
let dup = true;

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
let day1temp = document.getElementById('day1temp');
let day2temp = document.getElementById('day2temp');
let day3temp = document.getElementById('day3temp');
let day4temp = document.getElementById('day4temp');
let day5temp = document.getElementById('day5temp');
let day1icon = document.getElementById('day1icon');
let day2icon = document.getElementById('day2icon');
let day3icon = document.getElementById('day3icon');
let day4icon = document.getElementById('day4icon');
let day5icon = document.getElementById('day5icon');
let date1 = document.getElementById('date1');
let date2 = document.getElementById('date2');
let date3 = document.getElementById('date3');
let date4 = document.getElementById('date4');
let date5 = document.getElementById('date5');
let today = new Date().toLocaleDateString()

//-------------on load---------------------------//
if (localStorage.getItem('savedCities')) {
    cityWeather = JSON.parse(localStorage.getItem('savedCities'));
    cityForcast = JSON.parse(localStorage.getItem('savedForcast'));
}
navigator.geolocation.getCurrentPosition(success, error);
function success(pos){
    console.log(pos.coords.longitude + ' ' + pos.coords.latitude)
    let lat = pos.coords.latitude;
    let long = pos.coords.longitude;
    let posURL = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+'&lon='+long+"&units=imperial"+"&APPID=0e1ec07efa4a5a082c2cf3d4f8ff7764";
    let forposURL = "http://api.openweathermap.org/data/2.5/forecast?lat="+lat+'&lon='+long+"&units=imperial"+"&APPID=0e1ec07efa4a5a082c2cf3d4f8ff7764";
    loadWeather(posURL);
    loadForecast(forposURL);
}
function error(){
    alert('can\'t find current location');
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
function loadGeolocationcurrent(URL) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let myArr = JSON.parse(this.responseText);
            geoCurrent.push(myArr);
            findDup(getForcast(geoCurrent.indexOf(myArr)));
        }
    };
    xmlhttp.open("GET", URL, true);
    xmlhttp.send();
}
function loadGeolocationcurrentForecast(URL) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let myArr = JSON.parse(this.responseText);
            geoFor.push(myArr);
            findDup(getForcast(geoFor.indexOf(myArr)));
        }
    };
    xmlhttp.open("GET", URL, true);
    xmlhttp.send();
}

//-----------------Add event listeners-------------------//
add.addEventListener('click', findDup);
user_input.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        findDup();
    }
});
del.addEventListener('click', function (e) {
    cityWeather.splice(cityWeather.indexOf(counter), 1);
    cityForcast.splice(cityForcast.indexOf(counter), 1);
    saveData();
    if (cityWeather.length > 0) {
        prevCity();
    }
    else {
        city.innerText = '';
        curTemp.innerText = '';
        low.innerText = '';
        high.innerText = '';
        description.innerText = '';
        wIcon.setAttribute('src', '');
        date.innerText = '';
        day1temp.innerText = '';
        day1icon.setAttribute('src', './images/CarterSun.png');
        day2temp.innerText = '';
        day2icon.setAttribute('src', './images/CarterSun.png');
        day3temp.innerText = '';
        day3icon.setAttribute('src', './images/CarterSun.png');
        day4temp.innerText = '';
        day4icon.setAttribute('src', './images/CarterSun.png');
        day5temp.innerText = '';
        day5icon.setAttribute('src', './images/CarterSun.png');
        date1.innerText = '';
        date2.innerText = '';
        date3.innerText = '';
        date4.innerText = '';
        date5.innerText = '';
    }
});
next.addEventListener('click', nextCity)
prev.addEventListener('click', prevCity)


//----------------------------------------REPETITVE FUNCTIONS-----------------------------------------------//

function buildURL() {
    let url_pt1 = "http://api.openweathermap.org/data/2.5/weather?q=";
    //let url_pt_loc = 
    let url_city_pt2 = user_input.value;
    let url_imperial = "&units=imperial";
    let url_key_pt3 = "&APPID=0e1ec07efa4a5a082c2cf3d4f8ff7764";
    let api_url = url_pt1 + url_city_pt2 + url_imperial + url_key_pt3;
    loadWeather(api_url);
    let for_pt1 = "http://api.openweathermap.org/data/2.5/forecast?q=";
    let for_url = for_pt1 +url_city_pt2 + url_imperial + url_key_pt3;
    loadForecast(for_url);
    user_input.value = ''
}
//-----------PARSEing out the respective city's info for front end/DOM manipulation--------------//
function getWeather(currentCity) {
    console.log(cityWeather[currentCity]);
    //Dom elements to update and change
    city.innerText = cityWeather[currentCity].name;
    curTemp.innerText = Math.round(cityWeather[currentCity].main.temp) + '°F';
    low.innerText = 'low ' + Math.round(cityWeather[currentCity].main.temp_min) + '°F';
    high.innerText = 'high ' + Math.round(cityWeather[currentCity].main.temp_max) + '°F';
    description.innerText = cityWeather[currentCity].weather[0].description;
    wIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + cityWeather[currentCity].weather[0].icon + '@2x.png');
    date.innerText = today;
    counter = currentCity;
    saveData();
}
function getForcast(currentCity) {
    console.log(cityForcast[currentCity]);
    //Dom elements to update and change
    date1.innerText = cityForcast[currentCity].list[0].dt_txt[5]+cityForcast[currentCity].list[0].dt_txt[6]+'/'+cityForcast[currentCity].list[0].dt_txt[8]+cityForcast[currentCity].list[0].dt_txt[9];
    date2.innerText = cityForcast[currentCity].list[7].dt_txt[5]+cityForcast[currentCity].list[7].dt_txt[6]+'/'+cityForcast[currentCity].list[7].dt_txt[8]+cityForcast[currentCity].list[7].dt_txt[9];
    date3.innerText = cityForcast[currentCity].list[15].dt_txt[5]+cityForcast[currentCity].list[15].dt_txt[6]+'/'+cityForcast[currentCity].list[15].dt_txt[8]+cityForcast[currentCity].list[15].dt_txt[9];
    date4.innerText = cityForcast[currentCity].list[23].dt_txt[5]+cityForcast[currentCity].list[23].dt_txt[6]+'/'+cityForcast[currentCity].list[23].dt_txt[8]+cityForcast[currentCity].list[23].dt_txt[9];
    date5.innerText = cityForcast[currentCity].list[31].dt_txt[5]+cityForcast[currentCity].list[31].dt_txt[6]+'/'+cityForcast[currentCity].list[31].dt_txt[8]+cityForcast[currentCity].list[31].dt_txt[9];
    day1temp.innerText = Math.trunc(cityForcast[currentCity].list[0].main.temp_min) + '°F / ' + Math.trunc(cityForcast[currentCity].list[0].main.temp_max) + '°F';
    day1icon.setAttribute('src', 'http://openweathermap.org/img/wn/' + cityForcast[currentCity].list[0].weather[0].icon + '@2x.png');
    day2temp.innerText = Math.trunc(cityForcast[currentCity].list[7].main.temp_min) + '°F / ' + Math.trunc(cityForcast[currentCity].list[7].main.temp_max) + '°F';
    day2icon.setAttribute('src', 'http://openweathermap.org/img/wn/' + cityForcast[currentCity].list[7].weather[0].icon + '@2x.png');
    day3temp.innerText = Math.round(cityForcast[currentCity].list[15].main.temp_min) + '°F / ' + Math.round(cityForcast[currentCity].list[15].main.temp_max) + '°F';
    day3icon.setAttribute('src', 'http://openweathermap.org/img/wn/' + cityForcast[currentCity].list[15].weather[0].icon + '@2x.png');
    day4temp.innerText = Math.round(cityForcast[currentCity].list[23].main.temp_min) + '°F / ' + Math.round(cityForcast[currentCity].list[23].main.temp_max )+ '°F';
    day4icon.setAttribute('src', 'http://openweathermap.org/img/wn/' + cityForcast[currentCity].list[23].weather[0].icon + '@2x.png');
    day5temp.innerText = Math.round(cityForcast[currentCity].list[31].main.temp_min) + '°F / ' + Math.round(cityForcast[currentCity].list[31].main.temp_max) + '°F';
    day5icon.setAttribute('src', 'http://openweathermap.org/img/wn/' + cityForcast[currentCity].list[31].weather[0].icon + '@2x.png');
    counter = currentCity;
    saveData();
}
function saveData() {
    localStorage.setItem('savedCities', JSON.stringify(cityWeather));
    localStorage.setItem('savedForcast', JSON.stringify(cityForcast));
}
function prevCity() {
    if (cityWeather.length > 0) {
        if (counter > 0) counter--;
        else counter = cityWeather.length - 1;
        getWeather(counter);
        getForcast(counter);
    }
}
function nextCity() {
    if (cityWeather.length > 0) {
        if (counter < cityWeather.length - 1) counter++;
        else counter = 0;
        getWeather(counter);
        getForcast(counter);
    }
}
function findDup() {
    user = user_input.value.toUpperCase();
    if (cityWeather.length > 0) {
        for (let i = 0; i < cityWeather.length; i++) {
            check = cityWeather[i].name.toUpperCase();
            if (dup) {
                if (check === user) {
                    alert("in da list");
                    user_input.value = '';
                    dup = false;
                }
            }
        }
        if (dup) {
            buildURL();
        }
        else {
            dup = true;
        }
    }
    else buildURL();
}

////----------------functions that break the code------------//////
/* function formDate(dayPosition) {
    let fullDate = cityForcast[currentCity].list[dayPosition].dt_txt
    let newDate = "";

    newDate = fullDate[5]+fullDate[6]+ ' / '+ fullDate[8]+fullDate[9];
    return newDate;
}

 */
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

