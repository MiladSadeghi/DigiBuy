import {basket} from "./basket.js"
const template = document.createElement('template');
template.innerHTML = `
<nav class="navbar position-relative">
<div class="container-md position-relative">
  <div class="navbar-res w-100 align-items-center">
    <div class="d-flex le-ga">
      <h1 id="logo" class="mb-0">DigiBuy</h1>
    </div>
    <i class="bi bi-list text-muted hamburger-menu"></i>
    <div id="search" class="d-flex">
      <div class="search-box w-75 text-light position-relative">
        <div class="searchbar-div rounded-3 bg-primary bg-opacity-50">
          <i class="bi bi-search"></i>
          <span class="ms-2">Search...</span>
        </div>
        <div class="searchbar-input">
          <input type="text" placeholder="Search..." class="form-control">
          <div class="bg-white rounded text-black border-primary searching-result px-2 mh-100">
            <div class="res position-relative">
              <div class="by-result"></div>
              <div class="position-absolute right-arrow d-none"></div>
              <div class="position-absolute left-arrow d-none"></div>
            </div>
            <hr>
            <div class="by-category"></div>
            <hr>
            <div class="by-tag"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex align-items-center lo-bt ms-auto">
      <div class="user-check position-relative">
        <button class="btn btn-primary" type="button" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="visually-hidden">Loading...</span>
        </button>
      </div>
      <span class="roller mx-3"></span>
      <a id="basket" type="button" class="btn btn-primary position-relative"><i class="bi bi-cart"></i></a>
    </div>
    <div class="mt-2 position-relative category-head">
      <h2 class="">Category</h2>
    </div>
  </div>
</div>
</nav>
<div class="navbar-sm border-end border-3">
  <ul id="accordion" class="p-0">
    <li>
      <label for="digital">Digital</label>
      <input type="radio" id="digital" name="accordion">
      <div class="content">
        <a href="#">Accessories</a>
        <a href="#">Mobile Phone</a>
        <a href="#">Smart Watch</a>
        <a href="#">Computer</a>
        <a href="#">Laptop</a>
      </div>
    </li>
    <li>
      <label for="clothing">Clothing</label>
      <input type="radio" id="clothing" name="accordion">
      <div class="content">
        <a href="#">Men</a>
        <a href="#">Women</a>
        <a href="#">Kids</a>
      </div>
    </li>
    <li>
      <label for="health">Health</label>
      <input type="radio" id="health" name="accordion">
      <div class="content">
        <a href="#">Shampoo</a>
        <a href="#">Skin Cream</a>
        <a href="#">Skin Care</a>
        <a href="#">Face Makeup</a>
        <a href="#">Hairdressing</a>
      </div>
    </li>
    <li>
      <label for="sport">Sport</label>
      <input type="radio" id="sport" name="accordion">
      <div class="content">
        <a href="#">Sports Watch</a>
        <a href="#">Bodybuilding</a>
        <a href="#">Mountaineering</a>
        <a href="#">Sporting Goods</a>
      </div>
    </li>
    <li>
      <label for="travel">Travel</label>
      <input type="radio" id="travel" name="accordion">
      <div class="content">
        <a href="#">Suitcases and Bags</a>
        <a href="#">Tent</a>
        <a href="#">Underlay</a>
      </div>
    </li>
    <li>
      <label for="home">Home</label>
      <input type="radio" id="home" name="accordion">
      <div class="content">
        <a href="#">Video and Audio</a>
        <a href="#">Decorative</a>
        <a href="#">Electrical Appliances</a>
        <a href="#">Kitchen</a>
        <a href="#">Detergents</a>
      </div>
    </li>
    <li>
      <label for="book">Book</label>
      <input type="radio" id="book" name="accordion">
      <div class="content">
        <a href="#">Book and Magazine</a>
        <a href="#">Audio Book</a>
      </div>
    </li>
    <li>
      <label for="stationery">Stationery</label>
      <input type="radio" id="stationery" name="accordion">
      <div class="content">
        <a href="#">Stationery</a>
        <a href="#">Painting Tools</a>
      </div>
    </li>
  </ul>
</div>
<div class="category">
<div class="container sc2 d-none">
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
</div>
</div>
</div>
<div class="content position-relative">
<div class="bg-load"></div>
</div>
`;

class navBarLg extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/src/components/navbar.css">
    <script defer src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.showUserBtn = this.shadowRoot.querySelector(".user-check");
    this.searchBox = this.shadowRoot.querySelector(".search-box");
    this.searchBarInput = this.shadowRoot.querySelector(".searchbar-input input");
    this.searchBar = this.shadowRoot.querySelector(".searchbar-input");
    this.searchResult = this.shadowRoot.querySelector(".searching-result");
    this.searchResultList = this.shadowRoot.querySelector(".searching-result .res");
    this.searchByResult = this.shadowRoot.querySelector(".by-result");
    this.searchByCategory = this.shadowRoot.querySelector(".by-category");
    this.searchByTag = this.shadowRoot.querySelector(".by-tag");
    this.leftArrow = this.shadowRoot.querySelector(".left-arrow");
    this.rightArrow = this.shadowRoot.querySelector(".right-arrow");
    this.categoryHead = this.shadowRoot.querySelector(".category-head h2");
    this.category = this.shadowRoot.querySelector(".category");
    this.categoryResult = this.shadowRoot.querySelector(".category-res");
    this.subCategory = this.shadowRoot.querySelector(".sc2");
    this.categoryItems = this.shadowRoot.querySelectorAll(".category-item");
    this.hamburgerMenu = this.shadowRoot.querySelector(".hamburger-menu");
    this.bgLoad = this.shadowRoot.querySelector(".bg-load");
    this.navbarSm = this.shadowRoot.querySelector(".navbar-sm");
    this.basket = this.shadowRoot.querySelector("#basket");
    this.user;
    this.product;
  }

  searching = (e) => {
    let searchValue = e.target.value.toLowerCase();
    let [tagProduct, tagProduct1, subCategoryProduct, productElement, subProductElement, tagProductElement] = [[], [], [], [], [], [], []];
    for (let [key, value] of Object.entries(this.product)) {
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
    this.searchResultList.children[0].innerHTML = productElement.join("");
    this.searchByCategory.innerHTML = subProductElement.join("");
    this.searchByTag.innerHTML = tagProductElement.join("");
    this.searchResult.style.paddingTop = "55px";
    this.searchResult.classList.remove("mh-100");
    if (this.searchByResult.scrollWidth === this.searchByResult.clientWidth) {
      this.rightArrow.classList.add("d-none");
    } else {
      this.rightArrow.classList.remove("d-none");
    }
  }

  loadUser = async () => {
    let userCookie = Object.fromEntries(document.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent)));
    try {
      let userData = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${userCookie.userTable}.json`);
      if (!userData.ok) {
        throw new Error();
      }
      this.user = await userData.json();
      this.user["profileID"] = userCookie.userTable;
      this.showUserBtn.innerHTML = `<a id="/login" type="button" href="#" class="yes-login btn btn-primary py-0"><i class="bi bi-person"></i> <i class="bi bi-caret-down-fill"></i><input class="position-absolute user-menu-btn" type="checkbox"></a><div class="rounded position-absolute user-menu d-none border-primary fw-bold"><a href="#" class="d-flex p-4 rounded">${this.user.userName} <i class="ms-auto bi bi-chevron-right"></i></a><hr class="m-0">
      <a href="#" class="d-flex px-3 py-3 btm-b"><i class="bi bi-bag me-2"></i>Orders</a><a href="#" class="d-flex px-3 py-3 btm-b"><i class="bi bi-suit-heart me-2"></i></i>Favorites</a><a href="#" class="d-flex px-3 py-3 btm-b"><i class="bi bi-chat-left-text me-2"></i>Comments</a><a href="#" class="log-out-btn d-flex px-3 py-3 rounded-bottom"><i class="bi bi-box-arrow-left me-2"></i>Log Out</a></div></div>`;
      this.shadowRoot.querySelector(".user-menu-btn").addEventListener("change", (e) => {
        let userMenu = this.shadowRoot.querySelector(".user-menu");
        userMenu.classList.toggle("d-none");
      })
      this.shadowRoot.querySelector(".log-out-btn").addEventListener("click", (e) => {
        this.logOut();
      })
    } catch (error) {
      this.showUserBtn.innerHTML = `<a id="login" type="button" href="/login/" class="no-login btn btn-primary py-0"><i style="font-size: 1.5rem;" class="bi bi-box-arrow-in-right"></i>&nbsp;&nbsp; Login&nbsp; | &nbsp;Register</a>`;
    }
  }

  loadProduct = async () => {
    let response = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json`);
    this.product = await response.json();
  }

  logOut = () => {
    document.cookie = "userTable=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  }

  async connectedCallback() {
    await this.loadUser();
    await this.loadProduct();
    console.log(this.user);
    let basketClass = new basket((this.user?.userName || null), this.basket);
    basketClass.createGuestCookie();
    basketClass.basketElementID = this.shadowRoot.querySelector("#basket");
    basketClass.getBasket();
    this.searchBox.addEventListener("click", (e) => {
      this.searchBar.style.opacity = "1";
      this.searchBarInput.focus();
    })
    this.shadowRoot.addEventListener("click", (e) => {
      if (e.target !== this.searchBarInput) {
        this.searchBar.style.opacity = "0";
      }
      if(!this.navbarSm.contains(e.target)) {
        this.navbarSm.style.left = "-100%";
      }
    }, true)
    this.searchBarInput.addEventListener("keyup", this.searching)
    this.searchByResult.addEventListener("scroll", (e) => {
      if (this.searchByResult.scrollLeft !== 0) {
        this.leftArrow.classList.remove("d-none");
      } else {
        this.leftArrow.classList.add("d-none");
      }
      if (this.searchByResult.scrollLeft !== (this.searchByResult.scrollWidth - this.searchByResult.clientWidth)) {
        this.rightArrow.classList.remove("d-none");
      } else {
        this.rightArrow.classList.add("d-none");
      }
    })
    this.searchResult.addEventListener("click", async (event) => {
      if (event.target.classList.contains("right-arrow")) {
        this.searchByResult.scrollLeft += 234;
      }
      if (event.target.classList.contains("left-arrow")) {
        this.searchByResult.scrollLeft -= 234;
      }
    })
    this.categoryItems.forEach((element) => {
      element.addEventListener("mouseenter", (event) => {
        switch (event.target.getAttribute("category")) {
          case "digital":
            this.categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Digital Product <i class="bi bi-chevron-right ms-2"></i></a>
          <ul class="list-unstyled mt-2 category-list">
          <li class="fw-bold position-relative"><a class="" href="#">Accessories</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Mobile Phone</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Smart Watch</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Computer</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Laptop</a></li>
          </ul>`;
            break;
          case "clothing":
            this.categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Clothing Products<i class="bi bi-chevron-right ms-2"></i></a>
          <ul class="list-unstyled mt-2 category-list">
          <li class="mt-3 fw-bold position-relative"><a href="#">Men</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Women</a></li>
          <li class="mt-3 fw-bold position-relative"><a href="#">Kids</a></li>
          </ul>`;
            break;
          case "health":
            this.categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Health Products<i class="bi bi-chevron-right ms-2"></i></a>
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
            this.categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Sports Products<i class="bi bi-chevron-right ms-2"></i></a>
            <ul class="list-unstyled mt-2 category-list">
            <li class="mt-3 fw-bold position-relative"><a href="#">Sports Watch</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Bodybuilding</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Mountaineering</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Sporting Goods</a></li>
            </ul>`;
            break;
          case "travel":
            this.categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Travel Products<i class="bi bi-chevron-right ms-2"></i></a>
            <ul class="list-unstyled mt-2 category-list">
            <li class="mt-3 fw-bold position-relative"><a href="#">Suitcases and Bags</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Tent</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Underlay</a></li>
            </ul>`;
            break;
          case "home":
            this.categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Home Products<i class="bi bi-chevron-right ms-2"></i></a>
            <ul class="list-unstyled mt-2 category-list">
            <li class="mt-3 fw-bold position-relative"><a href="#">Video and Audio</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Decorative</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Electrical Appliances</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Kitchen</a></li>
            <li class="mt-3 fw-bold position-relative"><a href="#">Detergents</a></li>
            </ul>`;
            break;
          case "book":
            this.categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Books Products<i class="bi bi-chevron-right ms-2"></i></a>
              <ul class="list-unstyled mt-2 category-list">
              <li class="mt-3 fw-bold position-relative"><a href="#">Book and Magazine</a></li>
              <li class="mt-3 fw-bold position-relative"><a href="#">Audio Book</a></li>
              </ul>`;
            break;
          case "stationery":
            this.categoryResult.innerHTML = `<a href="#" class="category-head d-flex align-items-center">All Stationery Products<i class="bi bi-chevron-right ms-2"></i></a>
              <ul class="list-unstyled mt-2 category-list">
              <li class="mt-3 fw-bold position-relative"><a href="#">Stationery</a></li>
              <li class="mt-3 fw-bold position-relative"><a href="#">Painting Tools</a></li>
              </ul>`;
            break;
        }
      })
    })
    this.categoryHead.addEventListener("mouseenter", (e) => {
      this.subCategory.classList.toggle("d-none", this.subCategory.classList.contains("d-flex"));
      this.subCategory.classList.toggle("d-flex", this.subCategory.classList.contains("d-none"));
      this.bgLoad.style.opacity = 1;
      this.bgLoad.style.zIndex = 1;
    }, false);
    this.subCategory.addEventListener("mouseleave", (e) => {
      this.subCategory.classList.toggle("d-none", !this.subCategory.classList.contains("d-none"));
      this.bgLoad.style.opacity = 0;
      this.bgLoad.style.zIndex = -1;
    });
    this.hamburgerMenu.addEventListener("click", (e) => {
      this.navbarSm.style.left = "0";
    })
  }
}

export { navBarLg };