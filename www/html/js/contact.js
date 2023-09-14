const urlBase = 'http://165.227.208.98/LAMPAPI';

const submitBtn = document.getElementById("add-contact-btn");

function openForm() {
  document.getElementById("contactForm").style.display = "block";
}

function closeForm() {
  document.getElementById("contactForm").style.display = "none";
}

function addContact() {

  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var email = document.getElementById("email").value;
  var phoneNumber = document.getElementById("phoneNumber").value;
  var userId = sessionStorage.getItem('userId');

  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phoneNumber").value = "";

  let tmp = {FirstName:firstName,LastName:lastName,Email:email,Phone:phoneNumber,UserID:userId};
  let jsonPayload = JSON.stringify( tmp );
  console.log(jsonPayload);
  
  let url = urlBase + '/CreateContact.php';
  
  let xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  try
    {
      xhr.onreadystatechange = function() 
      {
        if (this.readyState == 4 && this.status == 200) 
        {
          console.log(this.responseText)
          let jsonObject = JSON.parse(this.responseText); // not getting past this
          console.log("f;askldfjald;sjffdasdasf");
          returnID = jsonObject.returnID;
      
          if( returnID == 0 )
          {		
            document.getElementById("contactForm").innerHTML = "";
            return;
          }
      
          firstName = jsonObject.FirstName;
          lastName = jsonObject.LastName;
    
          window.location.href = "contact.html";
        }
      };

      xhr.send(jsonPayload);
    }
    catch(err)
    {
      //use alert instead
      //document.getElementById("contactForm").innerHTML = err.message;
      window.alert("An error occurred: " + err.message);
    }
    window.alert("Contact created successfully!");
}
