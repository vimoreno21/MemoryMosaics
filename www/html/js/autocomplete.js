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
    a) createEditForm(user, id) -> created the form to edit on every polaroid and doesnt display
        i. showEditForm(id) -> puts the forms style to display
        i. updateContact(id, first, last, phone, email, callback) -> actually updates in the database
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
    whiteBox.id = `white-box-${id}`;


    // the"Edit" button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    editButton.id = `edit-button-${id}`; // Assign a unique id

    // Add a click event listener to the "Edit" button
    editButton.addEventListener('click', () => {
        console.log("about to show edit form from white box with id = " + id);
        showEditForm(id);// Pass the user object to the edit form function
        console.log("finishing showing edit form from white box");

    });

    // exit image in the top right corner
    const closeButton = document.createElement('img');
    closeButton.src = '/images/exit.png';
    closeButton.className = 'exit-button';
    closeButton.addEventListener('click', () => {
        whiteBox.style.display = 'none';
        editButton.removeAttribute('id');
        whiteBox.removeAttribute('id');
        userInfo.removeAttribute('id');
        nameParagraph.removeAttribute('id');
        emailParagraph.removeAttribute('id');
        deleteButton.removeAttribute('id');
        phoneParagraph.removeAttribute('id');
        imageWrapper.removeAttribute('id');
        userImage.removeAttribute('id');

        if (document.querySelector(`#save-button-${id}`))
        {
            saveButton = document.querySelector(`#save-button-${id}`);
            saveButton.removeAttribute('id');
        }
        else {
            console.log("not found for save");
        }

        if (document.querySelector(`#email`))
        {
            emailInput = document.querySelector(`#email`);
            emailInput.removeAttribute('id');
        }
        else {
            console.log("not found for email");
        }

        if (document.querySelector(`#phone`))
        {
            phoneInput = document.querySelector(`#phone`);
            phoneInput.removeAttribute('id');
        }
        else {
            console.log("not found for phone");
        }

        if (document.querySelector(`#lastName`))
        {
            lastNameInput = document.querySelector(`#lastName`);
            lastNameInput.removeAttribute('id');
        }
        else {
            console.log("not found for last name");
        }

        if (document.querySelector(`#firstName`))
        {
            firstNameInput = document.querySelector(`#firstName`);
            firstNameInput.removeAttribute('id');
        }
        else {
            console.log("not found for first name");
        }
        if (document.querySelector(`#edit-form-${id}`))
        {
            editForm = document.querySelector(`#edit-form-${id}`);
            editForm.removeAttribute('id');
        }
        else {
            console.log("not found for edit");
        }
        console.log("getting rid of white box");
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
    userInfo.id = `user-info-${id}`;

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


    // if (!(document.querySelector(`#edit-form-${id}`)))
    // {
        console.log("calling create edit form");
        createEditForm(user, id);
        console.log("end of create edit form");
    // }
    // else
    // {
    //     console.log("didnt calit");
    // }

}

// new one w all ids
// Function to create the edit form for a specific user (hidden by default)
function createEditForm(user, id) {

    const editButton = document.querySelector(`#edit-button-${id}`);
    const userInfo = document.querySelector(`#user-info-${id}`);

    // Create the form element with a unique ID
    const editForm = document.createElement('form');
    editForm.className = 'edit-form';
    editForm.id = `edit-form-${id}`;

    // Hide the form initially
    editForm.style.display = 'none';

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
    saveButton.id = `save-button-${id}`; // Assign a unique id

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

        // Call the updateContact function
        updateContact(user.ID, user.FirstName, user.LastName, user.Phone, user.Email, function (){
            // Handle any callback logic here
            console.log(users);
            getContactData(userId);


            editButton.addEventListener('click', () => {
                //editForm.style.display = 'block';
                console.log("about to show edit form from creating form");
                showEditForm(id);
                console.log("finishing showing edit form from creating form");
            });

        });

        // Hide the edit form
        editForm.style.display = 'none';

        // Show the "Edit" and "Info" button again
        editButton.style.display = 'block';
        userInfo.style.display = 'block';
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
    const whiteBox = document.querySelector(`#white-box-${id}`);
    whiteBox.appendChild(editForm);
}

// Function to display the edit form for a specific user
function showEditForm(id) {
    console.log("id is " + id );
    // Hide the "Edit" button
    const editButton = document.querySelector(`#edit-button-${id}`);
    editButton.style.display = 'none';

    const userInfo = document.querySelector(`#user-info-${id}`);
    userInfo.style.display = 'none';

    // Show the edit form specific to this user
    const editForm = document.querySelector(`#edit-form-${id}`);
    editForm.style.display = 'block';



    console.log("finishing showEditform");
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
