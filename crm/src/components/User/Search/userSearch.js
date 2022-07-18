const template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css">
<link rel="stylesheet" href="/crm/src/components/User/Search/style.css">
<div class="position-relative pt-2 px-3">
  <div class="main position-relative">
  <div class="row m-0 p-0">
  <div class="col p-0">
    <div class="input-group mb-3">
      <select class="form-select rounded-start" id="search-filter">
        <option value="userID" selected>User ID</option>
        <option value="userName">User Name</option>
        <option value="search">Search</option>
      </select>
      <input type="text" class="form-control w-50 rounded-end" id="filter-input">
    </div>
  </div>
</div>
  </div>
  <div class="content"></div>
  <div class="wait"><i class="bi bi-gear-wide-connected"></i></div>
</div>`;


class userSearch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.content = this.shadowRoot.querySelector(".content");
    this.loading = this.shadowRoot.querySelector(".wait");
    this.searchFilter = this.shadowRoot.querySelector("#search-filter");
    this.searchInput = this.shadowRoot.querySelector("#filter-input");
    this.searchFilterValue = this.searchFilter.value;
  }

  makeContentTemplate = (username, type) => {
    return `
    <div class="card">
      <div class="p-2 d-flex align-items-center justify-content-center">
        <img src="/product/src/IMG/user-avatar.png" style="width: 80px !important;" class="" alt="...">
      </div>
      <div class="card-body">
        <h5 class="card-title">${username}</h5>
        <p class="card-text">User type: ${type}</p>
        <button class="btn btn-primary text-white w-100">Watch Detail</button>
      </div>
    </div>
    `
  }

  search(users, inputValue) {
    this.content.innerHTML = "";
    if (this.searchFilterValue !== "search") {
      for (let [key, value] of Object.entries(users)) {
        if (value[this.searchFilterValue].toLowerCase() === inputValue.toLowerCase() ||
          value[this.searchFilterValue].toLowerCase().replace(/\s/g, '') === inputValue.toLowerCase()) {
          this.content.innerHTML += this.makeContentTemplate(value.userName, value.type);
        }
      }
    } else {
      for (let [key, value] of Object.entries(users)) {
        if (value["userID"].toLowerCase().replace(/\s/g, '').includes(inputValue.toLowerCase()) || value["userID"].toLowerCase().includes(inputValue.toLowerCase()) || value["userName"].toLowerCase().replace(/\s/g, '').includes(inputValue.toLowerCase()) || value["userName"].toLowerCase().includes(inputValue.toLowerCase())
        ) {
          this.content.innerHTML += this.makeContentTemplate(value.userName, value.type);
        }
      }
    }
  }

  async connectedCallback() {
    let timer;
    let users = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users.json")).json();
    this.loading.classList.add("d-none");
    this.searchFilter.addEventListener("change", (e) => {
      this.searchFilterValue = e.currentTarget.value;
      this.search(users, this.searchInput.value);
    })
    this.searchInput.addEventListener("keyup", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.search(users, this.searchInput.value);
      }, 500);
    })

  }
}

export { userSearch };