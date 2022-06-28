import {addProduct, template} from '../Add/addProduct.js';

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
    this.unSuccessAlert = this.shadowRoot.querySelector(".alert-danger");
    this.submitProductBtn = this.shadowRoot.querySelector("#submit-product");
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
    product["productFeature"].forEach((element, index) => {
      this.productFeatures[index].children[0].value = element.title;
      this.productFeatures[index].children[1].value = element.discription;
    });
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
    this.productTag.value =product["productTags"].join(", ");
    this.productAddSpecification.addEventListener("click", (e) => addProduct.addSpecification(this.productSpecification));
    this.productSpecification.addEventListener("click", (e) => addProduct.removeSpecification(e));
    product["productFeature"].forEach((element, index) => {
      if(index >= 1) addProduct.addSpecification(this.productSpecification);
      this.productSpecificationInputs.children[index].children[0].value = element.title;
      this.productSpecificationInputs.children[index].children[1].value = element.discription;
    })
    console.log(this.productCategory,this.productCategory.selectedIndex, this.productCategory.options[this.productCategory.selectedIndex]);
    console.log(typeof this.productCategory["options"],typeof  Array(this.productCategory["options"]));
    this.productCategory["options"].selectedIndex = Object.values(this.productCategory["options"]).findIndex((option, index) => {return option.text === product["productSubCategory"]});
    Object.keys(product).length !== 0 ? this.productWait.classList.add("d-none") : false;
  }

  async connectedCallback() {
    addProduct.loadPopOver(this.shadowRoot);
    await this.crmProduct().then(result => {return result.json()}).then(result => { this.productObject = result });
    let product = this.productObject[String(this.productIDAttribute)];
    console.log(product);
    this.loadProduct(product);
    
  }
}

export { editProduct }