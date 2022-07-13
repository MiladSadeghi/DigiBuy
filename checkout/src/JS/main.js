import { navBarLg } from "/src/components/navbar.js";
import { basket } from "/src/components/basket.js";
const body = document.querySelector("body");
const productList = document.querySelector(".pr-du-out");
const productCounter = document.querySelectorAll(".product-counter");
let basketProduct;
let products;
let basketList = [];

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
      if (first.classList.contains("bi-trash3")) {
        first.classList.remove("bi-trash3");
        first.classList.add("bi-dash-lg");
      }
      quantity.innerHTML = Number(quantity.innerHTML) + 1;
      price = Number(quantity.innerHTML) * price;
      priceElement.innerHTML = `$${moneyFormat(price)}`;
    }
    if (e.target.classList.contains("bi-dash-lg")) {
      if (e.target.parentElement.children[1].innerHTML > 1) {
        let quantity = e.target.parentElement.children[1];
        let priceElement = document.querySelectorAll(".pr-prc p")[e.target.getAttribute("item")];
        let price = Number(products[basketProduct[e.target.getAttribute("item")]].productPrice);
        quantity.innerHTML = Number(quantity.innerHTML) - 1;
        price = Number(quantity.innerHTML) * price;
        priceElement.innerHTML = `$${moneyFormat(price)}`;
      }
      if (e.target.parentElement.children[1].innerHTML == 1) {
        let first = e.target.parentElement.children[0];
        console.log(first);
        first.classList.remove("bi-dash-lg");
        first.classList.add("bi-trash3");
      }
    }
    if (e.target.classList.contains("bi-trash3")) {
      let remove = basketClass.removeFromBasket(e.target.parentElement.parentElement.parentElement.getAttribute("product-id"));
      if (remove) {
        removeProduct(e.target.parentElement.parentElement.parentElement);
      }
    }
    if(e.target.classList.contains("rm-a")) {
      let remove = basketClass.removeFromBasket("all");
      if (remove) {
        removeProduct("all");
      }
    }
  })

  let basketClass = new basket();
  basketClass.getUser();
  basketClass.basketElementID = document.querySelector("navbar-lg").shadowRoot.querySelector("#basket");
  basketProduct = await basketClass.getBasket();
  showProduct(basketProduct);
  console.log(products);
})

function showProduct(basketProduct) {
  productCounter.forEach((element, index) => {
    element.innerHTML = basketProduct.length;
  })
  basketProduct.forEach((item, index) => {
    basketList.push(`
      <div class="pr-du-in mt-2" product-id="${products[item].productID}">
        <div class="pr-im">
          <img src="${products[item].productPhoto[0].replace(`")`, "")}" alt="">
        </div>
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
    if(productID === element || productID === "all") {
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