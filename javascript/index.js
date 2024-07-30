function updateTime() {
  // Update time for all cities
  let cities = document.querySelectorAll('.city');
  cities.forEach((city) => {
    let cityTimeZone = city.querySelector('h2').getAttribute('data-timezone');
    if (cityTimeZone) {
      let cityTimeElement = city.querySelector(".time");
      let cityDateElement = city.querySelector(".date");
      let cityTime = moment().tz(cityTimeZone);
      if (cityTime) {
        cityTimeElement.innerHTML = cityTime.format("h:mm:ss A");
        cityDateElement.innerHTML = cityTime.format("MMMM Do, YYYY");
      }
    }
  });
  setTimeout(updateTime, 1000);
}

function updateCity(event) {
  let cityTimeZone = event.target.value;
  if (cityTimeZone === "current") {
    cityTimeZone = moment.tz.guess();
  }
  let cityName = cityTimeZone.replace("_", " ").split("/")[1];
  let cityTime = moment().tz(cityTimeZone);
  let citiesElement = document.querySelector("#cities");

  // Check if the city already exists in the DOM
  let existingCityElements = citiesElement.querySelectorAll('.city');
  let existingCityElement = Array.prototype.find.call(existingCityElements, (city) => {
    return city.querySelector('h2').getAttribute('data-timezone') === cityTimeZone;
  });

  if (!existingCityElement) {
    // Create a new city element
    const newCityElement = document.createElement('div');
    newCityElement.className = 'slide-to-delete';
    newCityElement.innerHTML = `
      <div class="city">
        <div>
          <h2 data-timezone="${cityTimeZone}">${cityName}</h2>
          <div class="date">${cityTime.format("MMMM Do, YYYY")}</div>
        </div>
        <div class="time">${cityTime.format("h:mm:ss A")}</div>
        <button class="delete-button">Delete</button>
      </div>
    `;

    // Append the new city element to the existing cities
    citiesElement.appendChild(newCityElement);

    // Add the city to local storage
    let existingCities = JSON.parse(localStorage.getItem('cities')) || [];
    existingCities.push({ name: cityName, timezone: cityTimeZone });
    localStorage.setItem('cities', JSON.stringify(existingCities));
  } else {
    alert(`City '${cityName}' already exists!`);
  }
}





function deleteCity(event) {
  let city = event.target.parentNode.parentNode;
  let cityName = city.querySelector('h2').textContent;
  let cityTimeZone = city.querySelector('h2').getAttribute('data-timezone');
  let citiesContainer = document.getElementById('cities');

  if (confirm(`Are you sure you want to delete ${cityName}?`)) {
    city.remove();
    let existingCities = JSON.parse(localStorage.getItem('cities')) || [];
    existingCities = existingCities.filter((storedCity) => storedCity.name !== cityName || storedCity.timezone !== cityTimeZone);
    localStorage.setItem('cities', JSON.stringify(existingCities));
  }
}



window.onload = function() {
  let cities = JSON.parse(localStorage.getItem('cities')) || [];
  cities.forEach((city) => {
    updateCity({ target: { value: city.timezone } });
  });
  updateTime(); // Call updateTime initially
}

let citiesContainer = document.getElementById('cities');
citiesContainer.addEventListener('click', deleteCity);

let citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);


