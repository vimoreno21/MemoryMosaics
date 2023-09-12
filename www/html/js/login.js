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
/*
function setCookie(name, value, expires) {
  // Add "Secure" attribute to enforce HTTPS-only transmission
  const secureFlag = location.protocol === "https:" ? "; secure" : "";
  
  // Set "SameSite" attribute to "Lax"
  const sameSiteAttribute = "; samesite=Lax";
  
  // Combine all attributes
  const cookieAttributes = `expires=${expires}; path=/${secureFlag}${sameSiteAttribute}`;
  
  document.cookie = `${name}=${value}; ${cookieAttributes}`;
}
*/
/*
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
*/

// Function to set a value in session storage
function setSessionStorageItem(key, value) {
  sessionStorage.setItem(key, value);
}

// Function to retrieve a value from session storage
function getSessionStorageItem(key) {
  return sessionStorage.getItem(key);
}

// Check for the 'username' cookie and populate the login field
document.addEventListener("DOMContentLoaded", function () {
  const loginField = document.getElementById("Login");
  const rememberPasswordCheckbox = document.getElementById("rememberme");
  const loginButton = document.getElementById("loginButton");
  //const usernameCookie = getCookie('username');
  const usernameSession = getSessionStorageItem('username');
  const passwordField = document.getElementById("Password");

  /*
  if (usernameCookie) {
    loginField.value = usernameCookie;
  }
  */
  
  if (usernameSession) {
    loginField.value = usernameSession;
  }

  // Check for saved password cookie and autofill the password field
  /*
  const savedPassword = getCookie("password");
  if (savedPassword) {
    passwordField.value = savedPassword;
  }*/
  
  // Check for saved password in session storage and autofill the password field
  const savedPasswordSession = getSessionStorageItem("password");
  if (savedPasswordSession) {
    passwordField.value = savedPasswordSession;
  }
});

// Attach a click event listener to the login button
loginButton.addEventListener("click", function () {
  const passwordField = document.getElementById("Password");
  const password = passwordField.value;
  const rememberPassword = getRememberPasswordValue();

  // Check if the "Remember Password" checkbox is checked
  /*
  if (rememberPassword) {
    // Set a cookie with the password (use secure practices for storing passwords)
    setCookie("password", password, 30); // Store password for 1 month
  } else {
    // Remove the password cookie if the checkbox is not checked
    setCookie("password", "", -1); // Expire the cookie immediately
  }*/
  
   if (rememberPassword) {
    // Set a value in session storage with the password
    setSessionStorageItem("password", password);
  } else {
    // Remove the password from session storage if the checkbox is not checked
    sessionStorage.removeItem("password");
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
        /*
        const expirationDate = new Date(); // By default, a session cookie
        expirationDate.setHours(expirationDate.getHours() + 1); // Adjust as needed
        setCookie('userId', userId, expirationDate);
        setCookie('firstName', firstName, expirationDate);
        setCookie('lastName', lastName, expirationDate);

        // Set a cookie for the username
        setCookie('username', username, expirationDate);
        */
        
        // Set values in session storage for the user's session
        setSessionStorageItem('userId', userId);
        setSessionStorageItem('firstName', firstName);
        setSessionStorageItem('lastName', lastName);

        // Set a value in session storage for the username
        setSessionStorageItem('username', username);

        window.location.href = "contact.html";
      }
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}
