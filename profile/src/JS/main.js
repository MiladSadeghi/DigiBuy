import { navBarLg } from "/src/components/navbar.js";
import { basket } from "/src/components/basket.js";
const body = document.querySelector("body");
const progressOrderCounter = document.querySelectorAll(".progress-counter");
const deliveryOrderCounter = document.querySelectorAll(".delivery-counter");
const cancelOrderCounter = document.querySelectorAll(".canceled-counter");
const userName = document.querySelector(".user-name");
const userPhone = document.querySelector(".user-phone");
const list = document.querySelector(".list");
const mostOrder = document.querySelector(".most-orders");
const progressOrderDiv = document.querySelector("#progress-content");
const deliveredOrderDiv = document.querySelector("#delivered-content");
const canceledOrderDiv = document.querySelector("#canceled-content");
const productHistoryTabs = document.querySelectorAll(".history-tab");
const favoritesList = document.querySelector(".favorites-body");
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
  let basketClass = new basket();
  basketClass.basketElementID = navbar.shadowRoot.querySelector("#basket");
  basketClass.getUser();
  userName.innerHTML = user.userName;
  userPhone.innerHTML = user.phoneNumber;
  [...progressOrderCounter].map(i => {i.innerHTML = Object.keys(progress).length;(Object.keys(progress).length <= 0? progressOrderDiv.innerHTML = emptyOrderTemplate(): false)});
  [...deliveryOrderCounter].map(i => {i.innerHTML = Object.keys(delivery).length;(Object.keys(delivery).length <= 0? deliveredOrderDiv.innerHTML = emptyOrderTemplate(): false)});
  [...cancelOrderCounter].map(i => {i.innerHTML = Object.keys(cancel).length;(Object.keys(cancel).length <= 0? canceledOrderDiv.innerHTML = emptyOrderTemplate(): false)});
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
  for (let [key, value] of Object.entries(orders)) {
    value.orderProduct.forEach((item2, index2) => {
      productInOrder.push(item2.product);
    });
    if(value.orderStatus === 'progress' || value.orderStatus === 'pending') {
      progressOrderDiv.insertAdjacentHTML("beforeend", orderTemplate(value, `bi-hourglass-split text-warning`, "Progress"));
    } else {
    } if (value.orderStatus === 'delivery') {
      deliveredOrderDiv.insertAdjacentHTML("beforeend", orderTemplate(value, `bi-check-circle-fill text-success`, "Delivered"));
    } if (value.orderStatus === 'canceled') {
      canceledOrderDiv.insertAdjacentHTML("beforeend", orderTemplate(value, `bi-dash-circle-fill text-danger`, "Canceled"));
    }
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

  productHistoryTabs.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      let body = document.querySelector(e.target.getAttribute("show"));
      if (body.classList.contains("d-none")) {
        element.classList.add("active-order-tab")
        body.classList.remove("d-none");
        productHistoryTabs.forEach((element, index) => {
          if (element !== e.target) {
            document.querySelector(element.getAttribute("show")).classList.add("d-none");
            element.classList.remove("active-order-tab");
          }
        })
      }
    }, true)
  });

  user.dashboard.wishlist.forEach((item, index) => {
    favoritesList.innerHTML += `
      <div class="card border-0 h-100 liked-product rounded-0">
        <div class="d-flex align-items-center justify-content-center">
          <img width="200px" src="${products[item].productPhoto[0]}" class="">
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${products[item].productName}</h5>
          <p class="card-text fs-5 mx-1 mb-0 mt-auto text-primary fw-bold">$${moneyFormat(products[item].productPrice)}</p>
          <div class="d-flex mt-2">
            <button liked-id="${products[item].productID}" type="button" class="btn btn-outline-secondary me-2 d-flex fw-bold"><i
              class="bi bi-trash-fill me-2"></i> Remove</button>
            <button add-basket-id="${item}" type="button" class="btn btn-outline-danger w-100 d-flex justify-content-center align-items-center fw-bold"><i
              class="bi bi-cart-check-fill me-2"></i> Add to basket</button>
          </div>
        </div>
      </div>`;
  });

  favoritesList.addEventListener("click", async (e) => {
    if (e.target.hasAttribute("liked-id")) {
      let likedID = e.target.getAttribute("liked-id");
      user.dashboard.wishlist.splice(user.dashboard.wishlist.indexOf(likedID), 1);
      let send = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${user.userID}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
      if(send.ok) {
        alert("Product removed from favorites");
        e.target.parentElement.parentElement.parentElement.remove();
      }
    } else if (e.target.hasAttribute("add-basket-id")) {
      basketClass.addToCardBtn = e.target;
      await basketClass.addToBasket(e.target.getAttribute("add-basket-id"));
      e.target.innerHTML = `<i class="bi bi-cart-check-fill me-2"></i> Add to basket`;
    }
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
  progress = Object.fromEntries(Object.entries(orders).filter(([key, value]) => (value.orderStatus === "progress") || (value.orderStatus === "pending")));
  delivery = Object.fromEntries(Object.entries(orders).filter(([key, value]) => value.orderStatus === "delivery"));
  cancel = Object.fromEntries(Object.entries(orders).filter(([key, value]) => value.orderStatus === "canceled"));
  return userOrder
}

function moneyFormat(num) {
  return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function orderTemplate(value, icon, statusString) {
  let array = [];
  let date = new Date(value.orderDate);
  array.push(`<div class="progress-Item border border-1 rounded-3 mb-3">
  <div class="p-4 pb-0">
    <div class="d-flex">
      <i class="bi ${icon} me-2"></i>
      <h5 class="fw-bold">${statusString}</h5>
    </div>
    <div class="d-flex">
      <p class="mb-0 fs-09 text-muted">${date.getDay()} ${date.toLocaleString('en-us', { month: 'long' })}
        ${date.getFullYear()}</p>
      <span class="dot text-muted">&#xF309;</span>
      <p class="fs-09 text-muted">Order code <span class="text-black">${value.orderID}</span></p>
      <span class="dot text-muted">&#xF309;</span>
      <p class="fs-09 text-muted">Price <span class="text-black">$${moneyFormat(value.orderTotal)}</span></p>
    </div>
  </div>
  <hr class="my-0">
  <div class="d-flex px-4 py-3">
    ${(() => {
    let product = [];
    value.orderProduct.forEach((item, index) => {
    product.push(`
    <div>
      <img width="110px" src="${products[item.product].productPhoto[0]}" alt="">
    </div>
    `);
    })
    return product.join("");
    })()}
  </div>
</div>`);
return array.join("");
}

function emptyOrderTemplate() {
  return `<div class="empty-order d-flex align-items-center justify-content-center flex-column my-5 py-4">
  <div>
    <img src="src/IMG/order-empty.png" alt="">
  </div>
  <div>
    <h6 class="fs-6">You have no orders yet</h6>
  </div>
</div>`
}