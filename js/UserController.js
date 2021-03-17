

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

loginBtn.addEventListener("click", function (ev) {
  ev.preventDefault();
  let email = loginInputEmail.value;
  let password = loginInputPassword.value;

  if (userManager.login(email, password)) {
    location.hash = "home";
   
  }
});

registerBtn.addEventListener("click", function (ev) {
  ev.preventDefault();
  let email = registerInputEmail;
  let password = registerInputPassword;

  if (!validateEmail(email) || password.value === "") {
    registrationForm.reset();
    return;
  } else {
    userManager.register(email.value, password.value);
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    registrationForm.reset();
  }
});

logOutBtn.addEventListener("click", function (ev) {
  ev.preventDefault();
  userManager.logOut();
  followedPage.innerHTML ="";
  location.hash = "login"
  
});

let debaunced =  debounce(showCountries,500);

countryInput.addEventListener("input", debaunced);




favouritesLink.addEventListener("click", function(){
  let favourites = userManager.getCurrentUser().favourites;
  printCountryCards(followedPage,favourites);
})

