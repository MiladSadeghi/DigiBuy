import { navBarLg } from "../components/navbar.js";
const body = document.querySelector("body");
const topSlider = document.querySelector(".carousel-inner");
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
  slider.forEach((element, index) => {
    array.push(`
      <div class="carousel-item ${index === 0? "active":""}">
        <img class="" src="${element[0]}">
      </div>
    `);
  });
  topSlider.insertAdjacentHTML("beforeend", array.join(""));
}
