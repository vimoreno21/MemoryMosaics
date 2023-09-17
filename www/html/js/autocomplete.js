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
let userId = sessionStorage.getItem('userId'); //getCookie('userId');
sessionStorage.setItem('img', '/images/contact.png');
sessionStorage.setItem('contactId', 0);
let currContactId = sessionStorage.getItem('contactId');
console.log("the ID of the current user is ["+ userId + "]");
let users = [];
getContactData(userId);



// summary:
/*
1. getContactData(userId) gets all the contacts from Search.php

2. onInputChange(), createAutocompleteDropdown(list), 
    removeAutocompleteDropdown(), onContactButtonClick(e), 
    onSearchBtnClick() => are all for the search bar

3. generateContactList(contacts) makes all the polaroids 
    a) removeAllContactList() - removes

4.  createWhiteBox(id) -> creates the white box with the info 
    a) openEditForm(user, id) -> opens the ability to change the contact info 
        i. updateContact(id, first, last, phone, email, callback) -> actually updates in the database 
        ii. removeEditForm() -> removes the from
    b) deleteContact(user, contactId) -> deletes the contact from database
        i. removePolaroid(contactId) -> removes the polaroid visually 

*/



// for grabbing the contacts from the Search endpoint
async function getContactData(userId){
  if (userId == null)
  {
    console.log("user ID is null, no cookie found");
    return;
  }
  // to clear the users array
  users.length = 0;
  console.log("after making users.length = 0 " + users);

  let tmp = { UserID: userId, search: ""};
  //console.log(tmp);
  let jsonPayload = JSON.stringify(tmp);
  //console.log(jsonPayload);
  
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
            //   console.log(jsonResponse);
              let responseObject = JSON.parse(jsonResponse);
              console.log(responseObject);
              let numPeople = responseObject.FirstName.length;
             
              // adding people to users array
              for (let i = 0; i < numPeople; i++) {
                  let person = {
                    FirstName: responseObject.FirstName[i],
                    LastName: responseObject.LastName[i],
                    Phone: responseObject.Phone[i],
                    Email: responseObject.Email[i],
                    ID: responseObject.ID[i]
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

// for the search bar, find the contacts 
function onInputChange() {
    // remove whats already there
    removeAutocompleteDropdown();

    const value = inputEl.value.toLowerCase();
    if (value.length == 0){
        generateContactList(users);
        return;
    }

    const filteredNames = [];
    users.forEach((user) => {
        fullName = `${user.FirstName} ${user.LastName}`;
        if (fullName.toLowerCase().includes(value))
            filteredNames.push(user);
    });
    createAutocompleteDropdown(filteredNames);
}

// visually show the names
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

// for the search, clicking a contact
function onContactButtonClick(e) {
    e.preventDefault();
    console.log("click");
    const buttonEl = e.target;
    inputEl.value = buttonEl.innerHTML;
    // remove all polaroids and dropdown info
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

// for when the search button is clicked
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

// func for showing and creating all the polaroids 
function generateContactList(contacts) {
    removeAllContactList();
    const itemContainer = document.querySelector(".wrapper");
    console.log("generating contact list function");

    // the index in the array -> will be used for that contact ID
    let id = 0;
    // Create contact list items
    contacts.forEach((contact) => {
        const fullName = `${contact.FirstName} ${contact.LastName}`;

        // making the button a polaroid
        const itemDiv = document.createElement("button");
        itemDiv.className = "item";
        itemDiv.id = `polaroid-${id}`; // Set the id attribute based on user.id
        itemDiv.setAttribute("data-id", id);
        itemDiv.onclick = function () {
            const clickedPolaroidId = this.getAttribute("data-id");
            console.log("Clicked polaroid ID:", clickedPolaroidId);
            createWhiteBox(clickedPolaroidId);
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
        itemContainer.appendChild(itemDiv);
        id++;
    });
}

// removing all polaroids
function removeAllContactList() {
    const itemContainer = document.querySelector(".wrapper");
    const children = itemContainer.children;

    for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (child.id !== "create") { 
            itemContainer.removeChild(child);
        }
    }
}

// the white pop up box when clicking a contact polaroid
function createWhiteBox(id) {
    const user = users[id];
    console.log(user);
    if (!user) {
        console.error("User not found.");
        return;
    }

    // Create a wrapper for the white box content
    const wrapper = document.createElement('div');
    wrapper.className = 'white-box-wrapper';

    // showing the white box
    const whiteBox = document.createElement('div');
    console.log("creating the white box");
    whiteBox.className = 'white-box'; 
    whiteBox.style.display = 'block'; 
    whiteBox.id = id;

    // exit image in the top right corner
    const closeButton = document.createElement('img');
    closeButton.src = '/images/exit.png'; 
    closeButton.className = 'exit-button';
    closeButton.addEventListener('click', () => {
        whiteBox.style.display = 'none';
        console.log("getting rid of white box");
    });

    // the"Edit" button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    editButton.id = `edit-button-${id}`; // Assign a unique id

    // Add a click event listener to the "Edit" button
    editButton.addEventListener('click', () => {
        console.log("edit clicked");
        openEditForm(user, id); // Pass the user object to the edit form function
    });

    // "Delete" button
    const deleteButton = document.createElement('img');
    deleteButton.src = '/images/delete.png';
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';

    // Add a click event listener to the "Delete" button
    deleteButton.addEventListener('click', () => {
        console.log("calling delete contact");
        deleteContact(user, id);
        getContactData(userId);
    });


    // Create user information elements
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';

    const nameParagraph = document.createElement('h3');
    nameParagraph.textContent = `Name: ${user.FirstName} ${user.LastName}`;

    const emailParagraph = document.createElement('h3');
    emailParagraph.textContent = `Email: ${user.Email}`;

    const phoneParagraph = document.createElement('h3');
    phoneParagraph.textContent = `Phone: ${user.Phone}`;

    // Create an image element
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';

    const userImage = document.createElement('img');
    userImage.src = sessionStorage.getItem('img'); // Set the image source based on your requirements

    // Append user information and image to the white box
    userInfo.appendChild(nameParagraph);
    userInfo.appendChild(emailParagraph);
    userInfo.appendChild(phoneParagraph);

    whiteBox.appendChild(userImage);
    whiteBox.appendChild(userInfo);
    
    whiteBox.appendChild(editButton);
    whiteBox.appendChild(deleteButton);
    whiteBox.appendChild(closeButton);
    wrapper.appendChild(whiteBox);
    

    document.body.appendChild(wrapper);
    
}

// for the edit form
function openEditForm(user, id) {

    // Hide the "Edit" button
    console.log("open edit form called");
    
    // const editButton = document.querySelector('.edit-button');
    const editButton = document.querySelector(`#edit-button-${id}`);
    editButton.style.display = 'none';

    // Create the form element
    const editForm = document.createElement('form');
    editForm.className = 'edit-form'; // Add a class for styling (optional)

    console.log(user);

    // Create input fields for editing information
    const firstNameInput = document.createElement('input');
    firstNameInput.id = 'firstName';
    firstNameInput.type = 'text';
    firstNameInput.value = user.FirstName; // Populate with the existing data

    // Add labels for input fields
    const firstNameLabel = document.createElement('label');
    firstNameLabel.textContent = 'First Name:';
    firstNameLabel.setAttribute('for', 'firstName');

    const lastNameInput = document.createElement('input');
    lastNameInput.id = 'lastName';
    lastNameInput.type = 'text';
    lastNameInput.value = user.LastName;

    const lastNameLabel = document.createElement('label');
    lastNameLabel.textContent = 'Last Name:';
    lastNameLabel.setAttribute('for', 'lastName');

    const phoneInput = document.createElement('input');
    phoneInput.id = 'phone';
    phoneInput.type = 'tel';
    phoneInput.value = user.Phone;

    const phoneLabel = document.createElement('label');
    phoneLabel.textContent = 'Phone:';
    phoneLabel.setAttribute('for', 'phone');

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.value = user.Email;
    emailInput.id = 'email';

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email:';
    emailLabel.setAttribute('for', 'email');

    // Create a "Save Changes" button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Changes';
    saveButton.className = 'save-button';
    saveButton.id = `edit-button-${id}`; // Assign a unique id
    

    // Add a submit event listener to the form
    saveButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        
        // Handle saving changes here and update the user object
        user.FirstName = firstNameInput.value;
        user.LastName = lastNameInput.value;
        user.Email = emailInput.value;
        user.Phone = phoneInput.value;

        // Update the contact information directly in the white box
        const nameHeader = document.querySelector('.user-info h3:nth-child(1)');
        const emailHeader = document.querySelector('.user-info h3:nth-child(2)');
        const phoneHeader = document.querySelector('.user-info h3:nth-child(3)');

        nameHeader.textContent = `Name: ${user.FirstName} ${user.LastName}`;
        emailHeader.textContent = `Email: ${user.Email}`;
        phoneHeader.textContent = `Phone: ${user.Phone}`;

        // Call the function to update the contact on the server
        // Use a callback to ensure everything runs in order
        // updateContact(user.ID, user.FirstName, user.LastName, user.Phone, user.Email, function(){
        //     console.log(users);
        //     getContactData(userId);

        //     // Remove the edit form after saving
        //     editForm.remove();

        //     // Show the "Edit" button again
        //     editButton.style.display = 'block';
        // });

        updateContact(user.ID, user.FirstName, user.LastName, user.Phone, user.Email, function (){
            console.log(users);
            getContactData(userId);

            // removeEditForm();
            editForm.style.display = 'none';
            // Show the "Edit" button again
            editButton.style.display = 'block';
            editButton.addEventListener('click', () => {
                editForm.style.display = 'block';
                openEditForm(user, id);
            });
            //editForm.remove();
        });
    });

    // Append input fields, labels, and save button to the form
    editForm.appendChild(firstNameLabel);
    editForm.appendChild(firstNameInput);

    editForm.appendChild(lastNameLabel);
    editForm.appendChild(lastNameInput);

    editForm.appendChild(phoneLabel);
    editForm.appendChild(phoneInput);

    editForm.appendChild(emailLabel);
    editForm.appendChild(emailInput);

    editForm.appendChild(saveButton);

    // Append the form to the white box
    const whiteBox = document.querySelector('.white-box');
    whiteBox.appendChild(editForm);

    console.log ("end of edit form");
}

// Function to remove the edit form in the white box and input fields
function removeEditForm() 
{
    const inputFields = document.querySelectorAll('.white-box input');
    inputFields.forEach((input) => {
        input.remove();
    });

    const saveButton = document.querySelector('.save-button');
    if (saveButton) {
        console.log("removing save button");
        saveButton.remove();
    }
    
    const editForm = document.querySelector('.edit-form');
    if (editForm) {
        editForm.remove();
    }
}
// function to update the contact in the database with Update.php
async function updateContact(id, first, last, phone, email, callback) {
    let tmp = {
        ID: id,
        NewFirstName: first,
        NewLastName: last,
        NewPhone: phone,
        NewEmail: email,
    };

    let jsonPayload = JSON.stringify(tmp);
    console.log("Updating contact: " + jsonPayload);

    let url = urlBase2 + '/Update.php';

    let xhr = new XMLHttpRequest();
    
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let jsonResponse = xhr.responseText;
                console.log("Response: " + jsonResponse);
                let responseObject = JSON.parse(jsonResponse);
                console.log("Parsed Response: ", responseObject);
            
                // Call the callback function to indicate that the update is complete
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                console.error("Request failed with status: " + xhr.status);
                // Handle the error here
            }
        }
    };

    xhr.send(jsonPayload);
}

// deleting a contact
async function deleteContact(user, contactId) {
    console.log("deleting " + user.ID + " for user " + user);
    const xhr = new XMLHttpRequest();

    url = urlBase2 + '/Delete.php';
  
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  
    // Create an object with the data you want to send to the server
    const data = {
      ID: user.ID,
    };
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
           let jsonResponse = this.responseText;
           console.log(jsonResponse);
           let responseObject = JSON.parse(jsonResponse);
           console.log(responseObject);
           removePolaroid(contactId);
        } else {
          // Handle any errors from the server
          console.error('Error deleting contact:', xhr.responseText);
        }
      }
    };
  
    xhr.send(JSON.stringify(data));
}

// removing the polaroid for the delete 
function removePolaroid(contactId) {
    const polaroidElement = document.querySelector(`#polaroid-${contactId}`);
    if (polaroidElement) {
      polaroidElement.remove();
    }
    const whiteBox = document.querySelector('.white-box'); 
    whiteBox.style.display = 'none';
    getContactData(userId);
}
  
// duplicate
// Function to update the contact on the server (implement this)
function updateContact2(id, first, last, phone, email) {
    
    let tmp = {
        ID: id,
        FirstName: first,
        LastName: last,
        Phone: phone,
        Email: email,
    };
    
    let jsonPayload = JSON.stringify(tmp);
    console.log("updating contact " + jsonPayload);
    console.log(jsonPayload);

    let url = urlBase2 + '/Update2.php';

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
            }
        };

        xhr.send(jsonPayload);
    }
    catch(err)
    {
            console.log("error getting info");
    }
}

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

    // // Hide the "Edit" button
    // const editButton = document.querySelector('.edit-button');
    // editButton.style.display = 'none';

    // //const editForm = document.createElement('form');

    // // Create input fields for editing information
    // const firstNameInput = document.createElement('input');
    // firstNameInput.id = 'firstName';
    // firstNameInput.type = 'text';
    // firstNameInput.value = user.FirstName; // Populate with the existing data
    
    // // last name
    // const lastNameInput = document.createElement('input');
    // lastNameInput.id = 'lastName';
    // lastNameInput.type = 'text';
    // lastNameInput.value = user.LastName;
    
    // // phone
    // const phoneInput = document.createElement('input');
    // phoneInput.id = 'phone';
    // phoneInput.type = 'tel';
    // phoneInput.value = user.Phone;
    
    // // email
    // const emailInput = document.createElement('input');
    // emailInput.type = 'email';
    // emailInput.value = user.Email;
    // emailInput.id = 'email';

    // // Create a "Save Changes" button
    // const saveButton = document.createElement('button');
    // saveButton.textContent = 'Save Changes';
    // saveButton.className = 'save-button';
    // saveButton.addEventListener('click', () => {
    //     // // Handle saving changes here and update the user object
    //     user.FirstName = firstNameInput.value;
    //     user.LastName = lastNameInput.value;
    //     user.Email = emailInput.value;
    //     user.Phone = phoneInput.value;

    //     // // Update the contact information directly in the white box
    //     const nameParagraph = document.querySelector('.user-info p:nth-child(1)');
    //     const emailParagraph = document.querySelector('.user-info p:nth-child(2)');
    //     const phoneParagraph = document.querySelector('.user-info p:nth-child(3)');

    //     nameParagraph.textContent = `Name: ${user.FirstName} ${user.LastName}`;
    //     emailParagraph.textContent = `Email: ${user.Email}`;
    //     phoneParagraph.textContent = `Phone: ${user.Phone}`;

    //     // Call the function to update the contact on the server
    //     // use this calback to make sure everyting gets run in order
        // updateContact(user.ID, user.FirstName, user.LastName, user.Phone, user.Email, function (){
        //     console.log(users);
        //     getContactData(userId);

        //     removeEditForm();
        //     // Show the "Edit" button again
        //     editButton.style.display = 'block';
        //     editButton.addEventListener('click', () => {
        //         openEditForm(user, id);
        //     });
        //     //editForm.remove();
        // });
        
    // });

    // // // Append input fields and save button to the white box
    // const whiteBox = document.querySelector('.white-box'); // Restored this line
    // whiteBox.appendChild(firstNameInput);
    // whiteBox.appendChild(lastNameInput);
    // whiteBox.appendChild(emailInput);
    // whiteBox.appendChild(phoneInput);
    // whiteBox.appendChild(saveButton);


    // // editForm.appendChild(firstNameInput);
    // // editForm.appendChild(lastNameInput);
    // // editForm.appendChild(emailInput);
    // // editForm.appendChild(phoneInput);
    // // editForm.appendChild(saveButton);

    // // Append the form to the white box
    // //const whiteBox = document.querySelector('.white-box');
    // //whiteBox.appendChild(editForm);