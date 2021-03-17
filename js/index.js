window.addEventListener("hashchange", onHashChange);
window.addEventListener("DOMContentLoaded", onHashChange);

function onHashChange() {
  let page = location.hash.slice(1);

  if (!userManager.checkLoggedUser()) {
    homePage.style.display = "none";
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    singleCardContainer.style.display = "none";
    errorPage.style.display = "none";
    followedPage.style.display = "none";

    brandLink.style.display = "none";
    favouritesLink.style.display = "none";
    loginLink.style.display = "block";
    registerLink.style.display = "block";
    logOutBtn.style.display = "none";
    errorPage.style.display = "none";
    homeNav.style.display = "none";
  } else {
    getAllCountries();
    homeNav.style.display = "block";
    brandLink.style.display = "block";
    favouritesLink.style.display = "block";
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logOutBtn.style.display = "block";
    errorPage.style.display = "none";
    followedPage.style.display = "none";
  }

  if (page.includes("forecast/")) {
    printCountry(userManager.getLastOpenedCountry());
    showLocationDetails(userManager.getLastOpenedCountry());
    homePage.style.display = "none";
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    singleCardContainer.style.display = "block";
    errorPage.style.display = "none";
    followedPage.style.display = "none";
    followedPage.innerHTML = "";
  }

  switch (page) {
    case "home":
      homePage.style.display = "block";
      loginForm.style.display = "none";
      registerForm.style.display = "none";
      singleCardContainer.style.display = "none";
      errorPage.style.display = "none";
      followedPage.style.display = "none";
      followedPage.innerHTML = "";
      break;
    case "login":
      homePage.style.display = "none";
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      singleCardContainer.style.display = "none";
      errorPage.style.display = "none";
      followedPage.style.display = "none";
      break;
    case "register":
      homePage.style.display = "none";
      loginForm.style.display = "none";
      registerForm.style.display = "block";
      singleCardContainer.style.display = "none";
      errorPage.style.display = "none";
      followedPage.style.display = "none";
      break;
    case "followedPage":
      homePage.style.display = "none";
      loginForm.style.display = "none";
      registerForm.style.display = "none";
      singleCardContainer.style.display = "none";
      errorPage.style.display = "none";
      followedPage.style.display = "block";
      break;

    // default:
    //   homePage.style.display = "none";
    //   loginForm.style.display = "none";
    //   registerForm.style.display = "none";
    //   singleCardContainer.style.display = "none";
    //   errorPage.style.display = "block";
  }
}

function getAllCountries() {
  fetch("https://restcountries.eu/rest/v2/all")
    .then((res) => res.json())
    .then((res) => {
      printCountryCards(cardsContainer, res);
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
      printCountryCards(followedPage, favourites);
    });

    buttonContainer.append(button1, button2);
    descriptionContainer.append(title, capital);
    cardBody.append(descriptionContainer, buttonContainer);
    card.append(img, cardBody);
    container.append(card);
  }
}

function printCountry(country) {
  singleCardContainer.innerHTML = "";

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
  singleCardContainer.append(card);
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
            forecastContainer.append(forecastBox);
            forecastBox.append(date, temperature);
          }
          singleCardContainer.append(forecastContainer);
        });
    });
}

function showCountries() {
  let country = countryInput.value;

  if (country === "") {
    getAllCountries();
  } else {
    fetch(`https://restcountries.eu/rest/v2/name/${country}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        printCountryCards(cardsContainer, res);
      });
  }
}
