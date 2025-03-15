// // const { func } = require("promisify");

// const submit = document.getElementById('registerBtn');
// const login = document.getElementById('loginBtn');
// const form = document.getElementById('registerForm');
// const loginForm = document.getElementById('loginForm');
// submit.addEventListener('click', (e) => {
//     e.preventDefault(); // Prevent default form submission
//     if (registerValidation()) {
//         form.submit(); // Submit the form if validation passes
//     }
// });

// login.addEventListener('click',(e)=>{
//     e.preventDefault();
//     if(loginValidation()){
//         form.submit();
//     }
// })

// function registerValidation() {
//     const usernameField = document.getElementById('Username');
//     const passwordField = document.getElementById('password');

//     const username = usernameField.value;
//     const password = passwordField.value;

//     // Clear previous validation messages
//     usernameField.setCustomValidity('');
//     passwordField.setCustomValidity('');

//     // Username validation
//     if (username.length < 3) {
//         usernameField.setCustomValidity('Enter a valid username');
//         usernameField.reportValidity();
//         return false;
//     }

//     // Password validation
//     if (password.length < 8) {
//         passwordField.setCustomValidity('Password must be at least 8 characters long.');
//         passwordField.reportValidity();
//         return false;
//     }

//     return true;
// }

// function loginValidation(){
//     const email = document.getElementById('email');
//     const password = document.getElementById('password');

//     const emailField = email.value;
//     const passwordField = password.value;
//     if(passwordField.length<8){
//         password.setCustomValidity('Password must be 8 characters long.');
//         password.reportValidity();
//         return false;
//     }
//     return true;
// }