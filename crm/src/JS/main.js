import { addProduct } from "../components/Product/Add/addProduct.js";
import { searchProduct } from "../components/Product/Search/searchProduct.js";

const dropDownMenu = document.querySelector('.dropdown');
const dropDownMenuOption = document.querySelector('.option');
const menuBtnArrow = document.querySelectorAll(".show-list");
const menuBtnDropDown = document.querySelectorAll(".dropdown1");
const profileArrow = document.querySelectorAll(".profile-arrow");
const profileBtn = document.querySelector("#profile-name");
const profileBtnSpan = document.querySelector("#profile-name span");
const showMenu = document.querySelector("#showMegaMenu");
const category = document.querySelector(".category");
const mainBody = document.querySelector(".main-body");
let crmUser;
document.addEventListener("DOMContentLoaded", (e) => {
  loadUser();
  window.customElements.define('add-product', addProduct);
  window.customElements.define('search-product', searchProduct);
  dropDownMenu.addEventListener('click', (element) => {
    profileBtn.children[0].classList.toggle('rotateArrow');
    dropDownMenuOption.classList.toggle('active');
  })
  menuBtnArrow.forEach((element, index) => {
    element.addEventListener('click', (e) => {
      profileArrow[index].classList.toggle('rotateArrow');
      menuBtnDropDown[index].classList.toggle("show-menu");
    });
  })

  showMenu.addEventListener("change", (e) => {
    if (showMenu.checked) {
      category.style.left = "-100%";
      mainBody.classList.toggle("col-md-10");
    } else {
      category.style.left = "0";
      mainBody.classList.toggle("col-md-10");
    }
  })

  category.addEventListener("click", (e) => {
    switch (e.target.getAttribute("add")) {
      case "user":
        userAdd();
        break;
      case "product":
        mainBody.innerHTML = `<add-product></add-product>`;
        break;
    }
    switch (e.target.getAttribute("searching")) {
      case "product":
        mainBody.innerHTML = `<search-product></search-product>`;
        break;
    }
  })
})

async function loadUser() {
  let userCookie = Object.fromEntries(document.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent)));
  try {
    let userData = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${userCookie.userTable}.json`);
    if (!userData.ok) {
      throw new Error();
    }
    crmUser = await userData.json();
    crmUser["profileID"] = userCookie.userTable;
    profileBtnSpan.innerHTML = crmUser["userName"];
  } catch (error) {
    document.querySelector(".should-refresh").style.display = "flex";
  }

}

export { crmUser };