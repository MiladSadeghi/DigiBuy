import { navBarLg } from "/src/components/navbar.js";
const body = document.querySelector("body");
const progressOrderCounter = document.querySelector(".progress-counter");
const deliveryOrderCounter = document.querySelector(".delivery-counter");
const cancelOrderCounter = document.querySelector(".canceled-counter");
const userName = document.querySelector(".user-name");
const userPhone = document.querySelector(".user-phone");
const list = document.querySelector(".list");
const mostOrder = document.querySelector(".most-orders");
let user, products, orders, progress, delivery, cancel;
let userCookie = Object.fromEntries(document.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent)));

document.addEventListener("DOMContentLoaded", async () => {
  window.customElements.define("navbar-lg", navBarLg);
  body.insertAdjacentHTML("afterbegin", "<navbar-lg></navbar-lg>");
  const navbar = document.querySelector("navbar-lg");
  document.addEventListener("click", (e) => {
    if(!navbar.contains(e.target)) {
      navbar.shadowRoot.querySelector(".navbar-sm").style.left = "-100%"
    }
  })
  user = await getUser();
  products = await getProducts();
  orders = await getOrders();
  userName.innerHTML = user.userName;
  userPhone.innerHTML = user.phoneNumber;

  progressOrderCounter.innerHTML = `${Object.keys(progress).length}`;
  deliveryOrderCounter.innerHTML = `${Object.keys(delivery).length}`;
  cancelOrderCounter.innerHTML = `${Object.keys(cancel).length}`;
  console.log(user, products, orders);

  user.dashboard.wishlist.forEach((product, index) => {
    list.innerHTML += `
      <a href="/product/?product=${products[product].productID}" target="_blank" class="list-item d-flex flex-column position-relative me-4">
        <div class="${index !== user.dashboard.wishlist.length -1? "roll-middle":"d-none"}"></div>
        <div class="list-img">
          <img class="w-100" src="${products[product].productPhoto[0]}" alt="">
        </div>
        <div class="list-body mt-3 d-flex flex-column">
          <h6 class="list-title m-1 mb-0">${products[product].productName}</h6>
          <p class="mx-1 mb-0 text-end mt-auto text-primary fw-bold">$${moneyFormat(products[product].productPrice)}</p>
        </div>
      </a>
    `;
  })

  let productInOrder = [];
  console.log(productInOrder);
  for (let [key, value] of Object.entries(orders)) {
    value.orderProduct.forEach((item2, index2) => {
      productInOrder.push(item2.product);
    });
  }

  let mostOrderProduct = productInOrder.reduce((acc, el, i, arr) => {
    if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
  }, []);

  mostOrderProduct.forEach((product, index) => {
    mostOrder.innerHTML += `
    <a href="/product/?product=${products[product].productID}" target="_blank" class="list-item d-flex flex-column position-relative me-4">
        <div class="${index !== user.dashboard.wishlist.length -1? "roll-middle":"d-none"}"></div>
        <div class="list-img">
          <img class="w-100" src="${products[product].productPhoto[0]}" alt="">
        </div>
        <div class="list-body mt-3 d-flex flex-column h-100">
          <h6 class="list-title m-1 mb-0">${products[product].productName}</h6>
          <p class="mx-1 mb-0 text-end mt-auto text-primary fw-bold">$${moneyFormat(products[product].productPrice)}</p>
        </div>
      </a>
    `;
  })
})

async function getUser() {
  return await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${userCookie.userTable}.json`)).json();
}
async function getProducts() {
  return await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json`)).json();
}
async function getOrders() {
  let orders = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/orders.json`)).json();
  let userOrder = Object.fromEntries(Object.entries(orders).filter(([key, value]) => value.userID === userCookie.userTable));
  progress = Object.fromEntries(Object.entries(orders).filter(([key, value]) => value.orderStatus === ("progress") || ("pending")));
  delivery = Object.fromEntries(Object.entries(orders).filter(([key, value]) => value.orderStatus === "delivery"));
  cancel = Object.fromEntries(Object.entries(orders).filter(([key, value]) => value.orderStatus === "canceled"));
  return userOrder
}

function moneyFormat(num) {
  return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}