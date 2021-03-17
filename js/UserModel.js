const userManager = (function () {
  class User {
    constructor(email, password) {
      this.email = email;
      this.password = password;
      this.isLogged = false;
      this.favourites = [];
    }
  }

  class UserManager {
    constructor() {
      if (localStorage.getItem("users")) {
        this.users = JSON.parse(localStorage.getItem("users"));
      } else {
        this.users = [];
      }
    }

    register(email, password) {
      this.users.push(new User(email, password));
      this.setUsers();
    }

    login(email, password) {
      let currentUser = this.users.find(
        (user) => user.email === email && user.password === password
      );

      if (currentUser) {
        this.users.forEach((user) => {
          if (user.email === email && user.password === password) {
            user.isLogged = true;
          } else {
            user.isLogged = false;
          }
        });

        this.setUsers();
      }

      return !!currentUser;
    }

    setUsers() {
      localStorage.setItem("users", JSON.stringify(this.users));
    }

    logOut() {
      userManager.users.forEach((el) => (el.isLogged = false));

      this.setUsers();
    }

    getCurrentUser() {
      return this.users.find((user) => user.isLogged);
    }

    checkLoggedUser() {
      let isLoggedIn = this.users.some((user) => user.isLogged === true);

      if (isLoggedIn) {
        let index = this.users.findIndex((el) => el.isLogged === true);

        this.login(
          userManager.users[index].email,
          userManager.users[index].password
        );

        return true;
      }

      return false;
    }

    isRegistered(email, password) {
      const isUserRegistered = this.users.some(
        (user) => user["email"] === email && user["password"] === password
      );

      return isUserRegistered;
    }

    saveLastOpenedCountry(country) {
      localStorage.setItem("lastOpenedCountry", JSON.stringify(country));
    }

    getLastOpenedCountry() {
      return JSON.parse(localStorage.getItem("lastOpenedCountry"));
    }

    like(forecast) {
      let isAlreadyLiked = false;
      for (let i = 0; i < this.favourites.length; i++) {
        if (this.favourites[i].id === ad.id) {
          isAlreadyLiked = true;
          break;
        }
      }
      if (!isAlreadyLiked) {
        this.favourites.push(forecast);
      }
    }

    isInLiked(id) {
      let isAlreadyLiked = false;
      for (let i = 0; i < this.favourites.length; i++) {
        if (this.favourites[i].id == id) {
          isAlreadyLiked = true;
          break;
        }
      }

      return isAlreadyLiked;
    }

    addLocation(location) {
      let currentUser = this.getCurrentUser();
      let locationExists = currentUser.favourites.some(
        (currentLocation) => currentLocation.name === location.name
      );
      if (locationExists) {
        return;
      }
      currentUser.favourites.push(location);

      this.setUsers();
    }
  }

  return new UserManager();
})();
