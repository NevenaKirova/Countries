window.addEventListener("hashchange", onHashChange);
window.addEventListener("DOMContentLoaded", onHashChange);

function onHashChange() {
  let page = location.hash.slice(1);

  if (!userManager.checkLoggedUser()) {
    HOME_PAGE.style.display = "none";
    LOGIN_FORM .style.display = "block";
    REGISTER_FORM.style.display = "none";
    SINGLE_CARD_CONTAINER.style.display = "none";
    ERROR_PAGE.style.display = "none";
    FOLLOWED_PAGE.style.display = "none";

    BRAND_LINK.style.display = "none";
    FAVOURITES_LINK.style.display = "none";
    LOGIN_LINK.style.display = "block";
    REGISTER_LINK.style.display = "block";
    LOGOUT_BTN .style.display = "none";
    ERROR_PAGE.style.display = "none";
    HOME_NAV.style.display = "none";
  } else {
    getAllCountries();
    HOME_NAV.style.display = "block";
    BRAND_LINK.style.display = "block";
    FAVOURITES_LINK.style.display = "block";
    LOGIN_LINK.style.display = "none";
    REGISTER_LINK.style.display = "none";
    LOGOUT_BTN .style.display = "block";
    ERROR_PAGE.style.display = "none";
    FOLLOWED_PAGE.style.display = "none";
  }

  if (page.includes("forecast/")) {
    printCountry(userManager.getLastOpenedCountry());
    showLocationDetails(userManager.getLastOpenedCountry());
    HOME_PAGE.style.display = "none";
    LOGIN_FORM .style.display = "none";
    REGISTER_FORM.style.display = "none";
    SINGLE_CARD_CONTAINER.style.display = "block";
    ERROR_PAGE.style.display = "none";
    FOLLOWED_PAGE.style.display = "none";
    FOLLOWED_PAGE.innerHTML = "";
    return;
  }

  switch (page) {
    case "home":
      HOME_PAGE.style.display = "block";
      LOGIN_FORM .style.display = "none";
      REGISTER_FORM.style.display = "none";
      SINGLE_CARD_CONTAINER.style.display = "none";
      ERROR_PAGE.style.display = "none";
      FOLLOWED_PAGE.style.display = "none";
      FOLLOWED_PAGE.innerHTML = "";
      break;
    case "login":
      HOME_PAGE.style.display = "none";
      LOGIN_FORM .style.display = "block";
      REGISTER_FORM.style.display = "none";
      SINGLE_CARD_CONTAINER.style.display = "none";
      ERROR_PAGE.style.display = "none";
      FOLLOWED_PAGE.style.display = "none";
      break;
    case "register":
      HOME_PAGE.style.display = "none";
      LOGIN_FORM .style.display = "none";
      REGISTER_FORM.style.display = "block";
      SINGLE_CARD_CONTAINER.style.display = "none";
      ERROR_PAGE.style.display = "none";
      FOLLOWED_PAGE.style.display = "none";
      break;
    case "FOLLOWED_PAGE":
      HOME_PAGE.style.display = "none";
      LOGIN_FORM .style.display = "none";
      REGISTER_FORM.style.display = "none";
      SINGLE_CARD_CONTAINER.style.display = "none";
      ERROR_PAGE.style.display = "none";
      FOLLOWED_PAGE.style.display = "block";
      break;

    default:
      HOME_PAGE.style.display = "none";
      LOGIN_FORM .style.display = "none";
      REGISTER_FORM.style.display = "none";
      SINGLE_CARD_CONTAINER.style.display = "none";
      ERROR_PAGE.style.display = "block";
  }
}

function getAllCountries() {
  fetch("https://restcountries.eu/rest/v2/all")
    .then((res) => res.json())
    .then((res) => {
      printCountryCards(CARDS_CONTAINER, res);
    });
}

function printCountryCards(container, countries) {
  container.innerHTML = "";
  for (let i = 0; i < countries.length; i++) {
    let card = createElement("div");
    card.classList.add("card");
    card.classList.add("mb-3");
    card.classList.add("mx-3");
    card.style.width = "18rem";
    let img = createElement("img");
    img.src = countries[i].flag;
    let cardBody = createElement("div");
    cardBody.className = "card-body";
    let title = createElement("h5", countries[i].name);
    title.className = "card-title";
    let capital = createElement("p", countries[i].capital);
    capital.className = "card-title";

    let descriptionContainer = createElement("div");
    descriptionContainer.classList.add("d-flex");
    descriptionContainer.classList.add("justify-content-center");
    descriptionContainer.classList.add("flex-column");
    descriptionContainer.classList.add("align-items-center");

    let buttonContainer = createElement("div");
    buttonContainer.classList.add("d-flex");
    buttonContainer.classList.add("justify-content-between");

    let button1 = createElement("button");
    button1.classList.add("btn");
    button1.classList.add("btn-primary");
    button1.classList.add("btn-sm");
    button1.innerText = "Check forecast";
    button1.addEventListener("click", function (ev) {
      ev.preventDefault();
      showLocationDetails(countries[i]);
    });

    let button2 = createElement("button");
    button2.classList.add("btn");
    button2.classList.add("btn-primary");
    button2.classList.add("btn-sm");
    button2.innerText = "Add to favourites";
    button2.addEventListener("click", function (ev) {
      let favourites = userManager.getCurrentUser().favourites;
      ev.preventDefault();
      userManager.addLocation(countries[i]);
      console.log(userManager.getCurrentUser().favourites);
      printCountryCards(FOLLOWED_PAGE, favourites);
    });

    buttonContainer.append(button1, button2);
    descriptionContainer.append(title, capital);
    cardBody.append(descriptionContainer, buttonContainer);
    card.append(img, cardBody);
    container.append(card);
  }
}

function printCountry(country) {
  SINGLE_CARD_CONTAINER.innerHTML = "";

  let card = createElement("div");
  card.classList.add("card");
  card.classList.add("mt-5");
  card.classList.add("ms-5");
  card.style.width = "60rem";
  let img = createElement("img");
  img.src = country.flag;
  let cardBody = createElement("div");
  cardBody.className = "card-body";
  let name = createElement("h5", country.name);
  name.className = "card-title";

  cardBody.append(name);
  card.append(img, cardBody);
  SINGLE_CARD_CONTAINER.append(card);
}

function getForecast(country) {
  return fetch(`https://restcountries.eu/rest/v2/name/${country}`).then((res) =>
    res.json()
  );
}

function showLocationDetails(countries) {
  userManager.saveLastOpenedCountry(countries);
  location.hash = `#forecast/${countries.name}`;
  fetch(`https://restcountries.eu/rest/v2/name/${countries.name}`)
    .then((res) => res.json())
    .then((res) => {
      fetch(
        `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${res[0].latlng[0]}&lon=${res[0].latlng[1]}`
      )
        .then((res) => res.json())
        .then((res) => {
          let forecastContainer = createElement("div");
          forecastContainer.classList.add("d-flex");
          forecastContainer.classList.add("flex-wrap");
          forecastContainer.style.width = "77rem";
          for (let i = 0; i <= 6; i++) {
            let forecastBox = createElement("div");
            forecastBox.classList.add("border");
            forecastBox.classList.add("border-secondary");
            forecastBox.classList.add("my-5");
            forecastBox.classList.add("mx-4");
            forecastBox.classList.add("w-25");
            let temperature = createElement("p");
            temperature.innerText =
              "Temperature: " +
              res.properties.timeseries[i].data.instant.details.air_temperature;
            let date = createElement("p");
            let newDate = new Date(res.properties.timeseries[i].time);
            date.innerText = "Time: " + newDate;
            forecastBox.append(date, temperature);
            forecastContainer.append(forecastBox);
            
          }
          
          SINGLE_CARD_CONTAINER.append(forecastContainer);
        });
    });
}

function showCountries() {
  let country = COUNTRY_INPUT.value;

  if (country === "") {
    getAllCountries();
  } else {
    fetch(`https://restcountries.eu/rest/v2/name/${country}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        printCountryCards(CARDS_CONTAINER, res);
      });
  }
}
