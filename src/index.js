import * as $ from "jquery";
import {
  signUserUp,
  signUserOut,
  signUserIn,
  getUserDisplayName,
  fillUserInformation,
  cartItems,
  addProductToCart,
  removeProductFromCart,
} from "./model";

function changeRoute(e) {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace(`#`, ``);

  if (pageID == ``) {
    pageID = `home`;
  }
  $.get(`pages/${pageID}.html`, function (data) {
    $(`#app`).html(data);
  })
    .done(function () {
      initListenersByPage(pageID);
    })
    .fail(function (error) {
      $(`#app`).html(
        `<!DOCTYPE html><style>.error{font-family:monospace;margin-top:200px;margin-bottom:200px;padding:0 50px}.error .box{margin:0 auto;background-color:rgba(128,128,128,.356);width:fit-content;padding:30px 30px;width:100%;max-width:500px}.error .box span{font-family:sans-serif;font-size:15px}.error .box span{font-size:15px}</style><div class='error'><div class='box'><h1>Error</h1><p id='errorDetails'></p><p id='errorCode'></p></div></div>`
      );
      $(`#errorDetails`).html(`The page you are looking for '${pageID}' can not be found.`);
      $(`#errorCode`).html(`${error.status}: ${error.statusText}`);
    })
    .always(function () {
      //Add the active class to anchor tags with the same pageID as an href
      $(`a`).each(function () {
        if ($(this).attr(`href`) == undefined) return;
        let aHref = $(this).attr(`href`).replace(`#`, ``);
        if (aHref == pageID) {
          $(this).addClass(`active`);
        } else {
          $(this).removeClass(`active`);
        }
      });
    });
}

function initURLListener() {
  $(window).on(`hashchange`, changeRoute);
  changeRoute();
}

$(function () {
  initURLListener();
});

export function updateCartCount() {
  $(".cartCount").html(cartItems.length);
  if (cartItems.length == 1) {
    $(".itemCount").html(cartItems.length + " ITEM");
  } else {
    $(".itemCount").html(`${cartItems.length} ITEMS`);
  }
}

function initListenersByPage(pageID) {
  fillUserInformation();
  updateCartCount();
  switch (pageID) {
    case "home":
      $.get(`data/data.json`, function (data) {
        data.forEach((obj, productIndex) => {
          $("#productResults").append(`<div class="productCard" id="productCard${productIndex}">
      <div class="productBanner" style="background-color: ${obj.bannerColor}">
        <span style="color: ${obj.bannerTextColor}">${obj.banner}</span>
      </div>
      <div class="productCardImage" style="background-image: url(${obj.productImage})"></div>
      <div class="productColorSelect">
      </div>
      <p class="productName">${obj.productName}</p>
      <span class="productPrice">${obj.price_original}</span>
      <div class="rating">
        <div
          class="Stars"
          style="--rating: ${obj.rating}"
          aria-label="Rating of this product is ${obj.rating} out of 5."></div>
        <span>${obj.rating} <i>|</i> (${obj.ratings})</span>
      </div>
      <div class="freeShipping">
        <img
          src="https://images.keurig.com/is/content/keurig/Keurig-ssr-storefront/storefrontImages/icons/ShipsBy.svg"
          alt="FreeShip"
          title="FreeShip"
          class="free-ship-img"
          data-selector="PT_FreeShip_Image"
          width=""
          height="" />
        <span>Free shipping</span>
      </div>
      <div class="buyNowContainer">
        <button class="buyNowBtn" id="buyNow-product${productIndex}">BUY NOW</button>
      </div>
          </div>`);

          var colors = obj.colors;
          if (colors == undefined) return;
          colors.forEach((obj, index) => {
            console.log(obj.hex);
            $(`#productCard${productIndex} .productColorSelect`).append(`
              <div class="productColorEntry" id="productColorSelect-${productIndex}color${index}" style="background-color: ${obj.hex}">
                <div class="productColorEntryOutline" style="outline-color: ${obj.hex}"></div>
              </div>
            `);

            if (obj.selected == 1) {
              $(`#productColorSelect-${productIndex}color${index}`).addClass("selected");
            }
            $(`#productColorSelect-${productIndex}color${index}`).on("click", function () {
              $(this).addClass("selected");
              let clickColorElement = $(this);
              $(this)
                .parent()
                .find(".productColorEntry")
                .each(function () {
                  if ($(this).is(clickColorElement)) {
                    $(this).addClass("selected");
                  } else {
                    $(this).removeClass("selected");
                  }
                });

              $(this)
                .closest(".productCard")
                .find(".productCardImage")
                .css("background-image", `url(${obj.image})`);
            });
          });

          $(`#buyNow-product${productIndex}`).on("click", function () {
            addProductToCart(productIndex);
          });
        });
      });
      break;
    case "account":
      $(".signoutBtn").on("click", (e) => {
        signUserOut();
      });
      $("#createAccount-submit").on("click", (e) => {
        e.preventDefault();
        const email = $("#createAccount-email").val();
        const password = $("#createAccount-password").val();
        const displayName = $("#createAccount-displayName").val();
        signUserUp(displayName, email, password);
      });

      $("#signIn-submit").on("click", (e) => {
        e.preventDefault();
        const email = $("#signIn-email").val();
        const password = $("#signIn-password").val();
        signUserIn(email, password);
      });
      break;
    case "cart":
      reloadCartItems();
      break;
    default:
      break;
  }
}

export function reloadCartItems() {
  $("#cartItems").html("");
  if (cartItems.length != 0) {
    $("#noCartItemsMessage").css("display", "none");
  } else {
    $("#noCartItemsMessage").css("display", "block");
  }
  cartItems.forEach((obj, itemIndex) => {
    $("#cartItems").append(`<div class="productCard">
        <div class="productCardImage" style="background-image: url(${obj.productImage})"></div>
        <div class="productInfo">
          <p class="productName">${obj.productName}</p>
          <span class="productPrice">${obj.price_original}</span>
          <div class="rating">
            <div
              class="Stars"
              style="--rating: ${obj.rating}"
              aria-label="Rating of this product is ${obj.rating} out of 5."></div>
            <span>${obj.rating} <i>|</i> (${obj.ratings})</span>
          </div>
          <div class="freeShipping">
            <img
              src="https://images.keurig.com/is/content/keurig/Keurig-ssr-storefront/storefrontImages/icons/ShipsBy.svg"
              alt="FreeShip"
              title="FreeShip"
              class="free-ship-img"
              data-selector="PT_FreeShip_Image"
              width=""
              height="" />
            <span>Free shipping</span>
          </div>
          <div class="buyNowContainer">
            <button class="buyNowBtn" id="removeFromCart-index${itemIndex}">Remove from Cart</button>
          </div>
        </div>
      </div>`);
    $(`#removeFromCart-index${itemIndex}`).on("click", function () {
      removeProductFromCart(itemIndex);
    });
  });
}
