// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, signInWithEmailAndPassword,
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
var email = document.getElementById("email");
var password = document.getElementById("password");
var todoContainer = document.getElementById("todoDisplay");
var input = document.getElementById("input");
var todosReference; 

window.logIn = function (e) {
    e.preventDefault();
    console.log("Todo container visibility:", todoContainer.style.display);
    todoContainer.style.display = "block";

    var loginForm = document.getElementById("loginForm");
    loginForm.style.display = "none";
    
    model.email = email.value;
    model.password = password.value;
    console.log(model);

    signInWithEmailAndPassword(auth, model.email, model.password)
        .then(function (res) {
            console.log(res.user.uid, "success response")
            model.id = res.user.uid;

            // todoContainer.style.display = "block";

            todosReference = ref(database, `users/${model.id}/todos`);

            // Call the displayTodos function to show todos on login
            displayTodos();

            // Listen for changes in todos and update the displayed todos accordingly
            onValue(todosReference, function () {
                displayTodos();
            });

            email.value = "";
            password.value = "";
        })
        .catch(function (err) {
            console.log(err, "error response");
            alert(err.message);

            todoContainer.style.display = "none";
        });
}
function displayTodos() {
    onValue(todosReference, function (snapshot) {
        todoContainer.innerHTML = "";

        snapshot.forEach(function (todoSnapshot) {
            var todoData = todoSnapshot.val();
            var makePara = document.createElement('p');
            makePara.textContent = todoData.text;
            makePara.classList.add('newPara');

            // Delete button
            var deleteBtn = createButton('Delete', 'forDele', function () {
                delFun(todoSnapshot.key); // Pass the todo key for deletion
            });

            // Edit button
            var editBtn = createButton('Edit', 'forEdit', function () {
                editFun(todoSnapshot.key); // Pass the todo key for editing
            });

            // Append the delete and edit buttons to the paragraph
            makePara.appendChild(deleteBtn);
            makePara.appendChild(editBtn);

            // Append the paragraph to the todoContainer
            todoContainer.appendChild(makePara);
        });
    });
}

function addTodo() {
    var newText = input.value.trim();
    if (newText !== "") {
        var newTodoReference = push(todosReference); // Generate a unique key for the new todo
        set(newTodoReference, { text: newText })
            .then(function () {
                console.log("Todo added successfully");
                displayTodos();
            })
            .catch(function (err) {
                console.error("Error adding todo:", err.message);
            });
        input.value = "";
    }
}

// Modify the delFun function to delete todos from the database
function delFun(todoKey) {
    // Add a confirmation prompt
    var confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
        var todoToDeleteReference = child(todosReference, todoKey);
        remove(todoToDeleteReference)
            .then(function () {
                console.log("Todo deleted successfully");
                displayTodos(); // Update the displayed todos
            })
            .catch(function (err) {
                console.error("Error deleting todo:", err.message);
            });
    }
}

// Modify the deleteAll function to delete all todos from the database
function deleteAll() {
    // Add a confirmation prompt
    var confirmation = confirm("Are you sure you want to delete all todos?");
    if (confirmation) {
        remove(todosReference)
            .then(function () {
                console.log("All todos deleted successfully");
                displayTodos(); // Update the displayed todos
            })
            .catch(function (err) {
                console.error("Error deleting all todos:", err.message);
            });
    }
}

// Helper function to create a button element
function createButton(text, className, clickHandler) {
    var button = document.createElement('button');
    var buttonText = document.createTextNode(text);
    button.appendChild(buttonText);
    button.classList.add(className);
    button.addEventListener('click', function () {
        clickHandler(this);
    });
    return button;
}
