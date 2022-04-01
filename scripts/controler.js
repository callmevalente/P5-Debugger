////////////////////////////////////////////////////////////////////////////////
///   P a g e  E v e n t   H a n d l e r s
////////////////////////////////////////////////////////////////////////////////

/************************************************/
function onPageLoad() {
    // Wire up all button handlers
    document.getElementById('newBtn').onclick = function () { onNewClick() };
    document.getElementById('cancelBtn').onclick = function () { onFormCancel() };

    modelCreateContact("John Smith", "(385) 390-2930", 0, 25, 1);
    modelCreateContact("Sarah Jensen", "(801) 439-9214", 1, 21, 2);
    modelCreateContact("Ricardo Torres", "(801) 328-0877", 0, 22, 5);
    modelCreateContact("Amy Perkins", "(801) 936-8764", 2, 19, 3);

    var items = modelReadAllContacts();
    for (var i = 0; i < items.length; i++) {
        addTableRow(items[i]);
    }


    clearInputForm();
}

/************************************************/
function onNewClick() {
    // Set the header text.
    document.getElementById('formTitle').innerHTML = "New Contact";

    document.getElementById('contactEditArea').style.display = 'block';
    document.getElementById('contactListArea').style.display = 'none';
    document.getElementById('ringtoneRadio0').checked = true

    document.getElementById('saveBtn').onclick = function () { onFormSave() };
}

/************************************************/
function onFormCancel() {
    clearInputForm();
}

/************************************************/
function onFormSave(id) {
    // Validate the data in all the controls.
    if (!validateForm()) {
        return;
    }


    var form = document.forms['contactEditForm'];
    if (id) {
        var modelCreateContact = modelUpdateContact(
            id,
            form.nameEdit.value,
            form.phoneNumberEdit.value,
            form.phoneNumberTypeSelect.value,
            form.ageEdit.value,
            form.ringtoneRadio.selectedIndex);

        updateTableRow(modelCreateContact);
    }
    else {
        // Get the data from the form controls, and
        // create a new Contact object.
        var newContact = new Contact(
            form.nameEdit.value,
            form.phoneNumberEdit.value,
            form.phoneNumberTypeSelect.value,
            form.ageEdit.value,
            form.ringtoneRadio.selectedIndex);

        // Add the new contact to the view
        contactList.push(newContact)
        addTableRow(newContact);
    }

    // Clear the input form and all errors.
    clearInputForm()
}

/************************************************/
function onItemDelete(id) {
    // Fetch the student record from the model
    var contact = modelReadContact(id);
    if (contact == null) {
        alert("Error: unable to find contact ID " + id)
    }

    if (!confirm("Are you sure you want to delete " + contact.name + "?"))
        return;

    modelDeleteContact(id);

    var tr = document.getElementById('row' + contact.id);
    tr.remove();
}

/************************************************/
function onItemEdit(itemId) {
    // Set the header text.
    document.getElementById('formTitle').innerHTML = "Edit Contact";

    var form = document.forms['contactEditForm'];

    var item = modelReadContact(itemId);
    form.nameEdit.value = item.name;
    form.phoneNumberEdit.value = item.number;
    form.phoneNumberTypeSelect.selectedIndex = item.numberType;
    form.ageEdit.value = item.age;
    form.ringtoneRadio.value = item.ringtone;

    document.getElementById('saveBtn').onclick = function () { onFormSave(itemId) };

    document.getElementById('contactEditArea').style.display = 'block';
    document.getElementById('contactListArea').style.display = 'none';
}


////////////////////////////////////////////////////////////////////////////////
///   B u s i n e s s   L o g i c
////////////////////////////////////////////////////////////////////////////////

/************************************************/
function clearInputForm() {
    // Hide the form, show the contact list.
    document.getElementById('contactEditArea').style.display = 'none';
    document.getElementById('contactListArea').style.display = 'block';

    // Reset all form controls
    var form = document.forms['contactEditForm'];

    form.nameEdit.value = '';
    form.phoneNumberEdit.value = '';
    form.phoneNumberTypeSelect.selectedIndex = 0;
    form.ageEdit.value = '';

    // Reset all validation errors
    document.getElementById('nameError').innerHTML = '';
    document.getElementById('phoneNumberError').innerHTML = '';
    document.getElementById('ageError').innerHTML = '';
}

/************************************************/
function validateForm() {
    var form = document.forms['contactEditForm'];
    var validated = true;

    // Name textbox
    if (form.nameEdit.value == "") {
        document.getElementById("nameError").innerHTML = "Name not given.";
        validated = false;
    }
    else
        document.getElementById("nameError").innerHTML = "";

    // Phone number textbox
    if (form.phoneNumberEdit.value == "") {
        document.getElementById("phoneNumberError").innerHTML = "Phone number not given.";
        validated = false;
    }
    else {
        document.getElementById("phoneNumberError").innerHTML = "";
    }
    // Age
    if (form.ageEdit.value == "") {
        document.getElementById("ageError").innerHTML = "Age not given.";
        validated = false;
    }
    else {
        var age = parseInt(form.ageEdit.value);
        if (isNaN(age)) {
            document.getElementById("ageError").innerHtml = "Age must be a number.";
            var validated = false;
        }
        else if (age < 0 || age > 120) {
            document.getElementById("ageError").innerHTML = "Age must be between 0 and 120.";
            validated = false;
        }
        else
            document.getElementById("ageError").innerHtml = "";
    }

    // Return the final result
    return validated;
}

function updateTableRow(contact) {
    var id = `row${contact.id}`;
    var tr = document.getElementById(id);
    tr.childNodes[0].innerHTML = contact.name;
    tr.childNodes[1].innerHTML = contact.number;
}

function addTableRow(contact) {
    var table = document.getElementById("contactsTable");

    // Compose a new row, and set its id attribute.  This helps us
    // if the user wants to change the student's info later.
    var row = table.insertRow(table.rows.length);
    row.id = "row" + contact.id;

    var cell = row.insertCell(0);
    cell.innerText = contact.name;

    cell = row.insertCell(1);
    cell.innerText = contact.number;

    cell = row.insertCell(2);
    var editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.type = "button";
    editBtn.onclick = function () {
        onItemEdit(contact.id);
    }
    cell.appendChild(editBtn);

    cell = row.insertCell(3);
    var deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.type = "button";
    deleteBtn.onclick = function () {
        onItemDelete(contact.id);
    }
    cell.appendChild(deleteBtn);
}