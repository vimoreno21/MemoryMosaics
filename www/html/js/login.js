const urlBase = 'http://165.227.208.98/LAMPAPI';
let userId = 0;
let firstName = "";
let lastName = "";


const submitBtn = document.getElementById("submit-login-btn");

function login() {
  userId = 0;
  firstName = "";
  lastName = "";

  const username = document.getElementById("Login").value;
  const password = document.getElementById("Password").value;

  document.getElementById("loginResult").innerHTML = "";

  let tmp = {Login:username,Password:password};
  let jsonPayload = JSON.stringify( tmp );
  console.log(jsonPayload);
  let url = urlBase + '/Login.php';
  
  let xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try
    {
      xhr.onreadystatechange = function() 
      {

        if (this.readyState == 4 && this.status == 200) 
        {
          let jsonObject = JSON.parse(this.responseText);
          userId = jsonObject.ID;
      
          if( userId < 1 )
          {		
            document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
            return;
          }
      
          firstName = jsonObject.FirstName;
          lastName = jsonObject.LastName;
  
          //saveCookie();
    
          window.location.href = "contact.html";
        }
      };

      xhr.send(jsonPayload);
    }
  catch(err)
    {
      document.getElementById("loginResult").innerHTML = err.message;
    }

}
