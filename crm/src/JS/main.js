const dropDownMenu = document.querySelector('.dropdown');
const dropDownMenuOption = document.querySelector('.option');
const menuBtnArrow = document.querySelectorAll(".show-list");
const menuBtnDrowDown = document.querySelectorAll(".dropdown1");
const profileArrow = document.querySelectorAll(".profile-arrow");
const profileBtn = document.querySelector("#profile-name");
const profileBtnSpan = document.querySelector("#profile-name span");
const showMenu = document.querySelector("#showMegaMenu");
const category = document.querySelector(".category");
const mainBody = document.querySelector(".main-body");
let crmUser;
document.addEventListener("DOMContentLoaded", (e) => {
  loadUser();
  dropDownMenu.addEventListener('click', (element) => {
    profileBtn.children[0].classList.toggle('rotateArrow');
    dropDownMenuOption.classList.toggle('active');
  })
  menuBtnArrow.forEach((element, index) => {
    element.addEventListener('click', (e) => {
      profileArrow[index].classList.toggle('rotateArrow');
      menuBtnDrowDown[index].classList.toggle("show-menu");
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
    switch (e.target.getAttribute("add")) {
      case "user":
        userAdd();
        break;
      case "product":
        productAdd();
        break;
    }
  })

  mainBody.addEventListener("click", (e) => {
    product(e);
  })
})

function loadUser() {
  let userCookie = Object.fromEntries(document.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent)));
  (async () => {
    let userData = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${userCookie.userTable}.json`);
    crmUser = await userData.json();
    crmUser["profileID"] = userCookie.userTable;
    profileBtnSpan.innerHTML = crmUser["userName"];
    console.log(crmUser);
  })();
}

function product(e) {
  if (e.target.classList.contains("product-add-specification")) {
    e.stopPropagation();
    document.querySelector(".product-specification").parentElement.innerHTML += `<div class="input-group mt-2 product-specification">
    <input type="text" placeholder="title" class="form-control shadow-lg">
    <input type="text" placeholder="discription" class="form-control shadow-lg">
    <button class="btn btn-danger product-remove-specification" type="button"></button>
    </div>`
  }
  if (e.target.classList.contains("product-remove-specification")) {
    e.target.parentElement.remove();
  }
  if (e.target.classList.contains("bi-wrench-adjustable-circle")) {
    e.target.addEventListener("shown.bs.popover", (el) => {
      let button = document.querySelector(`#${el.target.getAttribute("aria-describedby")} button`);
      button.addEventListener("click", (ele) => {
        productPhotoContentType(ele.target.previousElementSibling.value).then(res => {
          if (res) {
            e.target.parentElement.style.background = `url(${ele.target.previousElementSibling.value})`;
            e.target.parentElement.style.backgroundColor = `#fff`;
          }
        })
      })
    })
  }
  if (e.target.classList.contains("add-photo-div")) {
    let photosList = document.querySelector(".pr-ph-ph");
    loadPopOver();
    if (photosList.childElementCount < 6) {
      photosList.innerHTML += `<div class="glass second-glass w-100 fs-4 rounded shadow-lg align-items-center justify-content-center"><i class="bi bi-dash-circle remove-photo-div"></i><a href="#" class="bi bi-wrench-adjustable-circle" data-bs-toggle="popover"></a></div>`
      loadPopOver();
    } else {
      loadPopOver();
    }
  }
  if (e.target.classList.contains("remove-photo-div")) {
    e.target.parentElement.remove();
    loadPopOver();
  }
}

function loadPopOver() {
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {
    container: 'body',
    title: 'Add Photo Link',
    html: true,
    placement: 'bottom',
    sanitize: false,
    content() {
      return document.querySelector('#PopoverContent').innerHTML;
    }
  }));
}

async function productPhotoContentType(get_url) {
  const response = await fetch(get_url);
  return response.headers.get('content-type').includes("image") ? true : false;
}

const uniqeID = () => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
};

function detectURLs(message) {
  let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return String(message.match(urlRegex));
}

async function postProduct(apiLink, body) {
  let response = await fetch(apiLink, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  let result = await response.json();
  return await result;
}

function addProduct(e) {
  e.preventDefault();
  let productCategory = document.querySelector("#product-category-add");
  let product = {
    timeAddProduct: new Date(),
    userAddProduct: [crmUser.userName, crmUser.profileID],
    productID: uniqeID(),
    comments: "",
    productName: document.querySelector("#product-name-add").value,
    productModel: document.querySelector("#product-model-add").value,
    productBrand: document.querySelector("#product-brand-add").value,
    productPrice: document.querySelector("#product-price-add").value,
    productDescription: document.querySelector("#product-description-add").value,
    productFeature: [],
    productSpecification: [],
    productPhoto: [],
  }
  let productAddLog = {
    time: new Date(),
    user: [crmUser.userName, crmUser.profileID],
    productID: product.productID,
    logID: uniqeID(),
    logType: "add product",
    category: productCategory.value,
    subCategory: productCategory.options[productCategory.selectedIndex].text,
  }
  product["productCategory"] = productCategory.value;
  product["productSubCategory"] = productCategory.options[productCategory.selectedIndex].text;
  document.querySelectorAll("#product-feature li").forEach(element => {
    if (element.children[0].value !== "" && element.children[1].value !== "") {
      product["productFeature"].push({
        title: element.children[0].value,
        discription: element.children[1].value
      })
    }
  });
  document.querySelectorAll(".product-specification").forEach(element => {
    if (element.children[0].value !== "" && element.children[1].value !== "") {
      product["productSpecification"].push({
        title: element.children[0].value,
        discription: element.children[1].value
      })
    }
  });
  document.querySelectorAll(".glass").forEach(element => {
    if (detectURLs(element.style.background)) {
      product["productPhoto"].push(detectURLs(element.style.background))
    }
  });
  let apiProduct = `https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product/${product.productID}.json`
  let apiLog = `https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/log/${productAddLog.logID}.json`
  postProduct(apiProduct, product);
  postProduct(apiLog, productAddLog);
}

function productAdd(event) {
  mainBody.innerHTML = `<form class="product" onsubmit="addProduct(event)">
  <div class="pr-na"><input placeholder="Product Name" type="text" class="form-control shadow-lg"
      id="product-name-add"></div>
  <div class="pr-mo"><input placeholder="Product Model" type="text" class="form-control shadow-lg"
      id="product-model-add"></div>
  <div class=" pr-fe">
    <ul class="mb-0 list-unstyled" id="product-feature">
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="feature" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="feature" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="feature" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="feature" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="feature" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="feature" type="text" class="form-control"></li>
    </ul>
  </div>
  <div class="d-flex pr-ph">
    <div class="glass pr-ph-main first-glass d-flex fs-2 rounded shadow-lg align-items-center justify-content-evenly">
    <i class="bi bi-plus-circle add-photo-div"></i>
      <a href="#" class="bi bi-wrench-adjustable-circle" data-bs-toggle="popover"></a>
    </div>
  </div>
  <div class="pr-ph-ph w-100">
  </div>
  <div class="d-flex pr-di"><textarea class="form-control shadow-lg" placeholder="Discription"
      style="resize: none;" id="product-description-add" cols="20" rows="5"></textarea></div>
  <div class="d-flex pr-br"><input placeholder="Brand" type="text" class="form-control w-100 shadow-lg"
      id="product-brand-add"></div>
  <div class="d-flex pr-pr"><input placeholder="Price" type="text" class="form-control w-100 shadow-lg"
      id="product-price-add"></div>
  <div class="pr-sp" >
    <div class="input-group product-specification">
      <input type="text" placeholder="title" class="form-control shadow-lg">
      <input type="text" placeholder="discription" class="form-control shadow-lg">
      <button class="btn btn-success product-add-specification" type="button"></button>
      <button class="btn btn-danger product-remove-specification" disabled type="button"></button>
    </div>
  </div>
  <div class="pr-ca">
    <select class="form-select" aria-label="Default select example" id="product-category-add">
      <option value="" disabled selected>Open this select menu</option>
      <option value="digital">Accessories</option>
      <option value="digital">Mobile phone</option>
      <option value="digital">Smart watch</option>
      <option value="digital">Computer accessories</option>
      <option value="digital">Laptop</option>
      <option value="clothing">Men clothing</option>
      <option value="clothing">Ladies clothing</option>
      <option value="clothing">Childish clothing</option>
      <option value="health">Shampoo</option>
      <option value="health">Skin cream</option>
      <option value="health">Oral health</option>
      <option value="health">Skin care</option>
      <option value="health">Skin care</option>
      <option value="health">Face makeup</option>
      <option value="health">Hairdressing</option>
      <option value="sport">Men's sportswear</option>
      <option value="sport">Women's sportswear</option>
      <option value="sport">Sports watch</option>
      <option value="sport">Bodybuilding</option>
      <option value="sport">Mountaineering</option>
      <option value="sport">Sporting goods</option>
      <option value="travel">Suitcases and bags</option>
      <option value="travel">Tent</option>
      <option value="travel">Underlayment</option>
      <option value="home">Video and Audio</option>
      <option value="home">Decorative</option>
      <option value="home">Carpet</option>
      <option value="home">Electrical appliances</option>
      <option value="home">Kitchen</option>
      <option value="home">Detergents</option>
      <option value="book">Book and magazine</option>
      <option value="book">Audio book</option>
      <option value="book">Paper</option>
      <option value="stationery">Stationery</option>
      <option value="stationery">Painting tools</option>
    </select>
    </div>
  <input id="submit-product" value="Add Product" type="submit" class="btn btn-success pr-su"></form>`;
  loadPopOver();
}