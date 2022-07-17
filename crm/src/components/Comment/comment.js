import { crmUser } from "../../JS/main.js";
import { addProduct } from "../Product/Add/addProduct.js";
const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css">
  <link rel="stylesheet" href="/crm/src/components/Comment/style.css">
  <div class="position-relative">
    <div class="main pt-2 px-3 position-relative"></div>
    <div class="no-cm text-capitalize d-none fs-1 fw-bold">
      nothing found for review!.
    </div>
    <div class="wait"><i class="bi bi-gear-wide-connected"></i></div>
  </div>
`;

class commentReview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.mainBody = this.shadowRoot.querySelector(".main");
    this.loading = this.shadowRoot.querySelector(".wait");
    this.nothingFound = this.shadowRoot.querySelector(".no-cm");
  }

  showComment = async () => {
    this.loading.classList.remove("d-none");
    let comments = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/comments.json")).json();
    let users = await (await fetch("https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users.json")).json();
    this.mainBody.innerHTML = "";
    this.loading.classList.add("d-none");
    this.nothingFound.classList.remove("d-none");
    let string = "";
    if(comments !== null) {
      for(let [key, value] of Object.entries(comments)) {
        if(value.checked === false) {
          this.nothingFound.classList.add("d-none");
        }
      }
      for(let [key, value] of Object.entries(comments)) {
        if(value.checked === false) {
          string = `<div class="mb-2 d-flex justify-content-between comment-box p-3 align-items-center">
          <div class="d-flex flex-column w-50">
            <div class="lh-1 mb-2 d-flex align-items-center">
              <img width="60px" class="me-2" src="/product/src/IMG/user-avatar.png" />
              <div>
                <h5 class="ff-osw mb-1 fs-6">${users[value.userID].userName}</h5>
                <div class="d-flex">
                  ${(()=> { let string = ""; for (let index = 1; index <= 5; index++) {
                  if(index <=value.rate) { string +=`
                  <div class="fill-star me-1"></div>
                  `; } else { string +=`
                  <div class="empty-star me-1"></div>
                  `; }} return string; })()}
                </div>
              </div>
            </div>
            <p class="mb-0">${value.comment}</p>
          </div>
          <div class="d-flex-flex-column">
            <a target="_blank" href="/product/?product=${value.productID}">Product</a>
            <p class="mb-0">${value.date} - ${value.time}</p>
          </div>
          <div class="manage" comment-id="${value.commentID}">
            <i class="bi bi-check-circle text-success fs-4 fw-bold"></i>
            <i class="bi bi-x-circle text-danger fs-4 fw-bold ms-2"></i>
          </div>
        </div>`;
          this.mainBody.innerHTML += string;
        }
      }
    }
    return [comments, users];
  }

  sendData = async (comment ,body, status) => {
    this.loading.classList.remove("d-none");
    let response = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/comments/${comment.commentID}.json`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if(response.ok) {
      let log = {
        logType: "comment",
        logID: addProduct.uniqueID(),
        logMessage: status,
        commentID: comment.commentID,
        productID: comment.productID,
        time: new Date(),
        user: [crmUser.userName, crmUser.profileID]
      }
      await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/${log.logID}.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(log)
      });
      return true;
    }
  }

  async connectedCallback() {
    let information = await this.showComment();
    this.shadowRoot.addEventListener("click", async (element)=> {
      if(element.target.classList.contains("bi-check-circle")) {
        let commentID = element.target.parentElement.getAttribute("comment-id");
        let body = {
          checked: true,
          show: true,
        }
        let response = await (this.sendData(information[0][commentID], body, "approved"));
        if(response) {
          this.showComment();
        }
      }
    })
  }
}

export { commentReview }