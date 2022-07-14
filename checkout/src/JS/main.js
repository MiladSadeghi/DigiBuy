import { navBarLg } from "/src/components/navbar.js";
import { basket } from "/src/components/basket.js";
const body = document.querySelector("body");
const productList = document.querySelector(".pr-du-out");
const productCounter = document.querySelectorAll(".product-counter");
const emptyBasketDiv = document.querySelector(".empty-basket");
const shouldLogin = document.querySelector(".you-most-login");
const nonEmptyBasketDiv = document.querySelector(".non-empty-basket");
const checkOut = document.querySelector(".checkout");
const productPrices = document.querySelectorAll(".pr-prc");
const totalProduct = document.querySelector(".total-product");
const checkoutBtn = document.querySelector(".checkout-btn");
let basketClass;
let basketProduct;
let products;
let basketList = [];
let prices = 0;

window.customElements.define("navbar-lg", navBarLg);
body.insertAdjacentHTML("afterbegin", "<navbar-lg></navbar-lg>");

document.addEventListener("DOMContentLoaded", async () => {
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
    if (!popoverTriggerEl.hasAttribute("aria-describedby")) {
      new bootstrap.Popover(popoverTriggerEl, {
        container: 'body',
        html: true,
        placement: 'bottom',
        sanitize: false,
        content: () => {
          return document.querySelector('#PopoverContent').innerHTML;
        }
      });
    }
  });

  products = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json")).json();
  document.addEventListener("click", (e) => {
    const navbar = document.querySelector("navbar-lg");
    if (!navbar.contains(e.target)) {
      navbar.shadowRoot.querySelector(".navbar-sm").style.left = "-100%"
    }
    if (e.target.classList.contains("bi-plus-lg")) {
      let quantity = e.target.parentElement.children[1];
      let priceElement = document.querySelectorAll(".pr-prc p")[e.target.getAttribute("item")];
      let price = Number(products[basketProduct[e.target.getAttribute("item")]].productPrice);
      let first = e.target.parentElement.children[0];
      prices += price;
      if (first.classList.contains("bi-trash3")) {
        first.classList.remove("bi-trash3");
        first.classList.add("bi-dash-lg");
      }
      quantity.innerHTML = Number(quantity.innerHTML) + 1;
      price = Number(quantity.innerHTML) * price;
      priceElement.innerHTML = `$${moneyFormat(price)}`;
      productPrices.forEach((element) => {
        element.innerHTML = `$${moneyFormat(prices)}`;
      })
      totalProduct.innerHTML = Number(totalProduct.innerHTML) + 1;
    }
    if (e.target.classList.contains("bi-dash-lg")) {
      if (e.target.parentElement.children[1].innerHTML > 1) {
        let quantity = e.target.parentElement.children[1];
        let priceElement = document.querySelectorAll(".pr-prc p")[e.target.getAttribute("item")];
        let price = Number(products[basketProduct[e.target.getAttribute("item")]].productPrice);
        prices -= price;
        quantity.innerHTML = Number(quantity.innerHTML) - 1;
        price = Number(quantity.innerHTML) * price;
        priceElement.innerHTML = `$${moneyFormat(price)}`;
        productPrices.forEach((element) => {
          element.innerHTML = `$${moneyFormat(prices)}`;
        })
        totalProduct.innerHTML = Number(totalProduct.innerHTML) - 1;
      }
      if (e.target.parentElement.children[1].innerHTML == 1) {
        let first = e.target.parentElement.children[0];
        first.classList.remove("bi-dash-lg");
        first.classList.add("bi-trash3");
      }
      productPrices.forEach((element) => {
        element.innerHTML = `$${moneyFormat(prices)}`;
      })
    }
    if (e.target.classList.contains("bi-trash3")) {
      let remove = basketClass.removeFromBasket(e.target.parentElement.parentElement.parentElement.getAttribute("product-id"));
      let price = Number(products[basketProduct[e.target.getAttribute("item")]].productPrice);
      let quantity = e.target.parentElement.children[1];
      if (remove) {
        prices -= price;
        productPrices.forEach((element) => {
          element.innerHTML = `$${moneyFormat(prices)}`;
        })
        totalProduct.innerHTML = Number(totalProduct.innerHTML) - 1;
        removeProduct(e.target.parentElement.parentElement.parentElement);
        basketStatus();
        productPrices.forEach((element) => {
          element.innerHTML = `$${moneyFormat(prices)}`;
        })
      }
    }
    if (e.target.classList.contains("rm-a")) {
      let remove = basketClass.removeFromBasket("all");
      if (remove) {
        removeProduct("all");
        basketStatus();
      }
    }
  })

  basketClass = new basket();
  basketClass.getUser();
  basketClass.basketElementID = document.querySelector("navbar-lg").shadowRoot.querySelector("#basket");
  basketProduct = await basketClass.getBasket();
  basketStatus();
  showProduct(basketProduct);

  productPrices.forEach((element) => {
    element.innerHTML = `$${moneyFormat(prices)}`;
  })

  checkoutBtn.addEventListener("click", () => {
    if(basketClass.db === "guest") {
      checkoutBtn.href = "/login";
      checkoutBtn.target = "_blank";
    } else {
      submitOrder();
    }
  })
})

function showProduct(basketProduct) {
  productCounter.forEach((element, index) => {
    element.innerHTML = (basketProduct?.length || 0);
  })
  basketProduct.forEach((item, index) => {
    totalProduct.innerHTML = Number(totalProduct.innerHTML) + 1
    prices += Number(products[item].productPrice);
    basketList.push(`
      <div class="pr-du-in mt-2" product-id="${products[item].productID}">
        <a target="_blank" href="/product/?product=${products[item].productID}" class="pr-im">
          <img src="${products[item].productPhoto[0].replace(`")`, "")}" alt="">
        </a>
        <div class="pr-st">
          <h5 class="fw-bold fs-6 mb-3">${products[item].productName}</h5>
          <p class="text-muted mb-1"><i class="bi bi-shield-check d-flex"></i><span>Guarantee of product authenticity and health</span></p>
          <p class="text-muted mb-1"><i class="bi bi-archive d-flex"></i><span>Available in DigiBuy warehouse</span></p>
          <p class="text-muted mb-1"><i class="bi bi-truck d-flex"></i><span>Delivery in 2-3 days</span></p>
        </div>
        <div class="pr-qua">
          <div class="d-flex qua-ch justify-content-between">
            <i class="bi bi-trash3 p-2" item="${index}"></i>
            <div class="quantity d-flex align-items-center justify-content-center text-primary fw-bolder fs-4" style="user-select: none;">1</div>
            <i class="bi bi-plus-lg p-2" item="${index}"></i>
          </div>
        </div>
        <div class="pr-prc d-flex align-items-center">
          <p class="fw-bold fs-4 mb-0 text-primary">$${moneyFormat(products[item].productPrice)}</p>
        </div>
        ${index !== basketProduct.length - 1 ? `<hr class="mt-3">` : ""}
      </div>
      
    `)
  });
  productList.insertAdjacentHTML("beforeend", basketList.join(""));
}

function removeProduct(productID) {
  let productsID = document.querySelectorAll("[product-id]");
  productsID.forEach((element) => {
    if (productID === element || productID === "all") {
      element.remove();
      basketProduct.splice(basketProduct.indexOf(productID, 1));
    }
  });
  productCounter.forEach((element, index) => {
    element.innerHTML = basketProduct.length;
  })
}

function moneyFormat(num) {
  return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function basketStatus() {
  if (basketProduct.length !== 0) {
    nonEmptyBasketDiv.classList.remove("d-none");
    checkOut.classList.remove("d-none");
    shouldLogin.classList.add("d-none");
    emptyBasketDiv.classList.add("d-none");
  } else {
    nonEmptyBasketDiv.classList.add("d-none");
    checkOut.classList.add("d-none");
    shouldLogin.classList.remove("d-none");
    emptyBasketDiv.classList.remove("d-none");
  }
}

async function submitOrder() {
  let userOrder = {
    userID: basketClass.userID,
    orderDate: new Date().toLocaleDateString(),
    orderTime: new Date().toLocaleTimeString(),
    orderStatus: "pending",
    orderTotal: prices,
    orderID: basketClass.uniqueID(),
  }
  let quantity = document.querySelectorAll(".quantity");
  let orderProduct = [];
  quantity.forEach((element, index) => {
    orderProduct.push({product:basketProduct[index], quantity: element.innerHTML})
  })
  userOrder["orderProduct"] = orderProduct;
  let confirmOrder = confirm("You Want To Submit This Order?");
  console.log(confirmOrder);
  if(confirmOrder) {
    let response = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${userOrder.userID}/dashboard/orders/${userOrder.orderID}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userOrder)
    })
    let response1 = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/orders/${userOrder.orderID}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userOrder)
    });
    console.log(response, response1);
    await basketClass.removeFromBasket("all");
    basketProduct = [];
    await basketClass.getBasket();
    basketStatus();
  }
}