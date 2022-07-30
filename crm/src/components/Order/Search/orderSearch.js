const template = document.createElement('template');
template.innerHTML = `<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css">
<link rel="stylesheet" href="/crm/src/components/Order/Search/style.css">
<div class="position-relative pt-2 px-3">
  <div class="main position-relative">
  <div class="row m-0 p-0">
  <div class="col p-0">
    <div class="input-group mb-3">
      <select class="form-select rounded-start" id="search-filter">
        <option value="orderID" selected>Order ID</option>
        <option value="userID">User ID</option>
        <option value="userName">Username</option>
        <option value="uncheck">UnCheck</option>
        <option value="checked">Checked</option>
      </select>
      <input type="text" class="form-control w-50 rounded-end" id="filter-input">
    </div>
  </div>
</div>
  </div>
  <div class="content"></div>
  <div class="wait"><i class="bi bi-gear-wide-connected"></i></div>
</div>`;

class orderSearch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.loading = this.shadowRoot.querySelector('.wait');
    this.searchInput = this.shadowRoot.querySelector('#filter-input');
    this.searchFilter = this.shadowRoot.querySelector('#search-filter');
    this.searchFilterValue = this.searchFilter.value;
    this.content = this.shadowRoot.querySelector('.content');
    this.orders;
    this.products;
    this.users;
  }

  contentTemplate = (value) => {
    return `
    <div class="card" style="">
      <div class="ord-ph w-100 p-2 text-center">
        ${(() => {
          let string = "";
          value.orderProduct.forEach(element => {
            string += `<img width="90px" src="${this.products[element.product].productPhoto[0]}">`
          });
          return string
        })()}
      </div>
      <div class="card-body">
        <p class="card-text mb-0">User: ${this.users[value.userID].userName}</p>
        <p class="card-text mb-0 text-capitalize">Status: ${value.orderStatus}</p>
        </div>
        <div class="card-footer bg-transparent">
        <button manage-order="${value.orderID}" class="btn btn-primary text-white w-100">Watch Detail</button>
        </div>
    </div>
    `
  }

  search = (input) => {
    if(this.orders !== null) {
      this.content.innerHTML = "";
      let filter = "";
      for (let [key, value] of (Object.entries(this.orders))) {
        switch (this.searchFilterValue) {
          case "orderID":
            filter = value.orderID === input.value;
            break;
          case "userID":
            filter = value.userID === input.value;
            break;
          case "userName":
            filter = this.users[value.userID].userName === input.value;
            break;
          case "uncheck":
            filter = this.searchFilterValue === "uncheck" && value.checked === false;
            break;
          case "checked":
            filter = this.searchFilterValue === "checked" && value.checked === true;
            break;
          }
          if (filter) {
          this.content.innerHTML += this.contentTemplate(value);
          }
      } 
    }
  }

  async connectedCallback() {
    this.orders = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/orders.json")).json();
    this.products = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json")).json();
    this.users = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users.json")).json();
    this.loading.classList.toggle("d-none");

    this.searchFilter.addEventListener("change", (e) => {
      this.searchFilterValue = e.currentTarget.value;
      this.search(this.searchInput.value);
    })
    this.searchInput.addEventListener("keyup", (e) => {
      this.search(e.currentTarget);
    })
  }
}

export { orderSearch };