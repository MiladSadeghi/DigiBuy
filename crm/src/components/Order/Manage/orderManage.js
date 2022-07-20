import { addProduct } from "../../Product/Add/addProduct.js";
import { crmUser } from "/crm/src/JS/main.js";
const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css" />
<link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css" />
<link rel="stylesheet" href="/crm/src/components/Order/Manage/style.css" />
<div class="position-relative">
  <div class="main px-3 py-3">

  </div>
  <div class="wait"><i class="bi bi-gear-wide-connected"></i></div>
</div>
`;

class orderManage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.loading = this.shadowRoot.querySelector(".wait");
    this.mainBody = this.shadowRoot.querySelector(".main");
    this.users;
    this.products;
    this.orders;
  }

  get userIDAttribute() {
    return this.getAttribute("order-id");
  }

  showContent = () => {
    this.mainBody.innerHTML = `<div class="row">
  <div class="col-md-12">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Order Details</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label>Order ID</label>
              <input type="text" class="form-control" value="${this.orders["orderID"]}" disabled>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Order Date</label>
              <input type="text" class="form-control" value="${this.orders["orderDate"]}" disabled>
            </div>
          </div>
          <div class="col-md-12">
            <div class="form-group">
              <label>user ID</label>
              <input type="text" class="form-control" value="${this.orders["userID"]}" disabled>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="usTy">Order Status</label>
              <select class="form-select" id="usTy">
                <option value="pending">Pending</option>
                <option value="delivery">Delivery</option>
                <option value="progress">Progress</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Order Total</label>
              <input type="text" id="ttlPrc" class="form-control" value="${this.orders["orderTotal"]}">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Order Details</label>
              <textarea class="form-control" rows="5"
                placeholder="Would you like to note something about this order?">${this.orders["orderDetails"]? this.orders["orderDetails"]: ""}</textarea>
            </div>
          </div>
        </div>
        <div class="row">
          ${(() => {
            let string = ``;
            this.orders["orderProduct"].forEach(item => {
              string += `
              <div class="col-md-4 d-flex mt-2 product">
                <div>
                  <img width="88px" src="${this.products[item.product].productPhoto[0]}" alt="">
                </div>
                <div class="form-group my-auto">
                  <p style="font-size: 0.9rem;" class="mb-0">${this.products[item.product].productName}</p>
                  <input type="number" class="form-control" value="${item["quantity"]}">
                </div>
              </div>
              `;
            });
            return string
          })()}
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <button class="btn btn-primary w-100 mt-2" id="updateOrder">Update Order</button>
            </div>
          </div>
      </div>
    </div>
  </div>`;
    let orderStatusOptions = this.shadowRoot.querySelectorAll("#usTy option");
    orderStatusOptions.forEach(item => {
      if (item.value == this.orders["orderStatus"]) {
        item.setAttribute("selected", "");
      }
    })
    let updateBtn = this.shadowRoot.querySelector("#updateOrder");
    updateBtn.addEventListener("click", async (e) => {
      e.target.classList.add("disabled");
      e.target.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Loading...`;
      let updateOrder = {
        orderStatus: this.shadowRoot.querySelector("#usTy").value,
        orderDetails: this.shadowRoot.querySelector("textarea").value,
        orderTotal: this.shadowRoot.querySelector("#ttlPrc").value,
        checked: true,
        orderProduct: (() => {
          let productDiv = this.shadowRoot.querySelectorAll(".product input");
          let productArray = [];
          productDiv.forEach((element, index) => {
            productArray.push({
              product: this.orders["orderProduct"][index].product,
              quantity: element.value
            })
          });
          return productArray;
        })()
      };
      let logUpdateOrder = {
        orderID: this.orders["orderID"],
        logType: "update order",
        logID: addProduct.uniqueID(),
        time: new Date(),
        user: [crmUser.userName, crmUser.userID],
      };
      let sendUpdatedOrder = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/orders/${this.userIDAttribute}.json`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateOrder)
      });
      if (sendUpdatedOrder.status == 200) {
        await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/log/${logUpdateOrder.logID}.json`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(logUpdateOrder)
        });
        alert("Order Updated");
        e.target.classList.remove("disabled");
        e.target.innerHTML = `Update Order`;
      }
    })
  };

  async connectedCallback() {
    this.users = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users.json")).json();
    this.products = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/product.json")).json();
    this.orders = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/orders/${this.userIDAttribute}.json`)).json();
    this.loading.classList.toggle("d-none");
    this.showContent();
  }
}

export { orderManage }
