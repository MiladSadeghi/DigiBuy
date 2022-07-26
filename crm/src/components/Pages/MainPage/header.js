const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="/node_modules/bootstrap-icons/font/bootstrap-icons.css">
  <link rel="stylesheet" href="/crm/src/components/Pages/MainPage/header.css">
  <div class="main pt-2 px-3">
    <div class="rounded-3">
      <h4>Top Page Slider</h4>
      <div class="sliders mb-2">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
        <input class="form-control slider-item" type="text">
      </div>
      <button class="btn btn-primary w-100" id="slider-submit">Slider Updated</button>
    </div>
    <hr>
    <div class="rounded-3">
      <h4>Product Offer</h4>
      <div class="offers mb-2">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
        <input class="form-control offer-item" type="text">
      </div>
      <button class="btn btn-primary w-100" id="offer-submit">Offer Updated</button>
    </div>
  </div>
`;


class headerSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.sliders = this.shadowRoot.querySelector(".sliders");
    this.sliderItems = this.shadowRoot.querySelectorAll(".slider-item");
    this.offersItem = this.shadowRoot.querySelectorAll(".offer-item");
    this.submitSliders = this.shadowRoot.querySelector("#slider-submit");
    this.submitOffer = this.shadowRoot.querySelector("#offer-submit");
  }

  sendSliders = async () => {
    this.submitSliders.classList.add("disabled");
    this.submitSliders.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Loading...`;
    let getSliders = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/pages/sliders.json`)).json() || [];
    this.sliderItems.forEach((element, index) => {
      if(element.value !== ""){
        getSliders[index] = element.value.split(",");
      }
    });
    getSliders = getSliders.filter(function (el) {
      return el != null;
    });
    console.log(getSliders);
    let putSliders = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/pages/sliders.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
        },
      body: JSON.stringify(getSliders)
    })
    if(putSliders.status === 200){
      alert("Sliders updated");
    }
    this.submitSliders.classList.remove("disabled");
    this.submitSliders.innerHTML = `Sidebar Updated`;
  }

  sendOffers = async () => {
    this.submitOffer.classList.add("disabled");
    this.submitOffer.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Loading...`;
    let getOffers = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/pages/offers.json`)).json() || [];
    this.offersItem.forEach((element, index) => {
      if(element.value !== ""){
        getOffers.push(element.value);
      }
    });
    let putOffers = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/pages/offers.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
        },
      body: JSON.stringify(getOffers)
    })
    if(putOffers.status === 200){
      alert("Cards updated");
    }
    this.submitOffer.classList.remove("disabled");
    this.submitOffer.innerHTML = `Offer Updated`;
  }

  async load() {
    let getSliders = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/pages/sliders.json`)).json() || [];
    let getOffers = await (await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/pages/offers.json`)).json() || [];
    if(getSliders.length > 0){
      getSliders.forEach((element, index) => {
        this.sliderItems[index].value = element[0]+", "+element[1];
      });
    }
    if(getOffers.length > 0){
      getOffers.forEach((element, index) => {
        this.offersItem[index].value = element;
      });
    }
  }

  async connectedCallback() {
    await this.load();
    this.submitSliders.addEventListener("click", this.sendSliders);
    this.submitOffer.addEventListener("click", this.sendOffers);
  }
}

export { headerSlider };