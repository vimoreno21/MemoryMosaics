const urlBase2 = 'http://165.227.208.98/LAMPAPI';
const inputEl = document.querySelector("#automcomplete-input");
inputEl.addEventListener("input", onInputChange);

// Call the function to set up the click behavior
// userId from login.js
let userId = getCookie('userId');
console.log("the ID of the current user is ["+ userId + "]");
getContactData(userId);

let contactNames = [];

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

function createWhiteBox(id) {
    const whiteBox = document.createElement('div');
    console.log("creating the white box");
    whiteBox.className = 'white-box'; // You can apply CSS styling using this class
    whiteBox.style.display = 'block'; // Set display property to 'block'
    // Customize the content of the white box here
    whiteBox.innerHTML = 'This is a white box.';

    document.body.appendChild(whiteBox);

    // Add a click event listener to hide the white box when clicked
    whiteBox.addEventListener('click', () => {
        whiteBox.style.display = 'none';
        console.log("getting rid of white box");
    });
}

async function getContactData(userId){
  if (userId == null)
  {
    console.log("user ID is null, no cookie found");
    return;
  }
  var users = [];
  let tmp = { UserID: userId, search: ""};
  console.log(userId);
  console.log(tmp);
  let jsonPayload = JSON.stringify(tmp);
  console.log(jsonPayload);
  
  let url = urlBase2 + '/Search.php';

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
          
              firstName = jsonObject.FirstName;
              lastName = jsonObject.LastName;
              
          }
      };

      xhr.send(jsonPayload);
      }
  catch(err)
      {
          console.log("error getting info");
      }
}

function onInputChange() {
    removeAutocompleteDropdown();

    const value = inputEl.value.toLowerCase();

    if (value.length == 0) return;

    const filteredNames = [];

    contactNames.forEach((contactName) => {
        if (contactName.toLowerCase().includes(value))
            filteredNames.push(contactName);
    });

    createAutocompleteDropdown(filteredNames);
}

function createAutocompleteDropdown(list){
    const listEl = document.createElement("ul");
    listEl.className = "autocomplete-list";
    listEl.id = "autocomplete-list";

    list.forEach((contact) => {
        const listItem = document.createElement("li");
        const contactButton = document.createElement("button");
        contactButton.innerHTML = contact;
        contactButton.addEventListener("click", onContactButtonClick);
        listItem.appendChild(contactButton);

        listEl.appendChild(listItem);
    });
    document.querySelector("#autocomplete-wrapper").appendChild(listEl);

}

function removeAutocompleteDropdown() {
    const listEl = document.querySelector("#autocomplete-list");
    if (listEl)
        listEl.remove()
}

// for the search click
function onContactButtonClick(e) {
    e.preventDefault();
    console.log("click");
    const buttonEl = e.target;
    inputEl.value = buttonEl.innerHTML;
    removeAutocompleteDropdown();
    removeAllContactList();
    const filteredNames = [];
    
    // try to move it to filtered names
    contactNames.forEach((contactName) => {
        if (contactName.toLowerCase().includes(inputEl.value.toLowerCase) || contactName.substr(0,inputEl.value.length+1).toLowerCase() == inputEl.value.toLowerCase())
        {
            console.log("found: " + contactName);
            filteredNames.push(contactName);
        }  
    });
    console.log(filteredNames);
    generateContactList(filteredNames);
}


function generateContactList(users) {

    const itemContainer = document.querySelector(".wrapper");
    console.log("generating contact list function");

    // if its not one name
    if (Array.isArray(users))
    {
        console.log("[!] contact data is an array");
        for (const user of users) {
            const fullName = `${user.first_name} ${user.last_name}`;
            console.log(fullName);
        }
    
        // Create contact list items
        users.forEach((user) => {
            const fullName = `${user.first_name} ${user.last_name}`;
            console.log("here: " + fullName);
            const itemDiv = document.createElement("button");
            itemDiv.className = "item";
            itemDiv.id = `polaroid-${user.id}`; // Set the id attribute based on user.id
        
            const polaroidDiv = document.createElement("div");
            polaroidDiv.className = "polaroid";
            polaroidDiv.id = `polaroid-${user.id}`; // Set the id attribute based on user.id

            // Create the "info" element and set its style to initially hidden
            const infoDiv = document.createElement("div");
            infoDiv.className = "info";
            infoDiv.style.display = "none";

            // Create a paragraph element to display the user's name
            const nameParagraph = document.createElement("p");
            nameParagraph.textContent = `Name: ${user.name}`; // Replace with the appropriate user data field

            // Create a paragraph element to display the user's email
            const emailParagraph = document.createElement("p");
            emailParagraph.textContent = `Email: ${user.email}`; // Replace with the appropriate user data field

            // Create a paragraph element to display the user's phone number
            const phoneParagraph = document.createElement("p");
            phoneParagraph.textContent = `Phone: ${user.phone}`; // Replace with the appropriate user data field

            // Add the name, email, and phone paragraphs to the "info" element
            infoDiv.appendChild(nameParagraph);
            infoDiv.appendChild(emailParagraph);
            infoDiv.appendChild(phoneParagraph);

            const image = document.createElement("img");
            image.src = user.avatar;
        
            const captionDiv = document.createElement("div");
            captionDiv.className = "caption";
            captionDiv.textContent = fullName;
        
            polaroidDiv.appendChild(image);
            polaroidDiv.appendChild(captionDiv);
            itemDiv.appendChild(polaroidDiv);
        
            // Add a click event listener to the polaroid
            polaroidDiv.addEventListener("click", function () {
                // Call the searchContacts function when the polaroid is clicked
                searchContactById(polaroidDiv.id); // Pass the user's name as the search query
            });

            itemContainer.appendChild(itemDiv);
        });

    } 
    else {
        console.log("[!] contact data is not an array");
        const fullName = `${users.first_name} ${users.last_name}`;
        console.log("in generate: " + fullName);
        const itemDiv = document.createElement("button");
        itemDiv.className = "item";
        itemDiv.id = `polaroid-${users.id}`; // Set the id attribute based on users.id
  
        const polaroidDiv = document.createElement("div");
        polaroidDiv.className = "polaroid";
        

        // Create the "info" element and set its style to initially hidden
        const infoDiv = document.createElement("div");
        infoDiv.className = "info";
        infoDiv.style.display = "none";
        
        // Create a paragraph element to display the user's name
        const nameParagraph = document.createElement("p");
        nameParagraph.textContent = `Name: ${users.name}`; // Replace with the appropriate user data field

        // Create a paragraph element to display the user's email
        const emailParagraph = document.createElement("p");
        emailParagraph.textContent = `Email: ${users.email}`; // Replace with the appropriate user data field

        // Create a paragraph element to display the user's phone number
        const phoneParagraph = document.createElement("p");
        phoneParagraph.textContent = `Phone: ${users.phone}`; // Replace with the appropriate user data field

        // Add the name, email, and phone paragraphs to the "info" element
        infoDiv.appendChild(nameParagraph);
        infoDiv.appendChild(emailParagraph);
        infoDiv.appendChild(phoneParagraph);

        const image = document.createElement("img");
        image.src = users.avatar;
  
        const captionDiv = document.createElement("div");
        captionDiv.className = "caption";
        captionDiv.textContent = fullName;
  
        polaroidDiv.appendChild(image);
        polaroidDiv.appendChild(captionDiv);
        itemDiv.appendChild(polaroidDiv);

        polaroidDiv.addEventListener("click", function () {
        // Call the searchContacts function when the polaroid is clicked
        searchContactById(polaroidDiv.id); // Pass the user's name as the search query
        });

        itemContainer.appendChild(itemDiv);
    }

}

function removeAllContactList() {
    const itemContainer = document.querySelector(".wrapper");
  
    // Remove all contact items within the .wrapper container
    while (itemContainer.firstChild) {
      itemContainer.removeChild(itemContainer.firstChild);
    }
}
