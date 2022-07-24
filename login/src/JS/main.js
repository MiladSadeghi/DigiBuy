const loginInput = document.querySelector('#login-input');
const checkLoginValid = document.querySelector('#check-acc-btn');
const validateP = document.querySelector('#validation');
const multiStepForm = document.querySelector("[data-multi-step]")
const formSteps = [...multiStepForm.querySelectorAll("[data-step]")]
const displayName = document.querySelector('#display-name');
const registerEmail = document.querySelector("#email")
const registerPhoneNumber = document.querySelector("#phone-number");
const registerPassword = document.querySelector("#password");
const registerValdation = document.querySelectorAll(".register-message")
const registerSubmitButton = document.querySelector("#register-btn");
const strengthBar = document.querySelector(".strength");
const loadingLoginPage = document.querySelector("#loading1")
const loadingRegisterPage = document.querySelector("#loading2")
const toastElList = document.querySelectorAll('.toast')
const toastBody = document.querySelector(".toast-body")
const passwordLoginInput = document.querySelector("#passwordLogin");
const loginBtn = document.querySelector("#login-btn");

let date = new Date();
date.setYear(2080);

let typeOfLogin;
let toastList;
let data;
let user;

let parameters = {
  count: false,
  letters: false,
  numbers: false,
  special: false
}

let currentStep = formSteps.findIndex(step => {
  return step.classList.contains("active")
})

const uniqueID = (() => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
})();

if (currentStep < 0) {
  currentStep = 0
  showCurrentStep()
}

formSteps.forEach(step => {
  step.addEventListener("animationend", e => {
    formSteps[currentStep].classList.remove("hide")
    e.target.classList.toggle("hide", !e.target.classList.contains("active"))
  })
})

function showCurrentStep() {
  formSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep)
  })
}

function strengthChecker(e) {
  parameters.letters = (/[A-Za-z]+/.test(registerPassword.value)) ? true : false;
  parameters.numbers = (/[0-9]+/.test(registerPassword.value)) ? true : false;
  parameters.special = (/[!\"$%&/()=?@~`\\.\';:+=^*_-]+/.test(registerPassword.value)) ? true : false;
  parameters.count = (registerPassword.value.length > 7) ? true : false;

  let barLength = Object.values(parameters).filter(value => value);
  switch (barLength.length) {
    case 0:
      strengthBar.style.width = "0%";
      strengthBar.style.background = "#ff3e36";
      classCorrect(e.target, "correct", "not-correct");
      return false;
      break;
    case 1:
      strengthBar.style.width = "25%";
      strengthBar.style.background = "#ff3e36";
      classCorrect(e.target, "correct", "not-correct");
      return false;
      break;
    case 2:
      strengthBar.style.width = "50%";
      strengthBar.style.background = "#ff691f";
      if (parameters.count) {
        classCorrect(e.target, "not-correct", "correct");
        return true;
      } else {
        return false;
      }
      break;
    case 3:
      strengthBar.style.width = "75%";
      strengthBar.style.background = "#ffda36";
      if (parameters.count) {
        classCorrect(e.target, "not-correct", "correct");
        return true;
      } else {
        return false;
      }
      break;
    case 4:
      strengthBar.style.width = "100%";
      strengthBar.style.background = "#0be881";
      if (parameters.count) {
        classCorrect(e.target, "not-correct", "correct");
        return true;
      } else {
        return false;
      }
      break;
  }
}

const classCorrect = (e, remove, add) => {
  e.classList.remove(remove);
  e.classList.add(add);
}

function registerBtnVisibility() {
  const situ = document.querySelectorAll("#main2 .correct")
  if (situ.length === 4) {
    registerSubmitButton.classList.remove("disabled");
    return situ;
  } else {
    registerSubmitButton.classList.add("disabled");
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  registerSubmitButton.classList.add("disabled");
  toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl))
  loginInput.addEventListener("input", () => {
    inputValidate(loginInput, validateP);
  })
  checkLoginValid.addEventListener("click", () => {
    let input = inputValidate(loginInput, validateP);
    if (input) {
      (input === "email") ? (registerEmail.value = loginInput.value, registerEmail.classList.add("correct"), registerEmail.disabled = true) : (registerPhoneNumber.value = loginInput.value, registerPhoneNumber.classList.add("correct"), registerPhoneNumber.disabled = true);
      loadingLoginPage.removeAttribute('hidden');
      typeOfLogin = input;
      checkLogin(input);
    }
  })
  displayName.addEventListener("input", (e) => {
    if (e.target.value.length > 2) {
      borderChange(e.target, registerValdation[0]);
      registerBtnVisibility();
    } else {
      registerValdation[0].innerHTML = "Please enter a valid name!";
      classCorrect(e.target, "correct", "not-correct");
    }
  })
  registerEmail.addEventListener("input", (e) => {
    if (validateEmail(e.target.value)) {
      borderChange(e.target, registerValdation[1]);
      registerBtnVisibility();
    } else {
      registerValdation[1].innerHTML = "Please enter a valid email address!";
      classCorrect(e.target, "correct", "not-correct");
    }
  })
  registerPhoneNumber.addEventListener("input", (e) => {
    if (e.target.value.length >= 11) {
      borderChange(e.target, registerValdation[2]);
      registerBtnVisibility();
    } else {
      registerValdation[2].innerHTML = "Please enter a valid phone number!";
      classCorrect(e.target, "correct", "not-correct");
    }
  })
  registerPassword.addEventListener("input", (e) => {
    if (strengthChecker(e)) {
      registerBtnVisibility();
    }
  })
  registerSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    let situ = registerBtnVisibility();
    if (situ) {
      registerUser(situ);
    }
  })
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (loginInput.value === (data.email || data.phoneNumber) && passwordLoginInput.value === user.password) {
      toastBody.innerHTML = "Login Successful!";
      toastElList[0].classList.remove("text-bg-danger")
      toastElList[0].classList.add("text-bg-success")
      toastList[0].show();
      document.cookie = `userTable=${data.id};path=/;expires=${date}`;
      setTimeout(() => {
        if(window.location.hostname === 'miladsadeghi.github.io') {
          window.location = "/DigiBuy/";
        } else {
          window.location = '/'
        }
      }, 2000);
    } else {
      toastBody.innerHTML = "Login Failed!";
      toastElList[0].classList.add("text-bg-danger")
      toastElList[0].classList.remove("text-bg-success")
      toastList[0].show();
    }
  })
})

const validateEmail = (email) => {
  return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : false;
};

const borderChange = (input, validationMessagePath) => {
  validationMessagePath.innerHTML = "";
  input.classList.remove("not-correct");
  input.classList.add("correct")
}

function inputValidate(input, validateMessage) {
  if (Number(input.value) !== NaN && validateEmail(input.value)) {
    borderChange(loginInput, validateP);
    return "email";
  } else if (Number(input.value) !== NaN && input.value.length === 11) {
    borderChange(loginInput, validateP);
    return "phoneNumber";
  } else {
    validateMessage.innerHTML = "Please enter a valid email address or phone number!";
    input.classList.remove("correct");
    input.classList.add("not-correct");
    return false
  }
}

async function checkLogin() {
  let apiGet = "https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/validAcc.json";
  let response, validAccount;
  try {
    response = await fetch(apiGet);
    validAccount = await response.json();
  } catch (error) {
    toastBody.innerHTML = "Something went wrong, please try again later!";
    toastElList[0].classList.add("text-bg-danger")
    toastElList[0].classList.remove("text-bg-success")
    toastList[0].show();
    loadingLoginPage.setAttribute('hidden', '');
    return
  }
  loadingLoginPage.setAttribute('hidden', '');
  for (const [key, value] of Object.entries(validAccount)) {
    if (value[`${typeOfLogin}`] === loginInput.value) {
      data = value;
    }
  }
  if (data) {
    currentStep = 2;
    await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${data.id}.json`).then(res => res.json()).then(res => {
      user = res;
    })
    showCurrentStep();
  } else {
    currentStep = 1;
    showCurrentStep();
  }
}

async function sendDATA(url, data, methode) {
  let response = await fetch(url, {
    method: methode,
    contentType: "application/json",
    body: JSON.stringify(data)
  })
  let result = await response.json();
  return await result
}

async function registerUser(input) {
  let createUserTable = {
    "userName": input[0].value,
    "email": input[1].value,
    "phoneNumber": input[2].value,
    "password": input[3].value,
    "userID": uniqueID,
    "type": "user",
    "basket": [],
    "notification": [],
    "dashboard": {
      "orders": [],
      "wishlist": [],
      "reviews": [],
      "recentlyViewed": []
    },
  }
  let createValidAccountTable = {
    "email": input[1].value,
    "phoneNumber": input[2].value,
    "id": uniqueID
  }
  loadingRegisterPage.removeAttribute('hidden');
  let checkValidAccount = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/validAcc.json`);
  let validAccount = await checkValidAccount.json();
  for (const [key, value] of Object.entries(validAccount)) {
    if (typeOfLogin === "email" && value["phoneNumber"] === registerPhoneNumber.value) {
      registerPhoneNumber.innerHTML = "";
      registerValdation[2].innerHTML = "Enter another phone number!";
      loadingRegisterPage.setAttribute('hidden', '');
      return
    } else if (typeOfLogin === "phoneNumber" && value["email"] === registerEmail.value) {
      registerEmail.innerHTML = "";
      registerValdation[1].innerHTML = "Enter another email address!";
      loadingRegisterPage.setAttribute('hidden', '');
      return
    }
  }

  let apiCreateUserPost = `https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${uniqueID}.json`;
  await sendDATA(apiCreateUserPost, createUserTable, "PATCH");
  let apiValidAccountPost = "https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/validAcc.json";
  await sendDATA(apiValidAccountPost, createValidAccountTable, "POST");
  toastBody.innerHTML = "You have successfully registered!";
  document.cookie = `userTable=${uniqueID};path=/;expires=${date}`;
  toastElList[0].classList.remove("text-bg-danger")
  toastElList[0].classList.add("text-bg-success")
  toastList[0].show();
  loadingRegisterPage.setAttribute('hidden', '');
  setTimeout(() => {
    if(window.location.hostname === 'miladsadeghi.github.io') {
      window.location = "/DigiBuy/";
    } else {
      window.location = '/'
    }
  }, 2000);
}