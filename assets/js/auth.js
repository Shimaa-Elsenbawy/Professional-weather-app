const registerBox = document.getElementById("registerBox");
const loginBox = document.getElementById("loginBox");

const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const profileImage = document.getElementById("profileImage");
const imagePreview = document.getElementById("imagePreview");



console.log("registerBox:", registerBox);
console.log("loginBox:", loginBox);
console.log("showLogin:", showLogin);
console.log("showRegister:", showRegister);
showLogin.addEventListener("click", () => {

    registerBox.classList.add("hidden");
    loginBox.classList.remove("hidden");

});


showRegister.addEventListener("click", () => {

    loginBox.classList.add("hidden");
    registerBox.classList.remove("hidden");

});



let selectedImage = "";

profileImage.addEventListener("change", () => {

    const file = profileImage.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {

        selectedImage = reader.result;

        imagePreview.src = selectedImage;

        imagePreview.parentElement.style.display = "block";

    };

    reader.readAsDataURL(file);

});


registerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if (password !== confirmPassword) {

        alert("Passwords do not match!");

        return;
    }


    const users =
        JSON.parse(localStorage.getItem("users")) || [];


    const existingUser =
        users.find(user => user.email === email);


    if (existingUser) {

        alert("This email is already registered!");

        return;
    }


    const newUser = {

        id: crypto.randomUUID(),

        name: name,

        email: email,

        password: password,

        image: selectedImage || ""

    };


    users.push(newUser);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Account created successfully!");


    registerForm.reset();

    selectedImage = "";

    imagePreview.src = "";

    imagePreview.parentElement.style.display = "none";


    registerBox.classList.add("hidden");

    loginBox.classList.remove("hidden");

});



loginForm.addEventListener("submit", (e) => {

    e.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const user =
        users.find(
            user =>
                user.email === email &&
                user.password === password
        );


    if (!user) {

        alert("Email or password is incorrect!");

        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );


    alert(`Welcome ${user.name}!`);

    window.location.href = "index.html";

});