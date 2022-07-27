import { navBarLg } from "../components/navbar.js";
const body = document.querySelector("body");
const topSlider = document.querySelector(".carousel-inner");
const carouselIndicators = document.querySelector(".carousel-indicators");
const offer = document.querySelector(".content");
const offerNextBtn = document.querySelector("#next-offer");
const offerPrevBtn = document.querySelector("#prev-offer");
const offerSlider = document.querySelector(".ofamz-par");
const amazingOfferDiv = document.querySelector(".ltl-th");
let pages, slider, offers, products;
document.addEventListener("DOMContentLoaded", async () => {
  window.customElements.define("navbar-lg", navBarLg);
  body.insertAdjacentHTML("afterbegin", "<navbar-lg></navbar-lg>");
  document.addEventListener("click", (e) => {
    const navbar = document.querySelector("navbar-lg");
    if(!navbar.contains(e.target)) {
      navbar.shadowRoot.querySelector(".navbar-sm").style.left = "-100%"
    }
  })
  pages = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/pages.json`)).json() || [];
  products = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json`)).json() || [];
  slider = pages.sliders;
  offers = pages.offers;
  console.log(offers, products);
  showSlider();
  showOffer();
  offerNextBtn.parentElement.addEventListener("click", () => {
    offerSlider.scrollLeft += 220;
    offerPrevBtn.parentElement.classList.remove("d-none");
    offerPrevBtn.parentElement.classList.add("d-flex");
    let lastOffer = offerSlider.scrollWidth - (offerSlider.offsetWidth + offerSlider.scrollLeft);
    if(lastOffer - 220 <= 200) {
      offerSlider.scrollLeft = offerSlider.scrollWidth;
      offerNextBtn.parentElement.classList.add("d-none");
      offerNextBtn.parentElement.classList.remove("d-flex");
    }
  });
  offerPrevBtn.parentElement.addEventListener("click", () => {
    offerSlider.scrollLeft -= 220;
    offerNextBtn.parentElement.classList.remove("d-none");
    offerNextBtn.parentElement.classList.add("d-flex");
    if(offerSlider.scrollLeft -220 <= 200) {
      console.log(offerSlider.scrollLeft);
      offerSlider.scrollLeft = 0;
      offerPrevBtn.parentElement.classList.add("d-none");
      offerPrevBtn.parentElement.classList.remove("d-flex");
    }
  });
})

function showSlider() {
  let array = [];
  console.log();
  slider.forEach((element, index) => {
    carouselIndicators.innerHTML += `
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="active" aria-current="true" aria-label="Slide ${index+1}"></button>`;

    array.push(`
    <div class="carousel-item ${index === 0? "active":""}" data-bs-interval="7000">
      <img class="" src="${(window.outerWidth >= 840)? element[0]:element[1]}">
    </div>
    `);
  });
  topSlider.insertAdjacentHTML("beforeend", array.join(""));
}

function showOffer() {
  let array = [];
  offers.forEach((element, index) => {
    array.push(`
      <a href="/product/?product=${element}" target="_blank" class="offer-item bg-white me-1 p-2">
        <div class="d-flex align-items-center justify-content-center p-3">
          <div class="offer-img">
            <img class="w-100" src="${products[element].productPhoto[0]}">
          </div>
        </div>
        <p class="fs-5 text-primary fw-bold text-end">$${moneyFormat(products[element].productPrice)}</p>
      </a>
    `);
  }
  );
  offer.insertAdjacentHTML("beforeend", array.join(""));
}

function moneyFormat(num) {
  return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}