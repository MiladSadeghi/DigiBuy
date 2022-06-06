const loginInput = document.querySelector('#login-input');
const loginButton = document.querySelector('#login-btn');
const validateP = document.querySelector('#validation');

document.addEventListener("DOMContentLoaded", () => {
  loginInput.addEventListener("keyup", inputValidate)
})

const validateEmail = (email) => {
  return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : false;
};

const borderChange = () => {
  loginInput.style.border = "none";
  validation.innerHTML = "";
  loginInput.style.border = "1px solid green";
}

function inputValidate(event) {
  if (Number(loginInput.value) !== NaN && validateEmail(loginInput.value)) {
    borderChange();
  } else if (Number(loginInput.value) !== NaN && loginInput.value.length === 11) {
    borderChange();
  } else {
    validation.innerHTML = "Please enter a valid email address or phone number!";
    loginInput.style.border = "1px solid red";
  }
}