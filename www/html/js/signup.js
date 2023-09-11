console.log("Script is running");

const urlBase = 'http://165.227.208.98/LAMPAPI';

function setCookie(name, value, days) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieValue;
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.forms.signup; // Get the form by its name attribute

    function signup() {
        let userId = 0; // Declare these variables here
        let firstName = "";
        let lastName = "";

        const inputFirstName = document.getElementById("firstName").value; // Rename these variables
        const inputLastName = document.getElementById("lastName").value;
        const username = document.getElementById("login").value;
        const password = document.getElementById("password").value;

        document.getElementById("signupResult").innerHTML = "";
        console.log(username);
        console.log(password);
        // Check if any required fields are empty
        if (!inputFirstName || !inputLastName || !username || !password) {
            document.getElementById("signupResult").innerHTML = "Please fill in all required fields.";
            return;
        }

        let tmp = {
            FirstName: inputFirstName,
            LastName: inputLastName,
            Login: username,
            Password: password,
        };
        let jsonPayload = JSON.stringify(tmp);
        console.log(jsonPayload);
        let url = urlBase + '/Register.php';

        let xhr = new XMLHttpRequest();

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    let jsonObject = JSON.parse(this.responseText);
                    userId = jsonObject.ID;

                    if (jsonObject.error == "Login username already exists. Try again with a different login.") {
                        alert("Username is already taken. Please choose a different username.");
                        return;
                    }

                    // Registration successful, you can handle the success scenario here
                    document.getElementById("signupResult").innerHTML = "Registration successful!";

                    setCookie('username', username, 1); // Set it to expire in 1 day
                    // You can redirect to a login page or another page as needed.
                     window.location.href = "index.html";
                }
            };

            xhr.send(jsonPayload);
            console.log("registration successful");
        } catch (err) {
            document.getElementById("signupResult").innerHTML = err.message;
        }
    }

    // Attach the event listener here, after the form and input elements have been fetched
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission
        signup(); // Call the signup function when the form is submitted
    });
});
