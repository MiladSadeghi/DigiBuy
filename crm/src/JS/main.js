const dropDownMenu = document.querySelector('.dropdown');
const dropDownMenuOption = document.querySelector('.option');
const profileBtnArrow = document.querySelector(".bi-arrow-down")

document.addEventListener("DOMContentLoaded", ()=> {
  dropDownMenu.addEventListener('click', ()=> {
    profileBtnArrow.classList.toggle('rotateArrow');
    dropDownMenuOption.classList.toggle('active');
  })
})