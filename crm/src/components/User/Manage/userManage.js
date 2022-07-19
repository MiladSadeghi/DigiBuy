const template = document.createElement("template");
template.innerHTML = `<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css" />
<link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css" />
<link rel="stylesheet" href="/crm/src/components/User/Manage/style.css" />
<div class="position-relative">
  <div class="main">
    <div class="d-flex">
      <div class="user-tab text-center active-tab col product-stuff-tab active-tab py-2 fs-5 fw-normal" show="#userSetting"></div>
      <div show="#userOrder" class="col text-center product-stuff-tab productBodyTabs py-2 fs-5 fw-normal user-tab">
        Orders
      </div>
      <div show="#wishList" class="col text-center product-stuff-tab productBodyTabs py-2 fs-5 fw-normal user-tab">
        Wish List
      </div>
      <div show="#reviews" class="col text-center product-stuff-tab productBodyTabs py-2 fs-5 fw-normal user-tab">
        Reviews
      </div>
      <div show="#lastSeen" class="col text-center product-stuff-tab productBodyTabs py-2 fs-5 fw-normal user-tab">
        Last Seen
      </div>
    </div>
    <div>
      <div class="product-stuff-body bg-white d-flex w-100" style="height: calc(100vh - 111px)">
        <div id="userSetting" class="m-1 p-2 mt-0 w-100"></div>
        <div id="userOrder" class="d-none m-1 p-2 mt-0 w-100"></div>
        <div id="wishList" class="d-none m-1 p-2 mt-0 w-100"></div>
        <div id="reviews" class="d-none m-1 p-2 mt-0 w-100"></div>
        <div id="lastSeen" class="d-none m-1 p-2 mt-0 w-100"></div>
      </div>
    </div>
    <div class="wait"><i class="bi bi-gear-wide-connected"></i></div>
  </div>
</div>`;

class userManage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.loading = this.shadowRoot.querySelector(".wait");
    this.tabElements = this.shadowRoot.querySelectorAll(".user-tab");
    this.userSettingDiv = this.shadowRoot.querySelector("#userSetting");
    this.userOrderDiv = this.shadowRoot.querySelector("#userOrder");
    this.wishListDiv = this.shadowRoot.querySelector("#wishList");
    this.reviewsDiv = this.shadowRoot.querySelector("#reviews");
    this.lastSeenDiv = this.shadowRoot.querySelector("#lastSeen");
    this.user;
    this.products;
  }

  get userIDAttribute() {
    return this.getAttribute("user-id");
  }

  getUser = async () => {
    this.user = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${this.userIDAttribute}.json`)).json();
  }
  getProducts = async () => {
    this.products = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json`)).json();
  }

  tabs = () => {
    this.tabElements.forEach((element, index) => {
      element.addEventListener("click", (e) => {
        let body = this.shadowRoot.querySelector(e.target.getAttribute("show"));
        if (body.classList.contains("d-none")) {
          element.classList.add("active-tab")
          body.classList.remove("d-none");
          this.tabElements.forEach((element, index) => {
            if (element !== e.target) {
              this.shadowRoot.querySelector(element.getAttribute("show")).classList.add("d-none");
              element.classList.remove("active-tab");
            }
          })
        }
      })
    })
  }

  userSetting = (user) => {
    this.userSettingDiv.innerHTML = `
      <div class="usStCon">
        <div class="form-group">
          <label for="usNm">User Name</label>
          <input placeholder="${user.userName}" type="text" id="usNm" class="form-control">
        </div>
        <div class="form-group">
          <label for="usEm">Email</label>
          <input placeholder="${user.email}" type="text" id="usEm" class="form-control">
        </div>
        <div class="form-group">
          <label for="usPs">Password</label>
          <input placeholder="${user.password}" type="text" id="usPs" class="form-control">
        </div>
        <div class="form-group">
          <label for="usPn">Phone Number</label>
          <input placeholder="${user.phoneNumber}" type="text" id="usPn" class="form-control">
        </div>
        <div class="form-group">
          <label for="usTy">Type</label>
          <select class="form-select" id="usTy">
            <option value="admin-full">Admin Senior</option>
            <option value="admin-comment">Admin Comments</option>
            <option value="admin-user">Admin Users</option>
            <option value="admin-order">Admin Orders</option>
            <option value="admin-page">Admin Pages</option>
          </select>
        </div>
        <div class="form-group">
          <label for="usId">User ID</label>
          <input type="text" id="usId" class="form-control" disabled>
        </div>
        </div>
        <button id="submit-user-information" class="btn btn-primary w-100 mt-3 fs-5">Update</button>
    `
    let userNameInput = this.shadowRoot.querySelector("#usNm");
    userNameInput.value = user.userName;
    let userEmailInput = this.shadowRoot.querySelector("#usEm");
    userEmailInput.value = user.email;
    let userPasswordInput = this.shadowRoot.querySelector("#usPs");
    userPasswordInput.value = user.password;
    let userPhoneNumberInput = this.shadowRoot.querySelector("#usPn");
    userPhoneNumberInput.value = user.phoneNumber;
    let selectBox = this.shadowRoot.querySelector("#usTy");
    selectBox.value = user.type;
    this.shadowRoot.querySelector("#usId").value = user.userID;

    this.shadowRoot.querySelector("#submit-user-information").addEventListener("click", async (e) => {
      e.target.classList.toggle("disabled");
      e.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...`;
      let user = {
        userName: userNameInput.value,
        email: userEmailInput.value,
        password: userPasswordInput.value,
        phoneNumber: userPhoneNumberInput.value,
        type: selectBox.value
      };
      let sendUser = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${this.user.userID}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
      if(sendUser.ok) {
        alert("User Updated");
        e.target.classList.toggle("disabled");
        e.target.innerHTML = "Update";
        this.userSettingDiv.innerHTML = "";
        await this.getUser();
        this.userSetting(this.user);
      } else {
        alert(`Try Again Later!. ${sendUser.status}`);
      }
    })
  }

  userOrders = (user, products) => {
    console.log(user.dashboard["orders"]);
    for (let [key, value] of Object.entries(user.dashboard["orders"])) {
      this.userOrderDiv.innerHTML += `
        <div class="order-item d-flex flex-column border-1 border rounded-3 p-2 mb-2">
          <div class="order-item-header d-flex justify-content-between">
            <div class="d-flex align-items-center">
              <p class="mb-0 text-muted">${value.orderDate}</p>
              <i class="bi bi-dot mx-2"></i>
              <p class="mb-0"><span class="text-muted">Product ID</span> ${value.orderID}</p>
              <i class="bi bi-dot mx-2"></i>
              <p class="mb-0"><span class="text-muted">Price</span> $${this.moneyFormat(value.orderTotal)}</p>
              <i class="bi bi-dot mx-2"></i>
              <p class="mb-0"><span class="text-muted text-capitalize">status</span> ${value.orderStatus}</p>
            </div>
          </div>
          <div class="d-flex gx-2 mt-3">
            ${(() => {
              let string = "";
              value.orderProduct.forEach((item, index) => {
                console.log(this.products[item.product].productPhoto[0].replace(`")`, ""));
                string += `<div class="position-relative me-3"><img width="80px" src="${this.products[item.product].productPhoto[0].replace(`")`, "")}" alt="">
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">${item.quantity}<span class="visually-hidden">unread messages</span></span>
                </div>`;
              });
              return string;
            })()}
          </div>
        </div>
      `;
    }
  }

  moneyFormat = (num) => {
    return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  async connectedCallback() {
    await this.getUser();
    await this.getProducts();
    this.loading.classList.add("d-none");
    this.tabs();
    this.tabElements[0].innerHTML = this.user.userName;
    this.userSetting(this.user);
    this.userOrders(this.user, this.products);
    console.log(this.user, this.products);
  }
}

export { userManage };