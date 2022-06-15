const dropDownMenu = document.querySelector('.dropdown');
const dropDownMenuOption = document.querySelector('.option');
const menuBtnArrow = document.querySelectorAll(".show-list");
const menuBtnDrowDown = document.querySelectorAll(".dropdown1");
const profileArrow = document.querySelectorAll(".profile-arrow");
const profileBtn = document.querySelector("#profile-name");
const showMenu = document.querySelector("#showMegaMenu");
const category = document.querySelector(".category");
const mainBody = document.querySelector(".main-body");

document.addEventListener("DOMContentLoaded", () => {
  dropDownMenu.addEventListener('click', (element) => {
    profileBtn.children[0].classList.toggle('rotateArrow');
    dropDownMenuOption.classList.toggle('active');
  })

  menuBtnArrow.forEach((element, index) => {
    element.addEventListener('click', (e) => {
      profileArrow[index].classList.toggle('rotateArrow');
      menuBtnDrowDown[index].classList.toggle("show");

    });
  })

  showMenu.addEventListener("change", (e) => {
    if (showMenu.checked) {
      category.style.left = "-100%";
      mainBody.classList.toggle("col-md-9");
    } else {
      category.style.left = "0";
      mainBody.classList.toggle("col-md-9");
    }
  })

  category.addEventListener("click", (e) => {
    console.log(e.target.getAttribute("add"));
    switch (e.target.getAttribute("add")) {
      case "user":
        userAdd();
        break;
      case "product":
        productAdd(e);
        break;
    }
  })
})

function productAdd(event) {
  mainBody.innerHTML = `<div class="product"><div class="d-flex pr-na"><input placeholder="Product Name" type="text" class="form-control shadow-lg" id="product-name-add"></div><div class="d-flex pr-mo"><input placeholder="Product Model" type="text" class="form-control shadow-lg" id="product-model-add"></div><div class="d-flex w-100 pr-fe"><ul class="mb-0 list-unstyled w-100"><li class=""><input placeholder="feature" type="text" class="form-control w-100 shadow-lg" id="product-feature-li"></li><li class=""><input placeholder="feature" type="text" class="form-control w-100 shadow-lg" id="product-feature-li"></li><li class=""><input placeholder="feature" type="text" class="form-control w-100 shadow-lg" id="product-feature-li"></li><li class=""><input placeholder="feature" type="text" class="form-control w-100 shadow-lg" id="product-feature-li"></li><li class=""><input placeholder="feature" type="text" class="form-control w-100 shadow-lg" id="product-feature-li"></li></ul></div><div class="d-flex pr-ph"><div class="d-flex fs-2 rounded shadow-lg align-items-center justify-content-evenly"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" fill="currentColor"class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /></svg><svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" /></svg></div><div class="d-flex fs-2 rounded shadow-lg align-items-center justify-content-evenly"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" fill="currentColor"class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /></svg><svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" /></svg></div><div class="d-flex fs-2 rounded shadow-lg align-items-center justify-content-evenly"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /></svg><svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" fill="currentColor"class="bi bi-dash-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" /></svg></div></div><div class="d-flex pr-di"><textarea class="form-control shadow-lg" placeholder="Discription" style="resize: none;" id="product-discription-add" cols="20" rows="5"></textarea></div><div class="d-flex pr-br"><input placeholder="Brand" type="text" class="form-control w-100 shadow-lg" id="product-brand-add"></div><div class="d-flex pr-pr"><input placeholder="Price" type="text" class="form-control w-100 shadow-lg" id="product-price-add"></div></div>`;
}