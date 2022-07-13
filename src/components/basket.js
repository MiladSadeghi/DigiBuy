class basket{
  constructor(userID, addToCardBtn, basketElementID, db) {
    this.userID = userID;
    this.addToCardBtn = addToCardBtn;
    this.basketElementID = basketElementID;
    this.db = db;
    this.date = new Date();
    this.date.setYear(2080);
  }

  getUser() {
    let userCookie = Object.fromEntries(document.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent)));
    let id = this.uniqueID();
    if(!userCookie.guestID && !userCookie.userTable) {
      document.cookie = `guestID=${id};path=/;expires=${this.date}`;
      this.userID = id;
    } else if(userCookie.guestID && !userCookie.userTable) {
      this.userID = userCookie.guestID;
      this.db = "guest"
    } else if(userCookie.userTable) {
      this.userID = userCookie.userTable;
      this.db = "users";
      this.moveGuestBasket(userCookie.guestID, userCookie.userTable);
    }
  }

  async getBasket() {
    let response = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/${this.db}/${this.userID}/basket.json`);
    let data = await response.json();
    if((data !== null? data.length:0) > 0) {
      this.basketElementID.innerHTML += `<span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
      <span class="visually-hidden">New alerts</span>
    </span>`
      return data;
    }
    return [];
  }

  async addToBasket(productID) {
    this.addToCardBtn.classList.add("disabled");
    this.addToCardBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    let basket = await this.getBasket() || [];
    if(!basket.includes(productID)) {
      basket.push(productID);
    }
    let response = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/${this.db}/${this.userID}/basket.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(basket)
    });
    let data = await response.json();
    this.getBasket();
    this.addToCardBtn.classList.remove("disabled");
    this.addToCardBtn.innerHTML = `Add To Card`;
  }

  uniqueID() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  };

  async moveGuestBasket(guestID, userID) {
    let getGuestDB = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/guest/${guestID}/basket.json`)).json();
    let getUserDB = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}/basket.json`)).json() || [];
    if(getGuestDB !== null) {
      getGuestDB.forEach((item)=> {
        if(!getUserDB.includes(item)) {
          getUserDB.push(item);
        }
      })
    }
    let postUserDB = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${userID}/basket.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(getUserDB)
    });
    let postGuestDB = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/guest/${guestID}/basket.json`, {method: "DELETE"})
  }

  async removeFromBasket(productID) {
    try {
      this.getUser();
      let response = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/${this.db}/${this.userID}/basket.json`)).json();
      if(!response) throw new Error("Cant Connect To DB");
      if(productID === "all") {
        response = [];
      } else {
        response.splice(response.indexOf(productID), 1);
      }
      let postResponse = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/${this.db}/${this.userID}/basket.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
      })
      if(!response) throw new Error("Cant Connect To DB");
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}

export { basket }