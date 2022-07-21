import { navBarLg } from "/src/components/navbar.js";
const searchParameters = new URLSearchParams(window.location.search);
const query = searchParameters.get("q");
const value = searchParameters.get("value");
const body = document.querySelector("body");
const content = document.querySelector(".content");
let products;
document.addEventListener("DOMContentLoaded", async () => {
  window.customElements.define("navbar-lg", navBarLg);
  body.insertAdjacentHTML("afterbegin", "<navbar-lg></navbar-lg>");
  const navbar = document.querySelector("navbar-lg");
  document.addEventListener("click", (e) => {
    if(!navbar.contains(e.target)) {
      navbar.shadowRoot.querySelector(".navbar-sm").style.left = "-100%"
    }
  })
  navbar.shadowRoot.querySelector(".searchbar-div").innerHTML = value;
  products = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json")).json();
  showContent();
})

function showContent() {
  let product = [];
  let contentItem = [];
  for (let key in products) {
    let item = [products[key]].filter((item) => {
      return item[query] === value || item[query].includes(value);
    })
    product = product.concat(item);
  }
  product.forEach((item, index) => {
    contentItem.push(`
    <a href="/product/?product=${item.productID}" target="_blank" class="product col-md-4">
      <div class="product-image d-flex align-items-center justify-content-center">
        <img class="" src="${item.productPhoto[0]}" alt="${item.name}">
      </div>
      <div class="product-info">
        <h3>${item.productName}</h3>
        <p class="fs-4 fw-bolder text-primary">$${moneyFormat(item.productPrice)}</p>
      </div>
    </a>
    `)
  });
  content.insertAdjacentHTML("beforeend", contentItem.join(""));
}

function moneyFormat(num) {
  return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}