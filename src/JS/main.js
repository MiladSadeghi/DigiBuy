import { navBarLg } from "../components/navbar.js";
import { basket } from "../components/basket.js";
const body = document.querySelector("body");
const topSlider = document.querySelector(".carousel-inner");
const carouselIndicators = document.querySelector(".carousel-indicators");
const offer = document.querySelector(".content");
const offerNextBtn = document.querySelector("#next-offer");
const offerPrevBtn = document.querySelector("#prev-offer");
const offerSlider = document.querySelector(".ofamz-par");
const lastVisitSlider = document.querySelector(".ls-scrll");
const lastVisitContent = document.querySelector(".content-last-visit");
const lastVisitNextBtn = document.querySelector("#next-visit");
const lastVisitPrevBtn = document.querySelector("#prev-visit");
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
  showSlider();
  showOffer();
  let basketClass = new basket();
  basketClass.getUser();
  showLastVisit(basketClass);
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
      offerSlider.scrollLeft = 0;
      offerPrevBtn.parentElement.classList.add("d-none");
      offerPrevBtn.parentElement.classList.remove("d-flex");
    }
  });

  lastVisitNextBtn.parentElement.addEventListener("click", () => {
    lastVisitSlider.scrollLeft += 220;
    lastVisitPrevBtn.parentElement.classList.remove("d-none");
    lastVisitPrevBtn.parentElement.classList.add("d-flex");
    let lastVisit = lastVisitSlider.scrollWidth - (lastVisitSlider.offsetWidth + lastVisitSlider.scrollLeft);
    if(lastVisit - 220 <= 200) {
      lastVisitSlider.scrollLeft = lastVisitSlider.scrollWidth;
      lastVisitNextBtn.parentElement.classList.add("d-none");
      lastVisitNextBtn.parentElement.classList.remove("d-flex");
    }
  });
  lastVisitPrevBtn.parentElement.addEventListener("click", () => {
    lastVisitSlider.scrollLeft -= 220;
    lastVisitNextBtn.parentElement.classList.remove("d-none");
    lastVisitNextBtn.parentElement.classList.add("d-flex");
    if(lastVisitSlider.scrollLeft -220 <= 200) {
      lastVisitSlider.scrollLeft = 0;
      lastVisitPrevBtn.parentElement.classList.add("d-none");
      lastVisitPrevBtn.parentElement.classList.remove("d-flex");
    }
  });
})

function showSlider() {
  let array = [];
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

async function showLastVisit(basketClass) {
  let user = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/${basketClass.db}/${basketClass.userID}.json`)).json() || [];
  let array = [];
  if(user.dashboard?.recentlyViewed && user.dashboard.recentlyViewed.length > 0) {
    user.dashboard.recentlyViewed.forEach((element, index) => {
      array.push(`
        <a href="/product/?product=${element}" target="_blank">
          <div class="last-visit-item bg-white me-1 p-2 d-flex align-items-center justify-content-center">
            <img class="w-100" src="${products[element].productPhoto[0]}" alt="">
          </div>
        </a>
      `);
    })
  } else {
    array.push(`
      <div style="height: 200px"  class="w-100 bg-white me-1 p-2 d-flex align-items-center justify-content-center">
        <p class="text-center fs-3">No recently viewed items</p>
      </div>
    `);
  }
  lastVisitContent.insertAdjacentHTML("beforeend", array.join(""));
}