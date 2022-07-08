const showUserBtn = document.querySelector(".user-check");
const searchBox = document.querySelector(".search-box");
const searchBarInput = document.querySelector(".searchbar-input input");
const searchBar = document.querySelector(".searchbar-input");
const searchResult = document.querySelector(".searching-result");
const searchResultList = document.querySelector(".searching-result .res");
const searchByResult = document.querySelector(".by-result");
const searchByCategory = document.querySelector(".by-category");
const searchByTag = document.querySelector(".by-tag");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const categoryHead = document.querySelector(".category-head h2");
const category = document.querySelector(".category");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navBar = document.querySelector(".navbar");
const navbarResponsive = document.querySelector(".navbar-sm")
const bgLoad = document.querySelector(".bg-load");
let user;
let product;

document.addEventListener("DOMContentLoaded", async () => {
  await loadUser();
  await loadProduct();
  window.addEventListener("resize", responsiveCategory);
  responsiveCategory(window.matchMedia("(max-width: 1024px)"));
  searchBox.addEventListener("click", (e) => {
    searchBar.style.opacity = "1";
    searchBarInput.focus();
  })
  document.addEventListener("click", (e) => {
    if (!navbarResponsive.contains(e.target)) {
      navbarResponsive.style.left = "-100%";
    }
    if (e.target !== searchBarInput) {
      searchBar.style.opacity = "0";
    }
    if (e.target.classList.contains("log-out-btn")) {
      logOut();
    }
  }, true)
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("user-menu-btn")) {
      let userMenu = document.querySelector(".user-menu");
      userMenu.classList.toggle("d-none");
    }
  })

  searchBarInput.addEventListener("keyup", searching)
  searchByResult.addEventListener("scroll", (e) => {
    if (searchByResult.scrollLeft !== 0) {
      leftArrow.classList.remove("d-none");
    } else {
      leftArrow.classList.add("d-none");
    }
    if (searchByResult.scrollLeft !== (searchByResult.scrollWidth - searchByResult.clientWidth)) {
      rightArrow.classList.remove("d-none");
    } else {
      rightArrow.classList.add("d-none");
    }
  })
  searchResult.addEventListener("click", async (event) => {
    if (event.target.classList.contains("right-arrow")) {
      searchByResult.scrollLeft += 234;
    }
    if (event.target.classList.contains("left-arrow")) {
      searchByResult.scrollLeft -= 234;
    }
  })
  hamburgerMenu.addEventListener("click", (e) => {
    navbarResponsive.style.left = "0";
  })
  console.log(user);
  console.log(product);
})

async function loadUser() {
  let userCookie = Object.fromEntries(document.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent)));
  try {
    let userData = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${userCookie.userTable}.json`);
    if (!userData.ok) {
      throw new Error();
    }
    user = await userData.json();
    user["profileID"] = userCookie.userTable;
    showUserBtn.innerHTML = `<a id="login" type="button" href="#" class="yes-login btn btn-primary py-0"><i class="bi bi-person"></i> <i class="bi bi-caret-down-fill"></i><input class="position-absolute user-menu-btn" type="checkbox"></a><div class="rounded position-absolute user-menu d-none border-primary fw-bold"><a href="#" class="d-flex p-4 rounded">${user.userName} <i class="ms-auto bi bi-chevron-right"></i></a><hr class="m-0">
    <a href="#" class="d-flex px-3 py-3 btm-b"><i class="bi bi-bag me-2"></i>Orders</a><a href="#" class="d-flex px-3 py-3 btm-b"><i class="bi bi-suit-heart me-2"></i></i>Favorites</a><a href="#" class="d-flex px-3 py-3 btm-b"><i class="bi bi-chat-left-text me-2"></i>Comments</a><a href="#" class="log-out-btn d-flex px-3 py-3 rounded-bottom"><i class="bi bi-box-arrow-left me-2"></i>Log Out</a></div></div>`;
  } catch (error) {
    showUserBtn.innerHTML = `<a id="login" type="button" href="./login/" class="no-login btn btn-primary py-0"><i style="font-size: 1.5rem;" class="bi bi-box-arrow-in-right"></i>&nbsp;&nbsp; Login&nbsp; | &nbsp;Register</a>`
  }
}

async function loadProduct() {
  let response = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json`);
  product = await response.json();
}

function searching(e) {
  let searchValue = e.target.value.toLowerCase();
  let [tagProduct, tagProduct1, subCategoryProduct, productElement, subProductElement, tagProductElement] = [[], [], [], [], [], [], []];
  for (let [key, value] of Object.entries(product)) {
    for (let [tag] in value.productTags) {
      if (value.productTags[tag].toLowerCase().includes(searchValue) && (!tagProduct.includes(value) && !tagProductElement.includes(tag))) {
        tagProduct.push(value);
        tagProduct1.push(value.productTags[tag])
      }
    }
    if (value["productSubCategory"].toLowerCase().includes(searchValue) && subCategoryProduct.every(elem => [value.productSubCategory, value.productCategory].includes(elem))) {
      subCategoryProduct.push([value.productSubCategory, value.productCategory]);
    }
  }
  tagProduct.forEach(item => {
    productElement.push(`<div class="d-flex py-2 px-1 me-3 rounded justify-content-center search-product border border-secondary-50"><img class="me-2" src="${item.productPhoto[0]}"><div class="m-auto"><p>${item.productName}</p></div></div>`)
  })
  subCategoryProduct.forEach(item => {
    subProductElement.push(`<a href="#" class="mt-2 b-c"><h5 class="fs-6 mb-1">${item[0]}</h5><p>In <span class="text-primary">${item[1]}</span> Category</p></a>`)
  })
  tagProduct1.slice(0, 4).forEach((item) => {
    tagProductElement.push(`<div class="py-3"><a href="#" class="fs-6 d-flex align-items-center justify-content-center"><i class="text-muted bi bi-search me-2"></i>${item}<i class="ms-auto bi bi-arrow-up-left"></i></a></div>`)
  })
  searchResultList.children[0].innerHTML = productElement.join("");
  searchByCategory.innerHTML = subProductElement.join("");
  searchByTag.innerHTML = tagProductElement.join("");
  searchResult.style.paddingTop = "55px";
  searchResult.classList.remove("mh-100");
  if (searchByResult.scrollWidth === searchByResult.clientWidth) {
    rightArrow.classList.add("d-none");
  } else {
    rightArrow.classList.remove("d-none");
  }
}

function logOut() {
  document.cookie = "userTable=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.reload();
}

export function responsiveCategory(e) {
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;
  navbarResponsive.innerHTML = "";
  if (w >= 1024) {
    category.innerHTML = `<div class="container sc2 d-none">
    <div class="w-100 position-relative" style="z-index: 2;">
      <div class="position-absolute w-100 bg-white rounded-bottom" style="height: 70vh;">
        <div class="d-flex w-100">
          <div class="category-items">
            <div class="category-item" category="digital">
              <a href="#">
                <span>Digital</span>
              </a>
            </div>
            <div class="category-item" category="clothing">
              <a href="#">
                <span>Clothing</span>
              </a>
            </div>
            <div class="category-item" category="health">
              <a href="#">
                <span>Health</span>
              </a>
            </div>
            <div class="category-item" category="sport">
              <a href="#">
                <span>Sport</span>
              </a>
            </div>
            <div class="category-item" category="travel">
              <a href="#">
                <span>Travel</span>
              </a>
            </div>
            <div class="category-item" category="home">
              <a href="#">
                <span>Home</span>
              </a>
            </div>
            <div class="category-item" category="book">
              <a href="#">
                <span>Book</span>
              </a>
            </div>
            <div class="category-item" category="stationery">
              <a href="#">
                <span>Stationery</span>
              </a>
            </div>
          </div>
          <div class="category-res w-100 p-3"></div>
        </div>
      </div>
    </div>
  </div>`
    const categoryResult = document.querySelector(".category-res");
    const subCategory = document.querySelector(".sc2");
    document.querySelectorAll(".category-item").forEach((element) => {
      element.addEventListener("mouseenter", (event) => {
        switch (event.target.getAttribute("category")) {
          case "digital":
            categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Digital Product <i class="bi bi-chevron-right ms-2"></i></a>
          <ul class="list-unstyled mt-2 category-list">
          <li class="fw-bold position-relative"><a class="" href="#">Accessories</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Mobile Phone</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Smart Watch</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Computer</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Laptop</a></li>
          </ul>`;
            break;
          case "clothing":
            categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Clothing Products<i class="bi bi-chevron-right ms-2"></i></a>
          <ul class="list-unstyled mt-2 category-list">
          <li class="mt-3 fw-bold position-relative"><a href="#">Men</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Women</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Kids</a></li>
          </ul>`;
            break;
          case "health":
            categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Health Products<i class="bi bi-chevron-right ms-2"></i></a>
          <ul class="list-unstyled mt-2 category-list">
          <li class="mt-3 fw-bold position-relative"><a href="#">Shampoo</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Skin Cream</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Oral Health</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Skin Care</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Face Makeup</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Hairdressing</a></li>
          </ul>`;
            break;
          case "sport":
            categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Sports Products<i class="bi bi-chevron-right ms-2"></i></a>
            <ul class="list-unstyled mt-2 category-list">
            <li class="mt-3 fw-bold position-relative"><a href="#">Sports Watch</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Bodybuilding</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Mountaineering</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Sporting Goods</a></li>
            </ul>`;
            break;
          case "travel":
            categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Travel Products<i class="bi bi-chevron-right ms-2"></i></a>
            <ul class="list-unstyled mt-2 category-list">
            <li class="mt-3 fw-bold position-relative"><a href="#">Suitcases and Bags</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Tent</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Underlay</a></li>
            </ul>`;
            break;
          case "home":
            categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Home Products<i class="bi bi-chevron-right ms-2"></i></a>
            <ul class="list-unstyled mt-2 category-list">
            <li class="mt-3 fw-bold position-relative"><a href="#">Video and Audio</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Decorative</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Electrical Appliances</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Kitchen</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Detergents</a></li>
            </ul>`;
            break;
          case "book":
            categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Books Products<i class="bi bi-chevron-right ms-2"></i></a>
              <ul class="list-unstyled mt-2 category-list">
              <li class="mt-3 fw-bold position-relative"><a href="#">Book and Magazine</a></li>
              <li class="mt-3 fw-bold position-relative"><a href="#">Audio Book</a></li>
              </ul>`;
            break;
          case "stationery":
            categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Stationery Products<i class="bi bi-chevron-right ms-2"></i></a>
              <ul class="list-unstyled mt-2 category-list">
              <li class="mt-3 fw-bold position-relative"><a href="#">Stationery</a></li>
              <li class="mt-3 fw-bold position-relative"><a href="#">Painting Tools</a></li>
              </ul>`;
            break;
        }
      })
    })
    categoryHead.addEventListener("mouseenter", (e) => {
      subCategory.classList.toggle("d-none", subCategory.classList.contains("d-flex"));
      subCategory.classList.toggle("d-flex", subCategory.classList.contains("d-none"));
      bgLoad.style.opacity = 1;
      bgLoad.style.zIndex = 1;
    }, false);
    subCategory.addEventListener("mouseleave", (e) => {
      subCategory.classList.toggle("d-none", !subCategory.classList.contains("d-none"));
      bgLoad.style.opacity = 0;
      bgLoad.style.zIndex = 0;
    });
  } else if (w < 1024) {
    category.innerHTML = "";
    navbarResponsive.innerHTML = `    <div class="accordion accordion-flush" id="accordionFlushExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingOne">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#first"
          aria-expanded="false" aria-controls="first">
          Digital
        </button>
      </h2>
      <div id="first" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Accessories</a></div>
        <div class="accordion-body"><a href="#">Mobile phone</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Smart watch</a></div>
        <div class="accordion-body"><a href="#">Computer</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Laptop</a></div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingTwo">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#second"
          aria-expanded="false" aria-controls="second">
          Clothing
        </button>
      </h2>
      <div id="second" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Men</a></div>
        <div class="accordion-body"><a href="#">Women</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Baby</a></div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingThree">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#third"
          aria-expanded="false" aria-controls="third">
          Health
        </button>
      </h2>
      <div id="third" class="accordion-collapse collapse" aria-labelledby="flush-headingThree"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Shampoo</a></div>
        <div class="accordion-body"><a href="#">Skin Cream</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Oral Health</a></div>
        <div class="accordion-body"><a href="#">Skin Care</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Face Makeup</a></div>
        <div class="accordion-body"><a href="#">Hairdressing</a></div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingTwo">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#fourth"
          aria-expanded="false" aria-controls="fourth">
          Sport
        </button>
      </h2>
      <div id="fourth" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Sports Watch</a></div>
        <div class="accordion-body"><a href="#">Bodybuilding</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Sporting Goods</a></div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingTwo">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#fifth"
          aria-expanded="false" aria-controls="fifth">
          Travel
        </button>
      </h2>
      <div id="fifth" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Suitcases and Bags</a></div>
        <div class="accordion-body"><a href="#">Tent</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Underlay</a></div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingTwo">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sixth"
          aria-expanded="false" aria-controls="sixth">
          Home
        </button>
      </h2>
      <div id="sixth" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Video and Audio</a></div>
        <div class="accordion-body"><a href="#">Decorative</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Electrical Appliances</a></div>
        <div class="accordion-body"><a href="#">Kitchen</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Detergents</a></div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingTwo">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#seventh"
          aria-expanded="false" aria-controls="seventh">
          Book
        </button>
      </h2>
      <div id="seventh" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body"><a href="#">Book and Magazine</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Audio Book</a></div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingTwo">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#eighth"
          aria-expanded="false" aria-controls="eighth">
          Stationery
        </button>
      </h2>
      <div id="eighth" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
        data-bs-parent="#accordionFlushExample">
        <div class="accordion-body"><a href="#">Stationery</a></div>
        <div class="accordion-body bg-dark bg-opacity-25"><a href="#">Painting Tools</a></div>
      </div>
    </div>
  </div>`
  }
}