const urlBase = 'http://165.227.208.98/LAMPAPI';

const submitBtn = document.getElementById("add-contact-btn");

function openForm() {
  document.getElementById("contactForm").style.display = "block";
}

function closeForm() {
  document.getElementById("contactForm").style.display = "none";
}

function addContact() {
  const submitBtn = document.getElementById("add-contact-btn");
  firstName = "";
  lastName = "";
  phoneNumber = "";
  email = "";

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;

  document.getElementById("contactForm").innerHTML = "";

  let tmp = {FirstName:firstName,LastName:lastName,Email:email,Phone:phoneNumber};
  let jsonPayload = JSON.stringify( tmp );
  console.log(jsonPayload);
  let url = urlBase + '/CreateContact.php';
  
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
      
          if( returnID < 1 )
          {		
            document.getElementById("contactForm").innerHTML = "";
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