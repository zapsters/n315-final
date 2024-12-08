import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { updateCartCount, reloadCartItems } from "./index.js";

export let cartItems = [];

import * as $ from "jquery";
import { app, db } from "./firebaseConfig";

let uid = "";
const auth = getAuth(app);

export function addProductToCart(productIndex) {
  console.log(productIndex);

  $.get(`data/data.json`, function (data) {
    cartItems.push(data[productIndex]);
    console.log(cartItems);

    updateCartCount();
    reloadCartItems();
  });
}

export function removeProductFromCart(cartItemIndex) {
  cartItems.splice(cartItemIndex, 1);
  updateCartCount();
  reloadCartItems();
  console.log(cartItems);
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    console.log(user);

    uid = user.uid;
    $(".displayName").html(getUserDisplayName());
    $(".loginStatus").html("signed in");
    $(".signoutBtn").show();
    $(".loginBtn").hide();
    $(".yourRecipes").show();
    $(".createRecipe").show();
  } else {
    $(".displayName").html("no user found.");
    $(".loginStatus").html("not signed in");
    $(".signoutBtn").hide();
    $(".loginBtn").show();
    $(".yourRecipes").hide();
    $(".createRecipe").show();
  }
});

export function fillUserInformation() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    uid = user.uid;
    $(".displayName").html(getUserDisplayName());
    $(".loginStatus").html("signed in");
    $(".signoutBtn").show();
    $(".loginBtn").hide();
    $(".yourRecipes").show();
    $(".createRecipe").show();
  } else {
    console.log("no current user");
    $(".displayName").html("no user found.");
    $(".loginStatus").html("not signed in");
    $(".signoutBtn").hide();
    $(".loginBtn").show();
    $(".yourRecipes").hide();
    $(".createRecipe").show();
  }
}

export function signUserUp(firstName, email, password) {
  // console.log(`${firstName}, ${lastName}, ${email}, ${password}`);
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateProfile(auth.currentUser, {
        displayName: `${firstName}`,
      })
        .then(() => {
          // Profile updated!
          $("#createAccount-response").html("account created!");
        })
        .catch((error) => {
          // An error occurred
          $("#createAccount-response").html(
            "account created, but error setting display name",
            error
          );
        });
      const user = userCredential.user;
      console.log(user, "userCreated");
      window.location.hash = "";
    })
    .catch((error) => {
      console.log(error);
      $("#createAccount-response").html(error.code);
    });
}

export function signUserOut() {
  signOut(auth)
    .then(() => {
      console.log("signout!");
      $("#signIn-response").html("Signed Out!");
    })
    .catch((error) => {
      console.log("Error" + error);
      $("#signIn-response").html(error);
    });
}

export function signUserIn(siEmail, siPassword) {
  signInWithEmailAndPassword(auth, siEmail, siPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("signed in!", user);
      $("#signIn-response").html("Signed In!");
      // window.location.hash = "";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      $("#signIn-response").html(errorCode);
    });
}

export function getUserDisplayName() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;

    return displayName;
  }
  return "anonymous";
}
