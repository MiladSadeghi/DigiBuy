import { navBarLg } from "/src/components/navbar.js";
import { basket } from "/src/components/basket.js";
const productID = new URLSearchParams(window.location.search).get('product');
const productImage = document.querySelector('.product-image img');
const productName = document.querySelector('.product-name');
const productPrice = document.querySelector('.product-price');
const productCategory = document.querySelector('.product-category');
const productFeatureList = document.querySelector('.product-feature ul');
const productSubPhoto = document.querySelector('.images');
const mainPhoto = document.querySelector('.main-photo');
const descriptionBody = document.querySelector("#description");
const specificationBody = document.querySelector("#specification");
const productBodyTabs = document.querySelectorAll('.product-stuff-tab');
const breadCrumb = document.querySelector('.breadcrumb');
const body = document.querySelector("body");
const addToCardBtn = document.querySelector('.add-to-card');
const loginForSubmitComment = document.querySelector('.denNLog');
const ratingList = document.querySelector('.rating');
const commentMessage = document.querySelector('.comment-text');
const commentSubmit = document.querySelector('.comment-submit');
let html = "";
let rate = 5;
document.addEventListener("DOMContentLoaded", async () => {
  let product = await getProduct(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product/${productID}.json`);
  console.log(product);
  
  window.customElements.define("navbar-lg", navBarLg);
  body.insertAdjacentHTML("afterbegin", "<navbar-lg></navbar-lg>");
  const navbar = document.querySelector("navbar-lg");
  let basketClass = new basket();
  basketClass.addToCardBtn = addToCardBtn;
  basketClass.basketElementID = navbar.shadowRoot.querySelector("#basket");
  basketClass.getUser();

  document.addEventListener("click", (e) => {
    const navbar = document.querySelector("navbar-lg");
    if(!navbar.contains(e.target)) {
      navbar.shadowRoot.querySelector(".navbar-sm").style.left = "-100%"
    }
  })
  productSubPhoto.innerHTML = product.productPhoto.map((photo, index) => `<div class="p-1 d-flex align-items-center justify-content-center"><img class="w-100" src="${photo.replace(`")`, "")}"></div>`).join("");

  mainPhoto.innerHTML = product.productPhoto.map(photo => `<img class="w-100" src="${photo.replace(`")`, "")}">`).join("");
  
  productSubPhoto.innerHTML += '<div DONT class="slider border-primary"></div>';

  productName.innerHTML = product.productName;

  document.title = `DigiBuy - ${product.productName.slice(0, product.productName.indexOf(","))}`;

  productPrice.innerHTML = `$${product.productPrice}`;

  productCategory.innerHTML = `<strong>Category: </strong><p class="ms-2 d-inline text-muted">${product.productCategory}, ${product.productSubCategory}</p>`;

  productFeatureList.innerHTML = product.productFeature.map((feature, index) =>
    `<li class="${index !== 0 ? "mt-2" : ""}"><div class="d-flex"><p class="fw-bold fs-6">${feature.title}:</p><p class="ms-2 fs-6 text-muted">${feature.discription}</p></div></li>`)
    .join('');
  
  addToCardBtn.addEventListener("click", ()=> {
    basketClass.addToBasket(product.productID);
  });
  
  imageSlider();

  productBodyTabs.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      let body = document.querySelector(e.target.getAttribute("show"));
      if (body.classList.contains("d-none")) {
        element.classList.add("active-tab")
        body.classList.remove("d-none");
        productBodyTabs.forEach((element, index) => {
          if (element !== e.target) {
            document.querySelector(element.getAttribute("show")).classList.add("d-none");
            element.classList.remove("active-tab");
          }
        })
      }
    })
  })

  descriptionBody.innerHTML = product.productDescription;
  product.productSpecification.forEach((element, index) => {
    html += `<div class="d-flex"><p class="fw-bold fs-6">${element.title}:</p><p class="ms-2 fs-6 text-muted">${element.discription}</p></div>
    ${product.productSpecification.length - 1 !== index ? "<hr>" : ""}`;
    }
  );
  specificationBody.innerHTML = html;
  
  breadCrumb.innerHTML += `<li class="breadcrumb-item text-capitalize"><a href="#">${product.productCategory}</a></li><li class="breadcrumb-item active text-capitalize">${product.productName}</li>`

  if(basketClass.db !== "guest") {
    loginForSubmitComment.classList.add("d-none");
  }

  ratingList.addEventListener("click", (event)=> {
    if(event.target.classList.contains("rating-item")) {
      ratingList.innerHTML = "";
      let rateValue = event.target.getAttribute("data-rate");
      rate = rateValue;
      for (let index = 1; index <= 5; index++) {
        if(index <= rate) {
          ratingList.innerHTML += `<li class="rating-item fill-star me-1" data-rate="${index}"></li>`;
        } else {
          ratingList.innerHTML += `<li class="rating-item empty-star me-1" data-rate="${index}"></li>`;
        }
      }
    }
  })
})

async function getProduct(api) {
  let response = await fetch("https://cors.miladsdgh.ir/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      urlToGet: api,
      Params: "none"
    })
  });
  return response.json();
}

function imageSlider() {
  const productPhotos = document.querySelectorAll('.images div')
  const slider = document.querySelector('.slider');
  slider.style.width = productPhotos[0].getBoundingClientRect().width + "px";
  productPhotos.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      if (!e.target.hasAttribute("DONT")) {
        slider.style.left = (productPhotos[0].getBoundingClientRect().width) * index + "px";
        mainPhoto.scrollLeft = (mainPhoto.children[0].getBoundingClientRect().width) * index;
      }
    })
  })
}

