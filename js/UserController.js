

function validateEmail(email) {
  let emailCheck = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.value === "") {
    email.classList.add("is-invalid");
    return false;
  } else if (emailCheck.test(email.value)) {
    email.classList.remove("is-invalid");
    return true;
  } else {
    email.classList.add("is-invalid");
    return false;
  }
}

LOGIN_BTN.addEventListener("click", function (ev) {
  ev.preventDefault();
  let email = LOGIN_INPUT_EMAIL.value;
  let password = LOGIN_INPUT_PASSWORD.value;

  if (userManager.login(email, password)) {
    location.hash = "home";
   
  }
});

REGISTER_BTN.addEventListener("click", function (ev) {
  ev.preventDefault();
  let email = REGISTER_INPUT_EMAIL;
  let password = REGISTER_INPUT_PASSWORD;

  if (!validateEmail(email) || password.value === "") {
    REGISTRATION_FORM.reset();
    return;
  } else {
    userManager.register(email.value, password.value);
    LOGIN_FORM .style.display = "block";
    REGISTER_FORM.style.display = "none";
    REGISTRATION_FORM.reset();
  }
});

LOGOUT_BTN.addEventListener("click", function (ev) {
  ev.preventDefault();
  userManager.logOut();
  FOLLOWED_PAGE.innerHTML ="";
  location.hash = "login"
  
});

let debaunced =  debounce(showCountries,500);

COUNTRY_INPUT.addEventListener("input", debaunced);




FAVOURITES_LINK.addEventListener("click", function(){
  let favourites = userManager.getCurrentUser().favourites;
  HOME_PAGE.style.display = "none";
  printCountryCards(FOLLOWED_PAGE,favourites);
})

