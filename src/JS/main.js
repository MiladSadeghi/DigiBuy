import { navBarLg } from "../components/navbar.js";
const body = document.querySelector("body");
const topSlider = document.querySelector(".carousel-inner");
const carouselIndicators = document.querySelector(".carousel-indicators");
let slider;
document.addEventListener("DOMContentLoaded", async () => {
  window.customElements.define("navbar-lg", navBarLg);
  body.insertAdjacentHTML("afterbegin", "<navbar-lg></navbar-lg>");
  document.addEventListener("click", (e) => {
    const navbar = document.querySelector("navbar-lg");
    if(!navbar.contains(e.target)) {
      navbar.shadowRoot.querySelector(".navbar-sm").style.left = "-100%"
    }
  })
  slider = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/pages/sliders.json`)).json() || [];
  showSlider();
})

function showSlider() {
  let array = [];
  console.log();
  slider.forEach((element, index) => {
    carouselIndicators.innerHTML += `
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="active" aria-current="true" aria-label="Slide ${index+1}"></button>
    `;
    console.log(element);
    array.push(`
      <div class="carousel-item ${index === 0? "active":""}">
        <img class="" src="${(window.outerWidth >= 840)? element[0]:element[1]}">
      </div>
    `);
  });
  topSlider.insertAdjacentHTML("beforeend", array.join(""));
}
