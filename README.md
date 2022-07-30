<p align="center">
<a href="" rel="noopener">
 <img src="https://s6.uupload.ir/files/digibuy_m56x.png" alt="Digibuy demo"></a>
</p>

<h3 align="center"><a href="digibuy.miladsdgh.ir" target="_blank">DigiBuy</a></h3>

<div align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/MiladSadeghi/DigiBuy?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/MiladSadeghi/DigiBuy?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/MiladSadeghi/DigiBuy?color=56BEB8">
</div>

---

<p align="center"> Open source shopping website with CRM!.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Built Using](#built_using)
- [Project](#project)
- [Warning](#warning)
- [License](#license)
- [Authors](#authors)

## 🧐 About <a name = "about"></a>

A store with CRM and full responsive. I call it Digibuy.also Firebase realtime database are used as database. 
If you are new to front-end, you can consider this project as a stepping stone to the next step, which can be react or anything else.
## 🏁 Getting Started <a name = "getting_started"></a>

Generally, you don't need to do anything special, you just need to install the packages by npm after clone.

## ⛏️ Built Using <a name = "built_using"></a>

- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Bootstrap Icon](https://icons.getbootstrap.com/) - icons
- [SASS](https://sass-lang.com/) - CSS Pre Processor


## :card_file_box: Project <a name = "Project"></a>

digibuy is a component-based project, almost! The CRM section is complete and in the main sections, only the shopping cart and navbar are components, because they are used in most of the sections.

#### basket & navbar
When you enter the website, an id called guestID is created for you in the database and stored in the cookie. and stores the basket information in database. Then after login or registration, all contents will be transferred to your userID and removed from the cookie.

```javascript
  getUser() {
    let userCookie = Object.fromEntries(document.cookie.split('; ').map(v => v.split(/=(.*)/s).map(decodeURIComponent))); // get all cookies
    let id = this.uniqueID(); // create id
    if(!userCookie.guestID && !userCookie.userTable) {
      document.cookie = `guestID=${id};path=/;expires=${this.date}`;
      this.userID = id;
      // if its your first time open website, create guest id for you
    } else if(userCookie.guestID && !userCookie.userTable) {
      this.userID = userCookie.guestID;
      this.db = "guest"
      // if its not your first time, we put userID as your guestID.
      // Then we find out that information should be taken from the guest table.
    } else if(userCookie.userTable) {
      this.guestID = userCookie.guestID;
      this.userID = userCookie.userTable;
      this.db = "users";
      this.moveGuestBasket(userCookie.guestID, userCookie.userTable);
      // if you are login or register, We do the same as the previous steps,
      // with the difference that we set the database table as user and transfer all the information 
      // in the guest to the user.
    }
  }
```
The basket section is separate from the navbar. navbar takes all the products and users once and if there is a logged-in user in the cookie, it will view the profile section. But if not, it goes to the login section. In the same way, the basket takes the user once, and on the product page, all the products.

> The navbar and basket components are located in the /src/components/ path


## CRM
> To enter crm you need to go to /crm.

#### Order Search
<img src="https://s6.uupload.ir/files/digibuy.miladsdgh.ir_crm_checked_2323_q28f.png">
This section is related to the search about the orders that the customers have registered. The search has different filters, orderID, userID, username, which are quite clear. Uncheck refers to orders that have not been checked yet, and Checked is the opposite. You can also click on the detail view to see the order information. In the detail section, you can change the number of products in the order, order status and payment amount.


### User
<img src="https://s6.uupload.ir/files/user_r51p.png">
As it was said, all CRM parts are related to each other in the form of components, and if there is a search in a part, it means that a search must be done first in order to change or create something. This part, like all parts, has a filter. and when you click on view detail, you can change all the person's information.

### Product
<img src="https://s6.uupload.ir/files/23232322_i9gv.png">
It consists of three parts, adding a product, changing a product, and searching for a product. In the search section, there are filters like the previous searches, to change a product, it is enough to hover over the product and click on the edit button, then you can change the product information or delete that product.

### Comments
<img src="https://s6.uupload.ir/files/digibuy.miladsdgh.ir_crm_(7)_umy8.png">
In this section, you can see the comments and approve or reject them. You can also see which product has been commented on.

### Pages
<img src="https://s6.uupload.ir/files/main_page_bt0.png">
By default, there is only the main page in this section. If you have an idea about other parts, open an issue and I will check it. On this page, you can change the slider and product offers.
for change the image slider of main page you should do something like that:

```
  PhotoLink 1, PhotoLink2, Search Query
  PhotoLink 1 will be displayed for resolutions higher than 840px
  PhotoLink 2 will be displayed for resolutions lower than 840px
  Search Query is for the address where that picture wants to go
```

and for offer, you just need put the product id on the inputs

### Log
<img src="https://s6.uupload.ir/files/crm_(2)_67sx.png">
The last part of CRM is the log. Through this page, you can find the cause of the problems.. (doesn't log do the same?)

# :warning: Warning <a name = "warning"></a>
Do not use the database I used in my project.


## License
MIT © [@miladsadeghi](https://github.com/MiladSadeghi)
## ✍️ Authors <a name = "authors"></a>

- [@miladsadeghi](https://github.com/MiladSadeghi) - Idea & Initial work

