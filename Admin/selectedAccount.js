document.addEventListener('DOMContentLoaded', function() {
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    }

    const queryParams = getQueryParams();
    const userId = queryParams.userId;
    console.log(userId);

    if (!userId) {
        console.error('No userId found in query parameters');
        return;
    }

    fetch(`https://skoolworkshopapi.azurewebsites.net/user/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                const user = data.data[0];
                if (!user) {
                    console.error('User data is empty');
                    return;
                }

                const elements = {
                    userName: document.getElementById('userName'),
                    status: document.getElementById('status'),
                    userType: document.getElementById('userType'),
                    email: document.getElementById('email'),
                    phoneNumber: document.getElementById('phoneNumber'),
                    address: document.getElementById('address'),
                    postalcode: document.getElementById('postalcode'),
                    DOB: document.getElementById('DOB'),
                    country: document.getElementById('country'),
                    languagesSpoken: document.getElementById('languagesSpoken'),
                    publicTransit: document.getElementById('publicTransit'),
                    license: document.getElementById('license'),
                    car: document.getElementById('car'),
                    salary: document.getElementById('salary'),
                    bankinfo: document.getElementById('bankinfo'),
                    btwnr: document.getElementById('btwnr'),
                    kvknr: document.getElementById('kvknr'),
                    workshops: document.getElementById('workshops')
                };

                // Ensure elements exist before setting innerText
                for (const key in elements) {
                    if (elements[key]) {
                        elements[key].innerText = user[key.charAt(0).toUpperCase() + key.slice(1)];
                    } else {
                        console.warn(`Element for ${key} not found`);
                    }
                }

                // Make user globally accessible
                window.user = user;
                window.username = user.Username;

            } else {
                console.log('Failed to get user data');
            }
        })
        .catch(error => console.error('Error while fetching user data:', error));

    // Fetch workshops
    fetch(`https://skoolworkshopapi.azurewebsites.net/user/workshop/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                const workshop = data.data[0];
                if (elements.workshops) {
                    elements.workshops.innerText = workshop.WorkshopName;
                } else {
                    console.warn('Element for workshops not found');
                }
            } else {
                console.error('Failed to retrieve workshop(s)');
            }
        })
        .catch(error => console.error('Error while fetching workshop data:', error));
});

function confirmationBlock() {
    let result = confirm("Weet je het zeker?");
    if (result === true) {
        block(window.username);
        console.log('Blocked');
    } else {
        console.log('Canceled');
    }
}

function confirmationUnblock() {
    let result = confirm("Weet je het zeker?");
    if (result === true) {
        unblock(window.username);
        console.log('Unblocked');
    } else {
        console.log('Canceled');
    }
}

function block(username) {
    updateUserStatus(username, 'Geblokkeerd');
}

function unblock(username) {
    updateUserStatus(username, 'Toegewezen');
}

function updateUserStatus(username, status) {
    fetch('https://skoolworkshopapi.azurewebsites.net/user/updateStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username: username, status: status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            alert('User status updated successfully');
            document.getElementById('status').innerText = status;
        } else {
            alert('Failed to update user status');
        }
    })
    .catch(error => {
        console.error("There was an error updating the user status", error);
        alert('Error updating user status');
    });
}

// Changing roles
function confirmZZP() {
    let result = confirm("Weet je het zeker?");
    if (result === true) {
        changeToZZP(window.username);
        console.log("ZZP");
    } else {
        console.log("Canceled");
    }
}

function confirmFlex() {
    let result = confirm("Weet je het zeker?");
    if (result === true) {
        const salary = document.getElementById("newSalary").value;
        if (salary) {
            changeToFlex(window.username, salary);
            console.log("Flex");
        } else {
            alert("Voer een geldig salaris in");
        }
    } else {
        console.log("Canceled");
    }
}

function changeToZZP(username) {
    updateRole(username, "ZZP", 45);
}

function changeToFlex(username, salary) {
    updateRole(username, "Flex", salary);
}

function updateRole(username, role, salary) {
    const requestBody = {
        Username: username,
        Role: role,
        SalaryPerHourInEuro: salary,
    };

    fetch("https://skoolworkshopapi.azurewebsites.net/user/changeRole", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
    .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then((data) => {
        console.log("Response data:", data);
        if (data.status === 200) {
            alert("User role and salary updated successfully");
            document.getElementById("userType").innerText = role;
            document.getElementById("salary").innerText = salary;
        } else {
            alert("Failed to update user role and salary");
        }
    })
    .catch((error) => {
        console.error("There was an error updating the user role and salary", error);
        alert("Error updating user role and salary");
    });
}

function makeFlex() {
    const container = document.getElementById("new-input-container");
    const inputHtml = `
        <div class="row">
            <div class="col-md-8">
                <input required type="number" class="form-control" id="newSalary" placeholder="Salaris per uur">
            </div>
            <div class="col-md-4">
                <button onclick="confirmFlex()" class="btn btn-success">
                    <span style="color: white;">✔</span>
                </button>
            </div>
        </div>`;
    container.innerHTML = inputHtml;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
}
