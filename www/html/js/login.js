const urlBase = 'http://165.227.208.98/LAMPAPI';
let userId = 0;
let firstName = "";
let lastName = "";

const submitBtn = document.getElementById("submit-login-btn");

// Function to get the value of the 'rememberme' checkbox
function getRememberPasswordValue() {
  return document.getElementById("rememberme").checked;
}

// Function to set a cookie
function setCookie(name, value, expires) {
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie;
  const cookieArray = cookies.split('; ');
  for (const cookie of cookieArray) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

// Check for the 'username' cookie and populate the login field
document.addEventListener("DOMContentLoaded", function () {
  const loginField = document.getElementById("Login");
  const rememberPasswordCheckbox = document.getElementById("rememberme");
  const loginButton = document.getElementById("loginButton");
  const usernameCookie = getCookie('username');
  const passwordField = document.getElementById("Password");

  if (usernameCookie) {
    loginField.value = usernameCookie;
  }

  // Check for saved password cookie and autofill the password field
  const savedPassword = getCookie("password");
  if (savedPassword) {
    passwordField.value = savedPassword;
  }
});

// Attach a click event listener to the login button
loginButton.addEventListener("click", function () {
  const passwordField = document.getElementById("Password");
  const password = passwordField.value;
  const rememberPassword = getRememberPasswordValue();

  // Check if the "Remember Password" checkbox is checked
  if (rememberPassword) {
    // Set a cookie with the password (use secure practices for storing passwords)
    setCookie("password", password, 30); // Store password for 1 month
  } else {
    // Remove the password cookie if the checkbox is not checked
    setCookie("password", "", -1); // Expire the cookie immediately
  }
});

function login() {
  userId = 0;
  firstName = "";
  lastName = "";

  const username = document.getElementById("Login").value;
  const password = document.getElementById("Password").value;

  document.getElementById("loginResult").innerHTML = "";

  let tmp = { Login: username, Password: password };
  let jsonPayload = JSON.stringify(tmp);
  console.log(jsonPayload);
  let url = urlBase + '/Login.php';

  let xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(this.responseText);
        userId = jsonObject.ID;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.FirstName;
        lastName = jsonObject.LastName;

        // Set a cookie for the user's session
        const expirationDate = new Date(); // By default, a session cookie
        expirationDate.setHours(expirationDate.getHours() + 1); // Adjust as needed
        setCookie('userId', userId, expirationDate);
        setCookie('firstName', firstName, expirationDate);
        setCookie('lastName', lastName, expirationDate);

        window.location.href = "contact.html";
      }
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}
