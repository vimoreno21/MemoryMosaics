const urlBase2 = 'http://165.227.208.98/LAMPAPI';
const inputEl = document.querySelector("#automcomplete-input");
inputEl.addEventListener("input", onInputChange);

// event for the search button 
const searchButton = document.getElementById("search-form");
searchButton.addEventListener("submit", function (e) {
    e.preventDefault();
    onSearchBtnClick(e); 
});

// Call the function to set up the click behavior
// userId from login.js
let userId = sessionStorage.getItem('userId'); //getCookie('userId');
sessionStorage.setItem('img', '/images/contact.png');
console.log("the ID of the current user is ["+ userId + "]");
let users = [];
getContactData(userId);

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
}*/

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
              
              let jsonResponse = this.responseText;
              console.log(jsonResponse);
              let responseObject = JSON.parse(jsonResponse);
              console.log(responseObject);
              let numPeople = responseObject.FirstName.length;
             
              // adding people to users array
              for (let i = 0; i < numPeople; i++) {
                  let person = {
                    FirstName: responseObject.FirstName[i],
                    LastName: responseObject.LastName[i],
                    Phone: responseObject.Phone[i],
                    Email: responseObject.Email[i]
                  };
                  users.push(person);
              }
          }
          generateContactList(users);
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
    users.forEach((user) => {
        fullName = `${user.FirstName} ${user.LastName}`;
        if (fullName.toLowerCase().includes(value))
            filteredNames.push(user);
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
        fullName = `${contact.FirstName} ${contact.LastName}`;
        contactButton.innerHTML = fullName;
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
    users.forEach((contact) => {
        contactName = `${contact.FirstName} ${contact.LastName}`;
        if (contactName.toLowerCase().includes(inputEl.value.toLowerCase()) || contactName.substr(0,inputEl.value.length+1).toLowerCase() == inputEl.value.toLowerCase())
        {
            filteredNames.push(contact);
        }  
    });
    console.log(filteredNames);
    generateContactList(filteredNames);
}

function onSearchBtnClick() {
    removeAllContactList();
    const inputEl = document.querySelector("#automcomplete-input");
    const inputValue = inputEl.value.trim().toLowerCase();

    if (inputValue === "") {
        // Input is empty, you can handle this case if needed
        console.log("Input is empty.");
        generateContactList(users);
        return;
    }

    const filteredNames = users.filter((contact) => {
        const fullName = `${contact.FirstName} ${contact.LastName}`;
        return fullName.toLowerCase().includes(inputValue);
    });

    console.log(filteredNames);
    generateContactList(filteredNames);
}

function generateContactList(contacts) {
    removeAllContactList();
    const itemContainer = document.querySelector(".wrapper");
    console.log("generating contact list function");

    for (const contact of contacts) {
        const fullName = `${contact.FirstName} ${contact.LastName}`;
        console.log(fullName);
    }
    // the index in the array -> will be used for that contact ID
    let id = 0;
    // Create contact list items
    contacts.forEach((contact) => {
        const fullName = `${contact.FirstName} ${contact.LastName}`;
        console.log("here: " + fullName);
        const itemDiv = document.createElement("button");
        itemDiv.className = "item";
        itemDiv.id = `polaroid-${id}`; // Set the id attribute based on user.id
        itemDiv.onclick = function () {
            createWhiteBox(itemDiv.id);
        };
    
        const polaroidDiv = document.createElement("div");
        polaroidDiv.className = "polaroid";
        polaroidDiv.id = `polaroid-${id}`; // Set the id attribute based on user.id

        // Create the "info" element and set its style to initially hidden
        const infoDiv = document.createElement("div");
        infoDiv.className = "info";
        infoDiv.style.display = "none";

        // Create a paragraph element to display the user's name
        const nameParagraph = document.createElement("p");
        nameParagraph.textContent = `Name: ${contact.name}`; // Replace with the appropriate user data field

        // Create a paragraph element to display the user's email
        const emailParagraph = document.createElement("p");
        emailParagraph.textContent = `Email: ${contact.email}`; // Replace with the appropriate user data field

        // Create a paragraph element to display the user's phone number
        const phoneParagraph = document.createElement("p");
        phoneParagraph.textContent = `Phone: ${contact.phone}`; // Replace with the appropriate user data field

        // Add the name, email, and phone paragraphs to the "info" element
        infoDiv.appendChild(nameParagraph);
        infoDiv.appendChild(emailParagraph);
        infoDiv.appendChild(phoneParagraph);

        const image = document.createElement("img");
        image.src = sessionStorage.getItem('img');
    
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
        id++;
    });
}

function removeAllContactList() {
    const itemContainer = document.querySelector(".wrapper");
    const children = itemContainer.children;
    
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.id != "create") { 
            itemContainer.removeChild(child);
        }
    }
}
