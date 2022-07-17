import { crmUser } from "/crm/src/JS/main.js";

const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css">
  <link rel="stylesheet" href="/crm/src/components/Log/style.css">
  <div class="main pt-2 px-3">
  </div>
`;


class logReview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    let logs = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/log.json")).json();
    let users = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users.json")).json();

    let logBody = this.shadowRoot.querySelector(".main");
    let string = "";
    let logArray = [];
    for(let [key, value] of Object.entries(logs)) {
      logArray.push(value);
    }
    logArray.sort((a,b) =>  new Date(b.time) - new Date(a.time));
    logArray.forEach(item => {
      console.log(item);
      switch (item.logType) {
        case "add product":
          string = `<div class="fw-bold log-item bg-success w-100 py-2 px-3 mb-2 rounded bg-opacity-25 text-success">
            ${users[item.user[1]].userName} added a new <a target="_blank" href="/product/?product=${item.productID}">product</a> on ${item.category}/${item.subCategory} category at ${new Date(item.time).toLocaleTimeString()} of ${new Date(item.time).toLocaleDateString()}.
          </div>`
          break;
        case "change product":
          string = `<div class="fw-bold log-item bg-warning w-100 py-2 px-3 mb-2 rounded bg-opacity-25" style="color: #664d03;">
            ${users[item.user[1]].userName} edited this <a target="_blank" href="/product/?product=${item.productID}">product</a> on ${item.category}/${item.subCategory} category at ${new Date(item.time).toLocaleTimeString()} of ${new Date(item.time).toLocaleDateString()}.
          </div>`
          break;
          case "delete product":
          string = `<div class="fw-bold log-item bg-danger w-100 py-2 px-3 mb-2 rounded bg-opacity-25 text-danger">
            ${users[item.user[1]].userName} delete this <a target="_blank" href="/product/?product=${item.productID}">product</a> on ${item.category}/${item.subCategory} category at ${new Date(item.time).toLocaleTimeString()} of ${new Date(item.time).toLocaleDateString()}.
          </div>`
          break;
          case "comment":
          string = `<div class="fw-bold log-item bg-primary w-100 py-2 px-3 mb-2 rounded bg-opacity-25 text-primary">
            ${users[item.user[1]].userName} ${item.logMessage} a comment on this <a target="_blank" href="/product/?product=${item.productID}">product</a> in ${new Date(item.time).toLocaleTimeString()} of ${new Date(item.time).toLocaleDateString()}.
          </div>`
          break;
      }
      logBody.innerHTML += string;
    });
  }
}

export { logReview }