const urlBase = 'http://165.227.208.98/LAMPAPI';

const submitBtn = document.getElementById("add-contact-btn");

// document.getElementById("add-contact-btn").addEventListener("click", function() {
//     // Redirect to contact.html
//     window.location.href = "contact.html";
// });

function openAvatarModal() {
  document.getElementById("avatarModal").style.display = "block";
  document.getElementById("defaultAvatar").removeAttribute("hidden");
}

// Function to close the avatar selection modal
function closeAvatarModal() {
  var modal = document.getElementById("avatarModal");
  modal.style.display = "none";
}

// Function to select an avatar and display it in the preview
function selectAvatar(avatarSrc) {
  document.getElementById("avatar-preview").src = avatarSrc;
  document.getElementById("avatar-preview").style.display = "block";
  closeAvatarModal();
}

// Add this function to reset the avatar preview if needed
function resetAvatarPreview() {
  document.getElementById("avatar-preview").src = "";
  document.getElementById("avatar-preview").style.display = "none";
}

function openForm() {
  document.getElementById("contactForm").style.display = "block";
}

function closeForm() {
  document.getElementById("contactForm").style.display = "none";
}

function validAddContact(firstName, lastName, email, phone)
{
	let contactError = false;

	if (firstName == "" || lastName == "" || email == "" || phone == "")
	{
		contactError = true;
	}

	return contactError;
}

function addContact() {
  var firstName = document.getElementById("firstName_add").value;
  var lastName = document.getElementById("lastName_add").value;
  var email = document.getElementById("email_add").value;
  var phoneNumber = document.getElementById("phoneNumber_add").value;
  var userId = sessionStorage.getItem('userId');
  var avatarSrc = document.getElementById("avatar-preview").src;
  
  console.log(firstName);
  
  if (validAddContact(firstName, lastName, email, phoneNumber))
	{
		console.log("CONTACT INFO NOT VALID!");
		return;
	}

  document.getElementById("firstName_add").value = "";
  document.getElementById("lastName_add").value = "";
  document.getElementById("email_add").value = "";
  document.getElementById("phoneNumber_add").value = "";

  let tmp = {FirstName:firstName,LastName:lastName,Email:email,Phone:phoneNumber,UserID:userId, Avatar: avatarSrc};
  console.log(tmp);
  let jsonPayload = JSON.stringify( tmp );
  console.log(tmp);
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
    //window.location.reload();
}