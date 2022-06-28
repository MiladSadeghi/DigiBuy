import { crmUser } from "../../../JS/main.js";

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css">
<link rel="stylesheet" href="/crm/src/components/Product/Edit/style.css">
    ${window.location.hostname === "miladsadeghi.github.io" ? `<link rel="stylesheet" href="src/components/Product/Add/style.css">` : `<link rel="stylesheet" href="/crm/src/components/Product/Add/style.css">`}
<form class="product areas position-relative pt-2 px-3">
  <div class="pr-na">
    <input placeholder="Product Name" type="text" class="form-control shadow-lg" id="product-name-add">
  </div>
  <div class="pr-mo"><input placeholder="Product Model" type="text" class="form-control shadow-lg"id="product-model-add"></div>
  <div class=" pr-fe">
    <ul class="mb-0 list-unstyled" id="product-feature">
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="description" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="description" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="description" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="description" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="description" type="text" class="form-control"></li>
      <li class="input-group"><input placeholder="feature" type="text" class="form-control"><input placeholder="description" type="text" class="form-control"></li>
    </ul>
  </div>
  <div class="d-flex pr-ph">
    <div class="glass pr-ph-main first-glass d-flex fs-2 rounded shadow-lg align-items-center justify-content-evenly"><i class="bi bi-plus-circle add-photo-div"></i><a href="#" class="bi bi-wrench-adjustable-circle" data-bs-toggle="popover"></a></div>
  </div>
  <div class="pr-ph-ph w-100"></div>
  <div class="d-flex pr-di"><textarea class="form-control shadow-lg" placeholder="Description"style="resize: none;" id="product-description-add" cols="20" rows="5"></textarea></div>
  <div class="d-flex pr-br"><input placeholder="Brand" type="text" class="form-control w-100 shadow-lg"id="product-brand-add"></div>
  <div class="d-flex pr-pr"><input placeholder="Price" type="text" class="form-control w-100 shadow-lg"id="product-price-add"></div>
  <div class="pr-sp">
    <div class="input-group product-specification"><input type="text" placeholder="title" class="form-control shadow-lg"><input type="text" placeholder="Description" class="form-control shadow-lg"><button class="btn btn-success product-add-specification" type="button"></button><button class="btn btn-danger product-remove-specification" disabled type="button"></button></div>
  </div>
  <div class="pr-ca">
    <select class="form-select" aria-label="Default select example" id="product-category-add">
      <option value="" selected>Open this select menu</option>
      <option value="digital">Accessories</option>
      <option value="digital">Mobile phone</option>
      <option value="digital">Smart watch</option>
      <option value="digital">Computer</option>
      <option value="digital">Laptop</option>
      <option value="clothing">Men clothing</option>
      <option value="clothing">Ladies clothing</option>
      <option value="clothing">Childish clothing</option>
      <option value="health">Shampoo</option>
      <option value="health">Skin cream</option>
      <option value="health">Oral health</option>
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
      <option value="travel">Underlay</option>
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
  <input type="text" id="product-add-tag" placeholder="Tag, Split tag with comma" class="form-control pr-ta"><button id="submit-product"  type="submit" class="btn btn-success pr-su mb-3">Add Product</button>
  <div class="alert alert-success position-fixed w-25 text-center fs-5 fw-bold border border-success shadow-lg" role="alert">Product Add!</div>
  <div class="alert alert-danger position-fixed w-25 text-center fs-5 fw-bold border border-success shadow-lg" role="alert">Product Added Failed!</div>
  <div class="product-wait"><i class="bi bi-gear-wide-connected"></i></div>
  </form>
<div id="PopoverContent" class="d-none">
<div class="input-group">
  <input type="text" class="form-control" placeholder="URL">
  <button id="submit-photo-link" class="btn btn-outline-primary bi bi-arrow-right fs-5" submit-photo-url type="button" data-toggle="popover" data-placement="bottom"
    data-html="true">
  </button>
</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2"
crossorigin="anonymous"></script>`;
class addProduct extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector(".product-wait").classList.add("d-none")
    this.productAddSpecification = this.shadowRoot.querySelector(".product-add-specification");
    this.productRemoveSpecification = this.shadowRoot.querySelectorAll(".product-remove-specification");
    this.productSpecification = this.shadowRoot.querySelector(".pr-sp");
    this.mainPhoto = this.shadowRoot.querySelector(".pr-ph");
    this.subPhotos = this.shadowRoot.querySelector(".pr-ph-ph");
    this.addPhotoDivBtn = this.shadowRoot.querySelector(".add-photo-div");
    this.productAddForm = this.shadowRoot.querySelector(".product");
    this.successAlert = this.shadowRoot.querySelector(".alert-success");
    this.unSuccessAlert = this.shadowRoot.querySelector(".alert-danger");
    this.submitProductBtn = this.shadowRoot.querySelector("#submit-product");
  }

  static addSpecification = (event) => {
    event.insertAdjacentHTML("beforeend", `<div class="input-group mt-2 product-specification">
    <input type="text" placeholder="title" class="form-control shadow-lg">
    <input type="text" placeholder="Description" class="form-control shadow-lg">
    <button class="btn btn-danger product-remove-specification" type="button"></button>
    </div>`);
  }

  static removeSpecification = (event) => {
    if (event.target.classList.contains("product-remove-specification")) {
      event.target.parentElement.remove();
    }
  }

  static photoLink = (event, root) => {
    if (event.target.classList.contains("bi-wrench-adjustable-circle")) {
      event.target.addEventListener("shown.bs.popover", (el) => {
        let button = document.querySelector(`#${el.target.getAttribute("aria-describedby")} button`);
        button.addEventListener("click", (event2) => {
          this.productPhotoContentType(event2.target.previousElementSibling.value).then(result => {
            if (result) {
              el.path[1].style.background = `url(${event2.target.previousElementSibling.value})`;
              el.path[1].style.backgroundColor = `#fff`;
            }
          });
        })
      })
    }
  }

  static productPhotoContentType = async (get_url) => {
    const response = await fetch(get_url);
    return response.headers.get('content-type').includes("image") ? true : false;
  }

  static addPhotoDiv = (event, root) => {
    addProduct.loadPopOver(root);
    if (event.childElementCount < 6) {
      event.insertAdjacentHTML("beforeend", `<div class="glass second-glass w-100 fs-4 rounded shadow-lg align-items-center justify-content-center"><i class="bi bi-dash-circle remove-photo-div"></i><a href="#" class="bi bi-wrench-adjustable-circle" data-bs-toggle="popover"></a></div>`);
      addProduct.loadPopOver(root);
    }
  }

  static loadPopOver = (event) => {
    const popoverTriggerList = event.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
      if (!popoverTriggerEl.hasAttribute("aria-describedby")) {
        new bootstrap.Popover(popoverTriggerEl, {
          container: 'body',
          title: 'Add Photo Link',
          html: true,
          placement: 'bottom',
          sanitize: false,
          content: () => {
            return event.querySelector('#PopoverContent').innerHTML;
          }
        });
      }
    });
  }

  static removePhotoDiv = (event) => {
    if (event.target.classList.contains("remove-photo-div")) {
      event.target.parentElement.remove();
    }
  }

  submitForm = (event) => {
    event.preventDefault();
    this.submitProductBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...`
    this.submitProductBtn.classList.toggle("disabled");
    let productCategory = this.shadowRoot.querySelector("#product-category-add");
    let product = {
      timeAddProduct: new Date(),
      userAddProduct: [crmUser.userName, crmUser.profileID],
      productID: addProduct.uniqueID(),
      comments: [],
      productName: this.shadowRoot.querySelector("#product-name-add").value,
      productModel: this.shadowRoot.querySelector("#product-model-add").value,
      productBrand: this.shadowRoot.querySelector("#product-brand-add").value,
      productPrice: this.shadowRoot.querySelector("#product-price-add").value,
      productDescription: this.shadowRoot.querySelector("#product-description-add").value,
      productTags: (this.shadowRoot.querySelector("#product-add-tag").value).split(",").map(el => el.trim()).filter((a) => a),
      productFeature: [],
      productSpecification: [],
      productPhoto: [],
      show: true,
    }
    let productAddLog = {
      time: new Date(),
      user: [crmUser.userName, crmUser.profileID],
      productID: product.productID,
      logID: addProduct.uniqueID(),
      logType: "add product",
      category: productCategory.value,
      subCategory: productCategory.options[productCategory.selectedIndex].text,
    }
    product["productCategory"] = productCategory.value;
    product["productSubCategory"] = productCategory.options[productCategory.selectedIndex].text;
    this.shadowRoot.querySelectorAll("#product-feature li").forEach(element => {
      if (element.children[0].value !== "" && element.children[1].value !== "") {
        product["productFeature"].push({
          title: element.children[0].value,
          description: element.children[1].value
        })
      }
    });
    this.shadowRoot.querySelectorAll(".product-specification").forEach(element => {
      if (element.children[0].value !== "" && element.children[1].value !== "") {
        product["productSpecification"].push({
          title: element.children[0].value,
          description: element.children[1].value
        })
      }
    });
    this.shadowRoot.querySelectorAll(".glass").forEach(element => {
      if (addProduct.detectURLs(element.style.background)) {
        product["productPhoto"].push(addProduct.detectURLs(element.style.background))
      }
    });
    let apiProduct = `https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product/${product.productID}.json`;
    let apiLog = `https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/log/${productAddLog.logID}.json`;
    (async () => {
      if (await addProduct.postProduct(apiProduct, product, "PUT") && await addProduct.postProduct(apiLog, productAddLog, "PUT")) {
        this.successAlert.style.right = "16px";
        setTimeout(() => {
          this.successAlert.style.right = "-100%";
        }, 3000);
      } else {
        this.unSuccessAlert.style.right = "16px";
        setTimeout(() => {
          this.unSuccessAlert.style.right = "-100%";
        }, 3000);
      }
      this.submitProductBtn.innerHTML = `Add Product`
      this.submitProductBtn.classList.toggle("disabled");
    })();
  }
  static uniqueID = () => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  };

  static detectURLs = (message) => {
    let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    let string = message.match(urlRegex);
    return ((string) !== null) ? string[0] : false
  }

  static postProduct = async (apiLink, body, method) => {
    try {
      let response = await fetch(apiLink, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
      let result = await response.json();
      return await result;
    } catch (error) {
      return false
    }
  }

  static productPhotoContentType = async (get_url) => {
    const response = await fetch(get_url);
    return response.headers.get('content-type').includes("image") ? true : false;
  }

  connectedCallback() {
    addProduct.loadPopOver(this.shadowRoot);
    this.productAddSpecification.addEventListener("click", (e) => addProduct.addSpecification(this.productSpecification));
    this.productSpecification.addEventListener("click", (e) => addProduct.removeSpecification(e));
    this.mainPhoto.addEventListener("click", (e) => addProduct.photoLink(e,this.shadowRoot ));
    this.subPhotos.addEventListener("click", (e) => addProduct.photoLink(e, this.shadowRoot));
    this.addPhotoDivBtn.addEventListener("click",(e)=> {addProduct.addPhotoDiv(this.subPhotos, this.shadowRoot)});
    this.subPhotos.addEventListener("click", (e) => addProduct.removePhotoDiv(e));
    this.productAddForm.addEventListener("submit", (e) => this.submitForm(e));
  }
}

export { addProduct, template}