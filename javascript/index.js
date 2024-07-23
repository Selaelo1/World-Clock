function updateTime() {
  // Los Angeles
  let losAngelesElement = document.querySelector("#los-angeles");
  if (losAngelesElement) {
    let losAngelesDateElement = losAngelesElement.querySelector(".date");
    let losAngelesTimeElement = losAngelesElement.querySelector(".time");
    let losAngelesTime = moment().tz("America/Los_Angeles");

    losAngelesDateElement.innerHTML = losAngelesTime.format("MMMM	Do, YYYY");
    losAngelesTimeElement.innerHTML = losAngelesTime.format(
      "h:mm:ss [<small>]A[</small>]"
    );
  }

  // Paris
  let parisElement = document.querySelector("#paris");
  if (parisElement) {
    let parisDateElement = parisElement.querySelector(".date");
    let parisTimeElement = parisElement.querySelector(".time");
    let parisTime = moment().tz("Europe/Paris");

    parisDateElement.innerHTML = parisTime.format("MMMM	Do, YYYY");
    parisTimeElement.innerHTML = parisTime.format(
      "h:mm:ss [<small>]A[</small>]"
    );
  }
}


function updateCity(event) {
  let cityTimeZone = event.target.value;
  if (cityTimeZone === "current") {
    cityTimeZone = moment.tz.guess();
  }
  let cityName = cityTimeZone.replace("_", " ").split("/")[1];
  let cityTime = moment().tz(cityTimeZone);
  let citiesElement = document.querySelector("#cities");
  
  // Create a new city element
  const newCityElement = document.createElement('div');
  newCityElement.className = 'slide-to-delete';
  newCityElement.innerHTML = `
    <div class="city">
      <div>
        <h2>${cityName}</h2>
        <div class="date">${cityTime.format("MMMM Do, YYYY")}</div>
      </div>
      <div class="time">${cityTime.format("h:mm:ss")} <small>${cityTime.format("A")}</small></div>
      <button class="delete-button">Delete</button>
    </div>
  `;
  
  // Append the new city element to the existing cities
  citiesElement.appendChild(newCityElement);

  let cities = JSON.parse(localStorage.getItem('cities')) || [];
  cities.push({
    name: cityName,
    timezone: cityTimeZone
  });
  localStorage.setItem('cities', JSON.stringify(cities));
}




updateTime();
setInterval(updateTime, 1000);

let citiesSelectElement = document.querySelector("#city");

citiesSelectElement.addEventListener("change", updateCity);



function deleteCity(event) {
  let city = event.target.parentNode.parentNode;
  let cityName = city.querySelector('h2').textContent;
  let citiesContainer = document.getElementById('cities');

  if (confirm(`Are you sure you want to delete ${cityName}?`)) {
    city.remove();

    // Remove the city from local storage
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities = cities.filter((storedCity) => storedCity.name !== cityName);
    localStorage.setItem('cities', JSON.stringify(cities));
  }
}



window.onload = function() {
  let cities = JSON.parse(localStorage.getItem('cities')) || [];
  cities.forEach((city) => {
    updateCity({
      target: {
        value: city.timezone
      }
    });
  });
}




let citiesContainer = document.getElementById('cities');
citiesContainer.addEventListener('click', deleteCity);


