const showUserBtn = document.querySelector(".user-check");
let user;

document.addEventListener("DOMContentLoaded", async()=> {
  await loadUser();
  console.log(user);
})

async function loadUser() {
  let userCookie = Object.fromEntries(document.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent)));
  try {
    let userData = await fetch(`https://digibuy-da839-default-rtdb.europe-west1.firebasedatabase.app/users/${userCookie.userTable}.json`);
    if (!userData.ok) {
      throw new Error();
    }
    user = await userData.json();
    user["profileID"] = userCookie.userTable;
    showUserBtn.innerHTML = `<a id="login" type="button" href="#" class="btn btn-primary py-0">${user.userName} <i class="bi bi-arrow-right ms-2"></i></a>`;
  } catch (error) {
    showUserBtn.innerHTML = `<a id="login" type="button" href="./login/" class="btn btn-primary py-0"><i style="font-size: 1.5rem;" class="bi bi-box-arrow-in-right"></i>&nbsp;&nbsp; Login&nbsp; | &nbsp;Register</a>`
  }
}