import { navBarLg } from "../components/navbar.js";
const body = document.querySelector("body");

document.addEventListener("DOMContentLoaded", async () => {
  window.customElements.define("navbar-lg", navBarLg);
  body.insertAdjacentHTML("afterbegin", "<navbar-lg></navbar-lg>");
  document.addEventListener("click", (e) => {
    const navbar = document.querySelector("navbar-lg");
    if(!navbar.contains(e.target)) {
      navbar.shadowRoot.querySelector(".navbar-sm").style.left = "-100%"
    }
  })
})
