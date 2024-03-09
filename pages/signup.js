// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword,
 } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { 
    ref,
    set,
    getDatabase,
    push,
    onValue,
 } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCOaoBPCp9a0kIA2pBn_a5kdwcAOG0-R7U",
    authDomain: "todolist-a9e5c.firebaseapp.com",
    databaseURL: "https://todolist-a9e5c-default-rtdb.firebaseio.com",
    projectId: "todolist-a9e5c",
    storageBucket: "todolist-a9e5c.appspot.com",
    messagingSenderId: "462599535508",
    appId: "1:462599535508:web:3e088d877930318060ad81",
    measurementId: "G-18S0J63YPD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
const auth = getAuth();


var model = {};
var userName = document.getElementById("userName");
var email = document.getElementById("email");
var password = document.getElementById("password");

window.signUp = function (e) {
    e.preventDefault();
    model.userName = userName.value;
    model.email = email.value;
    model.password = password.value;
    console.log(model);

    createUserWithEmailAndPassword(auth, model.email, model.password)
        .then(function (res) {
            console.log(res.user.uid, "success response")
            model.id = res.user.uid;
            var reference = ref(database, `users/${model.id}`);
            set(reference, model)
                .then(function (dbRes) {
                    alert("user created successfully");
                    // After successful signup, hide the signup form
                    var signUpForm = document.getElementById("signUpForm");
                    signUpForm.style.display = "none";

                    // Show the login form
                    var loginForm = document.getElementById("loginForm");
                    loginForm.style.display = "block"
                })
                .catch(function (dbErr) {
                    alert(dbErr.message);
                });
            userName.value = "";
            email.value = "";
            password.value = "";
        })
        .catch(function (err) {
            console.log(err, "error response");
            alert(err.message);
        })

}