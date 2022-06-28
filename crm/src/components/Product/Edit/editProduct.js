import {addProduct, template} from '../Add/addProduct.js';
import { crmUser } from "/crm/src/JS/main.js";
class editProduct extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.productWait = this.shadowRoot.querySelector(".product-wait");
    this.productName = this.shadowRoot.querySelector("#product-name-add");
    this.productModel = this.shadowRoot.querySelector("#product-model-add");
    this.productFeatures = this.shadowRoot.querySelectorAll("#product-feature li");
    this.mainPhoto = this.shadowRoot.querySelector(".pr-ph");
    this.productAddSpecification = this.shadowRoot.querySelector(".product-add-specification");
    this.productRemoveSpecification = this.shadowRoot.querySelectorAll(".product-remove-specification");
    this.productSpecification = this.shadowRoot.querySelector(".pr-sp");
    this.productSpecificationInputs = this.shadowRoot.querySelector(".pr-sp");
    this.subPhotos = this.shadowRoot.querySelector(".pr-ph-ph");
    this.addPhotoDivBtn = this.shadowRoot.querySelector(".add-photo-div");
    this.productDescription = this.shadowRoot.querySelector("#product-description-add");
    this.productBrand = this.shadowRoot.querySelector("#product-brand-add");
    this.productPrice = this.shadowRoot.querySelector("#product-price-add");
    this.productTag = this.shadowRoot.querySelector("#product-add-tag");
    this.productCategory = this.shadowRoot.querySelector("#product-category-add");
    this.productAddForm = this.shadowRoot.querySelector(".product");
    this.successAlert = this.shadowRoot.querySelector(".alert-success");
    this.successAlert.innerHTML = "Product updated successfully";
    this.successAlert.classList.replace("alert-success", "alert-warning");
    this.unSuccessAlert = this.shadowRoot.querySelector(".alert-danger");
    this.unSuccessAlert.innerHTML = "Product updated unsuccessfully";
    this.submitProductBtn = this.shadowRoot.querySelector("#submit-product");
    this.submitProductBtn.innerHTML = "Update Product";
    this.submitProductBtn.classList.replace("btn-success", "btn-warning");
  }

  async crmProduct() {
    const response = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json`);
    return response;
  }

  get productIDAttribute() {
    return this.getAttribute("product-id");
  }

  static get observedAttributes() {
    return ["product-id"];
  }

  loadProduct = (product) => {
    this.productName.value = product["productName"];
    this.productModel.value = product["productModel"];
    if(product["productFeature"]) {
      product["productFeature"].forEach((element, index) => {
        this.productFeatures[index].children[0].value = element.title;
        this.productFeatures[index].children[1].value = element.discription;
      });
    }
    this.addPhotoDivBtn.addEventListener("click",(e)=> {addProduct.addPhotoDiv(this.subPhotos, this.shadowRoot)});
    this.mainPhoto.children[0].style.background = `url(${product["productPhoto"][0].replace(`")`,"")})`;
    this.mainPhoto.children[0].style.backgroundColor = `#fff`;
    product["productPhoto"].forEach((element, index) => {
      if(index >= 1) {
        addProduct.addPhotoDiv(this.subPhotos, this.shadowRoot);
        this.subPhotos.children[index-1].style.background = `url(${element.replace(`")`,"")})`;
        this.subPhotos.children[index-1].style.backgroundColor = `#fff`;
      }
    })
    this.productDescription.value = product["productDescription"];
    this.productBrand.value = product["productBrand"];
    this.productPrice.value = product["productPrice"];
    if(product["productTags"]) {
      this.productTag.value = product["productTags"].join(", ");
    }
    this.productAddSpecification.addEventListener("click", (e) => addProduct.addSpecification(this.productSpecification));
    this.productSpecification.addEventListener("click", (e) => addProduct.removeSpecification(e));
    if(product["productFeature"]) {
      product["productFeature"].forEach((element, index) => {
        if(index >= 1) addProduct.addSpecification(this.productSpecification);
        this.productSpecificationInputs.children[index].children[0].value = element.title;
        this.productSpecificationInputs.children[index].children[1].value = element.discription;
      })
    }
    this.productCategory["options"].selectedIndex = Object.values(this.productCategory["options"]).findIndex((option, index) => {return option.text === product["productSubCategory"]});
    Object.keys(product).length !== 0 ? this.productWait.classList.add("d-none") : false;
  }

  submitForm = (event, productObject) => {
    event.preventDefault();
    this.submitProductBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...`
    this.submitProductBtn.classList.toggle("disabled");
    let productCategory = this.shadowRoot.querySelector("#product-category-add");
    let product = {
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
      user: [productObject.userName, crmUser.profileID],
      productID: productObject.productID,
      logID: addProduct.uniqueID(),
      logType: "change product",
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
    let apiProduct = `https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product/${productObject.productID}.json`;
    let apiLog = `https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/log/${productAddLog.logID}.json`;
    (async () => {
      if (await addProduct.postProduct(apiProduct, product, "PATCH") && await addProduct.postProduct(apiLog, productAddLog, "PATCH")) {
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
      this.submitProductBtn.innerHTML = `Edit Product`
      this.submitProductBtn.classList.toggle("disabled");
    })();
  }

  async connectedCallback() {
    addProduct.loadPopOver(this.shadowRoot);
    await this.crmProduct().then(result => {return result.json()}).then(result => { this.productObject = result });
    let product = await this.productObject[String(this.productIDAttribute)];
    this.loadProduct(product);
    this.productAddForm.addEventListener("submit", (e) => this.submitForm(e, product));
  }
}

export { editProduct }