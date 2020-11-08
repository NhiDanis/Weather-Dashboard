let searchHistory = [];
// local storage search history
function getItems() {
    let storedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null) {
        searchHistory = storedCities;
    };
     // lists up to 10 cities
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 10) {
            break;
          }
        //  creates list group
        cityList = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        // appends history as a button below the search field
        cityList.text(searchHistory[i]);
        $(".list-group").append(cityList);
    }
    getItems();
};

let city;
let mainBody = $(".card-body");

function getData() {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=984f74b8d7b70ff3b1876877d645e30b"
    mainBody.empty();
    $("#weeklyForecast").empty();

    // requests AJAX
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        let date = moment().format(" MM/DD/YYYY");
        let iconCode = response.weather[0].icon;
        let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        let name = $("<h3>").html(city + date);

        mainBody.prepend(name);
        mainBody.append($("<img>").attr("src", iconURL));

        let temp = Math.round((response.main.temp - 273.15) * 1.80 + 32);
        mainBody.append($("<p>").html("Temperature: " + temp + " &#8457"));
        let humidity = response.main.humidity;
        mainBody.append($("<p>").html("Humidity: " + humidity + " " + "%"));
        let windSpeed = response.wind.speed;
        mainBody.append($("<p>").html("Wind Speed: " + windSpeed + " " + "MPH"));


         //request for UV index
        let lat = response.coord.lat;
        let lon = response.coord.lon;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=984f74b8d7b70ff3b1876877d645e30b&lat=" + lat + "&lon=" + lon,
            method: "GET"

        }).then(function (response) {
            mainBody.append($("<p>").html("UV Index: <span>" + response.value + "</span>"));
            
            if (response.value <= 2) {
                $("span").attr("class", "btn btn-outline-success");
            };
            if (response.value > 2 && response.value <= 5) {
                $("span").attr("class", "btn btn-outline-warning");
            };
            if (response.value > 5) {
                $("span").attr("class", "btn btn-outline-danger");
            };
        })
        //  5-day forecast
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=984f74b8d7b70ff3b1876877d645e30b",
            method: "GET"

        }).then(function (response) {
            for (i = 0; i < 5; i++) {

                let newCard = $("<div>").attr("class", "col fiveDay bg-primary text-white rounded-lg p-2");
                $("#weeklyForecast").append(newCard);

                let myDate = new Date(response.list[i * 8].dt * 1000);

                newCard.append($("<h4>").html(myDate.toLocaleDateString()));

                let iconCode = response.list[i * 8].weather[0].icon;

                let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";

                newCard.append($("<img>").attr("src", iconURL));

                let temp = Math.round((response.list[i * 8].main.temp - 273.15) * 1.80 + 32);

                newCard.append($("<p>").html("Temp: " + temp + " &#8457"));

                let humidity = response.list[i * 8].main.humidity;

                newCard.append($("<p>").html("Humidity: " + humidity + "" + "%"));
            }
        })
    })
};

// searches and adds to history
$("#searchCity").click(function() {
    city = $("#city").val();
    getData();
    let checkArray = searchHistory.includes(city);
    if (checkArray == true) {
        return
    }
    else {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        let cityList = $("<a>").attr({

            class: "list-group-item list-group-item-action",
            href: "#"
        });
        cityList.text(city);
        $(".list-group").append(cityList);
    };
});
// Click handler
$(".list-group-item").click(function() {
    city = $(this).text();
    getData();
});