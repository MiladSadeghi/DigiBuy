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
const commentMessage = document.querySelector('#comment-text');
const commentSubmitBtn = document.querySelector('#submit-comment');
const cmSubmitSuccessAlert = document.querySelector('#scSCtch');
const cmSubmitDangerAlert = document.querySelector('#dnGCtch');
const showCommentDiv = document.querySelector('.comments');
const noCommentDiv = document.querySelector('.no-cm');
const reviewCounter = document.querySelectorAll('.review-counter');
const starCounter = document.querySelectorAll('.star-counter');
const overAll = document.querySelector('.over-all-counter');
const productSide = document.querySelector(".product-side");
const productLike = document.querySelector('.like');
const productUnLike = document.querySelector('.unlike');
let html = "";
let rate = 5;
document.addEventListener("DOMContentLoaded", async () => {
  let product = await (await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product/${productID}.json`)).json());
  let comments = await (await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/comments.json`)).json());
  let users = await (await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users.json`)).json());
  
  window.customElements.define("navbar-lg", navBarLg);
  body.insertAdjacentHTML("afterbegin", "<navbar-lg></navbar-lg>");
  const navbar = document.querySelector("navbar-lg");
  let basketClass = new basket();
  basketClass.addToCardBtn = addToCardBtn;
  basketClass.basketElementID = navbar.shadowRoot.querySelector("#basket");
  basketClass.getUser();

  document.addEventListener("click", (e) => {
    if(!navbar.contains(e.target)) {
      navbar.shadowRoot.querySelector(".navbar-sm").style.left = "-100%"
    }
  })

  if(basketClass.db === "guest") {
    productSide.innerHTML = "";
    guestLastSeen(basketClass);
  } else {
    userLastSeen(basketClass);
  }

  if(users[basketClass.userID]?.dashboard.wishlist.includes(`${productID}`)) {
    productLike.classList.add("d-none");
    productUnLike.classList.remove("d-none");
  }

  productSubPhoto.innerHTML = product.productPhoto.map((photo, index) => `<div class="p-1 d-flex align-items-center justify-content-center"><img class="w-100" src="${photo.replace(`")`, "")}"></div>`).join("");

  mainPhoto.innerHTML = product.productPhoto.map(photo => `<img class="w-100" src="${photo.replace(`")`, "")}">`).join("");
  
  productSubPhoto.innerHTML += '<div DONT class="slider border-primary"></div>';

  productName.innerHTML = product.productName;

  document.title = `DigiBuy - ${product.productName.slice(0, product.productName.indexOf(","))}`;

  productPrice.innerHTML = `$${product.productPrice}`;

  productCategory.innerHTML = `<strong>Category: </strong><p class="ms-2 d-inline text-muted">${product.productCategory}, ${product.productSubCategory}</p>`;

  productFeatureList.innerHTML = product.productFeature.map((feature, index) =>
    `<li class="${index !== 0 ? "mt-2" : ""}"><div class="d-flex"><p class="fw-bold fs-6">${feature.title}:</p><p class="ms-2 fs-6 text-muted">${feature.discription || feature.description}</p></div></li>`)
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
    html += `<div class="d-flex"><p class="fw-bold fs-6">${element.title}:</p><p class="ms-2 fs-6 text-muted">${element.description || element.discription}</p></div>
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
        if(index <= rateValue) {
          ratingList.innerHTML += `<li class="rating-item fill-star me-1" data-rate="${index}"></li>`;
        } else {
          ratingList.innerHTML += `<li class="rating-item empty-star me-1" data-rate="${index}"></li>`;
        }
      }
    }
  })

  commentSubmitBtn.addEventListener("click", (e)=> {
    commentSubmit(product, basketClass);
  })

  let productComment = [];
  let productStar = [0, 0, 0, 0, 0];
  let productOverAll = [];
  if(comments) {
    for(let [key, value] of Object.entries(comments)) {
      if(value.productID === product.productID && value.show === true) {
        reviewCounter.forEach((element, index) => {
          element.innerHTML = Number(element.innerHTML) + 1;
        });
        productStar[value.rate - 1] += 1;
        productOverAll.push(Number(value.rate));
        noCommentDiv.classList.add("d-none");
        productComment.push(`
          <div class="comment-item d-flex flex-column p-3">
            <div class="lh-1 mb-2 d-flex align-items-center">
              <img width="60px" class="me-2" src="src/IMG/user-avatar.png">
                <div>
                  <h5 class="ff-osw mb-1 fs-6">${users[value.userID].userName}</h5>
                  <div class="d-flex">
                    ${(()=> {
                      let string = "";
                      for (let index = 1; index <= 5; index++) {
                        if(index <= value.rate) {
                          string +=`<div class="fill-star me-1"></div>`;
                        } else {
                          string +=`<div class="empty-star me-1"></div>`;
                        }
                      }
                      return string;
                    })()}
                  </div>
              </div>
            </div>
            <p class="mb-0">${value.comment}</p>
          </div>
        `);
      }
    }
    productStar.reverse();
    starCounter.forEach((element, index) => {
      element.innerHTML = productStar[index];
    })
    if (productOverAll.length !== 0) {
      overAll.innerHTML = (productOverAll.reduce((a, b) => a + b) / productOverAll.length).toFixed(1);
    }
    showCommentDiv.insertAdjacentHTML("afterbegin", productComment.join(""));

    productLike.addEventListener("click", async (element)=> {
        let getLikedProduct = await(await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${basketClass.userID}/dashboard/wishlist.json`)).json() || [];
        if(!getLikedProduct.includes(`${basketClass.userID}`)) {
          getLikedProduct.push(`${productID}`);
          let postLikedProduct = (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${basketClass.userID}/dashboard/wishlist.json`, {
            method: "PUT",
            body: JSON.stringify(getLikedProduct)
          }));
          if(postLikedProduct) {
            productUnLike.classList.remove("d-none");
            productLike.classList.add("d-none");
          }
        }
      })
      productUnLike.addEventListener("click", async (element)=> {
        let getLikedProduct = await(await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${basketClass.userID}/dashboard/wishlist.json`)).json() || [];
        if(getLikedProduct.includes(`${productID}`)) {
          getLikedProduct.splice(getLikedProduct.indexOf(`${productID}`),1);
          let postLikedProduct = (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${basketClass.userID}/dashboard/wishlist.json`, {
            method: "PUT",
            body: JSON.stringify(getLikedProduct)
          }));
          if(postLikedProduct) {
            productUnLike.classList.add("d-none");
            productLike.classList.remove("d-none");
          }
        }
    })
  }
})

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

async function commentSubmit(product, basketClass) {
  if(commentMessage.value.length > 5) {
    commentSubmitBtn.classList.add("disabled");
    commentSubmitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    try {
      let commentObj = {
        productID: product.productID,
        userID: basketClass.userID,
        comment: commentMessage.value,
        rate: rate,
        commentID: basketClass.uniqueID(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        show: false,
        checked: false
      }
      let response = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/comments/${commentObj.commentID}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentObj)
      });
      if(response.ok) {
        commentSubmitBtn.classList.remove("disabled");
        commentSubmitBtn.innerHTML = `Submit Comment`;
        cmSubmitSuccessAlert.classList.remove("d-none");

        setTimeout(() => {
          cmSubmitSuccessAlert.classList.add("d-none");
        }, 5000);
      }
    } catch (error) {
      cmSubmitDangerAlert.classList.remove("d-none");
      setTimeout(() => {
        cmSubmitDangerAlert.classList.add("d-none");
      }, 5000);
    }
  }
}

async function guestLastSeen(basketClass) {
  let getSeen = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/guest/${basketClass.userID}/dashboard/recentlyViewed
  .json`)).json() || [];
  if(getSeen) {
    getSeen.push(productID);
    await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/guest/${basketClass.userID}/recentlyViewed.json`, {
      method: "PUT",
      body: JSON.stringify(getSeen)
    });
  }
}

async function userLastSeen(basketClass) {
  let getGuestDB = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/guest/${basketClass.guestID}/recentlyViewed.json`)).json();
  let getUserDB = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${basketClass.userID}/dashboard/recentlyViewed.json`)).json() || [];
  console.log(getGuestDB, getUserDB);
  if (getGuestDB !== null) {
    getGuestDB.forEach((item)=> {
      getUserDB.push(item);
    })
  }
  if (!getUserDB.includes(productID)) {
    getUserDB.push(productID);
  }
  let postUserDB = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${basketClass.userID}/dashboard/recentlyViewed.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(getUserDB)
  });
  let postGuestDB = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/guest/${basketClass.guestID}/recentlyViewed.json`, {method: "DELETE"})
}