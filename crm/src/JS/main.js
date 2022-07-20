import { addProduct } from "../components/Product/Add/addProduct.js";
import { searchProduct } from "../components/Product/Search/searchProduct.js";
import { editProduct } from "../components/Product/Edit/editProduct.js";
import { logReview } from "../components/Log/log.js";
import { commentReview } from "../components/Comment/comment.js";
import { userSearch } from "../components/User/Search/userSearch.js";
import { userManage } from "../components/User/Manage/userManage.js";
import { orderSearch } from "../components/Order/Search/orderSearch.js";

const dropDownMenuOption = document.querySelector('.option');
const menuBtnArrow = document.querySelectorAll(".show-list");
const menuBtnDropDown = document.querySelectorAll(".dropdown1");
const profileArrow = document.querySelectorAll(".profile-arrow");
const profileBtn = document.querySelector("#profile-name");
const profileBtnSpan = document.querySelector("#profile-name span");
const showMenu = document.querySelector("#showMegaMenu");
const category = document.querySelector(".category");
const mainBody = document.querySelector(".main-body");
const logBtn = document.querySelector("#log");
let crmUser;
document.addEventListener("DOMContentLoaded", (e) => {
  loadUser();
  window.customElements.define('add-product', addProduct);
  window.customElements.define('search-product', searchProduct);
  window.customElements.define('edit-product', editProduct);
  window.customElements.define('log-review', logReview);
  window.customElements.define('comments-review', commentReview);
  window.customElements.define('search-user', userSearch);
  window.customElements.define('manage-user', userManage);
  window.customElements.define('search-order', orderSearch);
  profileBtn.addEventListener('click', (element) => {
    profileBtn.children[0].classList.toggle('rotateArrow');
    dropDownMenuOption.classList.toggle('d-none');
    setTimeout(() => {
      dropDownMenuOption.classList.toggle('active');
    }, 50);
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
      case "product":
        mainBody.innerHTML = `<add-product></add-product>`;
        break;
    }
    switch (e.target.getAttribute("searching")) {
      case "product":
        mainBody.innerHTML = `<search-product></search-product>`;
        break;
      case "user":
        mainBody.innerHTML = `<search-user></search-user>`;
        break;
      case "order":
        mainBody.innerHTML = `<search-order></search-order>`;
        break;
    }
    switch (e.target.getAttribute("review")) {
      case "comment":
        mainBody.innerHTML = `<comments-review></comments-review>`;
        break;
    }
  })
  logBtn.addEventListener("click", (e) => {
    mainBody.innerHTML = `<log-review></log-review>`
  })
  
  document.addEventListener("click", (e)=> {
    if(e.target.tagName === "SEARCH-USER") {
      e.target.shadowRoot.addEventListener("click", (e2) => {
        e2.stopPropagation();
        if(e2.target.hasAttribute("manage-user")) {
          let userID = e2.target.getAttribute("manage-user");
          mainBody.innerHTML = `<manage-user user-id="${userID}"></manage-user>`;
        }
      });
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