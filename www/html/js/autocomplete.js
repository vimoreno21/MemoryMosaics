const inputEl = document.querySelector("#automcomplete-input");
inputEl.addEventListener("input", onInputChange);
getContactData();

let contactNames = [];

async function getContactData(){
    const contactRes = await fetch("https://reqres.in/api/users?page=2");
    const data = await contactRes.json();

    const users = data.data;
    generateContactList(data.data);

    for (const user of users) {
        const fullName = `${user.first_name} ${user.last_name}`;
        //console.log(fullName);
        contactNames.push(fullName); // Add the full name to the contactNames array
    }
    
    // if (Array.isArray(data))
    // {
    //     contactNames = data.map((contact) => {
    //         return contact.first_name;
    //     });
    // } else {
    //     console.error("[!] error data is not an array");
    // }
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

    const buttonEl = e.target;
    inputEl.value = buttonEl.innerHTML;
    removeAutocompleteDropdown();
    removeAllContactList();
    const filteredNames = [];

    contactNames.forEach((contactName) => {
        if (contactName.substr(0,inputEl.value.length).toLowerCase() == inputEl.value)
            filteredNames.push(contactName);
    });
    generateContactList(filteredNames);
}

// for the polaroids 

function generateContactList(users) {
    const itemContainer = document.querySelector(".wrapper");
    
    // for (const user of users) {
    //     const fullName = `${user.first_name} ${user.last_name}`;
    //     console.log(fullName);
    //     contactNames.push(fullName); // Add the full name to the contactNames array
    // }

    // Create contact list items
    users.forEach((user) => {
      const fullName = `${user.first_name} ${user.last_name}`;
      const itemDiv = document.createElement("div");
      itemDiv.className = "item";
  
      const polaroidDiv = document.createElement("div");
      polaroidDiv.className = "polaroid";
  
      const image = document.createElement("img");
      image.src = user.avatar;
  
      const captionDiv = document.createElement("div");
      captionDiv.className = "caption";
      captionDiv.textContent = fullName;
  
      polaroidDiv.appendChild(image);
      polaroidDiv.appendChild(captionDiv);
      itemDiv.appendChild(polaroidDiv);
  
      itemContainer.appendChild(itemDiv);
    });
}

function removeAllContactList() {
    const itemContainer = document.querySelector(".wrapper");
  
    // Remove all contact items within the .wrapper container
    while (itemContainer.firstChild) {
      itemContainer.removeChild(itemContainer.firstChild);
    }
}
