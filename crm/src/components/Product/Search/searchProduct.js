import { crmUser } from "../../../JS/main.js";
const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css">
${window.location.hostname === "miladsadeghi.github.io" ? `<link rel="stylesheet" href="src/components/Product/Search/style.css">` : `<link rel="stylesheet" href="/crm/src/components/Product/Search/style.css">`}
<div class="main px-3 py-2 position-relative">
  <div class="row m-0 p-0">
    <div class="col p-0">
      <div class="input-group mb-3">
        <select class="form-select rounded-start" id="search-filter">
          <option value="productID" selected>Product ID</option>
          <option value="productName">Product Name</option>
          <option value="userAddProduct">Product Registrant</option>
          <option value="timeAddProduct">Product Registration Day</option>
          <option value="productSubCategory">Category</option>
        </select>
        <input type="text" class="form-control w-50 rounded-end" id="filter-input">
      </div>
    </div>
  </div>
  <div class="content"></div>
  <div class="product-wait"><i class="bi bi-gear-wide-connected"></i></div>
</div>
<script src="/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
`;
class searchProduct extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.searchFilter = this.shadowRoot.querySelector("#search-filter");
    this.searchFilterValue = this.searchFilter.value;
    this.crmProduct().then(result => { (result.ok ? this.productWait.classList.add("d-none") : false); return result.json() }).then(result => { this.productObject = result });
    this.filterInput = this.shadowRoot.querySelector("#filter-input");
    this.showContent = this.shadowRoot.querySelector(".content");
    this.productWait = this.shadowRoot.querySelector(".product-wait");
  }

  async crmProduct() {
    const response = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json`);
    return response;
  }

  searchFilterChange = (e) => {
    this.searchFilterValue = e.target.value;
    this.showByINUC();
  }

  showByINUC = () => {
    this.showContent.innerHTML = "";
    this.filterInput.type = "text";
    for (let [key, value] of Object.entries(this.productObject)) {
      if ((Array.isArray(value[this.searchFilterValue]) ? value[this.searchFilterValue][0] : value[this.searchFilterValue]).toLowerCase().includes(this.filterInput.value.toLowerCase()) && this.searchFilterValue !== "timeAddProduct") {
        this.showContent.innerHTML += `
          <div class="card h-100 product-animation">
            <div class="h-100 d-flex align-items-center justify-content-center">
              <img src="${value.productPhoto[0]}" class="card-img-top p-4">
            </div>
            <div class="card-body text-center">
              <h5 class="card-title fs-6">${value.productName}</h5>
              <p class="card-text fw-bold fs-5">$${value.productPrice}</p>
            </div>
            <div class="card-footer text-center">
              <small class="text-muted">${new Date(value.timeAddProduct)}</small>
            </div>
          </div>
          `;
      } else if (this.searchFilterValue === "timeAddProduct") {
        this.filterInput.type = "date";
        if(new Date(String(value["timeAddProduct"])).toLocaleDateString("en-US") === new Date(this.filterInput.value).toLocaleDateString("en-US")) {
          this.showContent.innerHTML += `
          <div class="card h-100 product-animation">
            <div class="h-100 d-flex align-items-center justify-content-center">
              <img src="${value.productPhoto[0]}" class="card-img-top p-4">
            </div>
            <div class="card-body text-center">
              <h5 class="card-title fs-6">${value.productName}</h5>
              <p class="card-text fw-bold fs-5">$${value.productPrice}</p>
            </div>
            <div class="card-footer text-center">
              <small class="text-muted">${new Date(value.timeAddProduct)}</small>
            </div>
          </div>
          `;
        }
      }
    } if (this.filterInput.value === "") {
      this.showContent.innerHTML = "";
    }
  }

  connectedCallback() {
    this.searchFilter.addEventListener("change", this.searchFilterChange);
    this.filterInput.addEventListener("keyup", this.showByINUC);
    this.filterInput.addEventListener("change", this.showByINUC);
  }
}

export { searchProduct };