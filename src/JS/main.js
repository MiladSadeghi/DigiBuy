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
let user;
let product;

document.addEventListener("DOMContentLoaded", async () => {
  await loadUser();
  await loadProduct();
  searchBox.addEventListener("click", (e) => {
    searchBar.style.opacity = "1";
    searchBarInput.focus();
  })
  document.addEventListener("click", (e)=> {
    if(e.target !== searchBarInput) {
      searchBar.style.opacity = "0";
    }
    if(e.target.classList.contains("log-out-btn")) {
      logOut();
    }
  }, true)
  document.addEventListener("change", (e)=> {
    if(e.target.classList.contains("user-menu-btn")) {
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
  tagProduct1.slice(0,4).forEach((item) => {
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