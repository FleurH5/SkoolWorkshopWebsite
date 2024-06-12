document.addEventListener('DOMContentLoaded', function() {
    function getQueryParams() {
      const params = new URLSearchParams(window.location.search);
      return Object.fromEntries(params.entries());
    }
  
    const queryParams = getQueryParams();
    const userId = queryParams.userId;
  
    if (!userId) {
      console.error('No userId found in query parameters');
      return;
    }
  
    fetch(`https://skoolworkshopapi.azurewebsites.net/user/${userId}`)
      .then(response => response.json())
      .then(data => {
          if (data.status === 200) {
              const user = data.data[0];
              const username = user.Username;
              //upper information
              document.getElementById('userName').innerText = user.Username;
              console.log(user.Username);
              document.getElementById('status').innerText = user.Status;
              document.getElementById('userType').innerText = user.Role;
              document.getElementById('email').innerText = user.Email;
              // document.getElementById('workshops').innerText = user.
              // bestaat daar nog niet in de db
  
              //contact information
              document.getElementById('phoneNumber').innerText = user.PhoneNumber;
              document.getElementById('address').innerText = user.Address;
              document.getElementById('postalcode').innerText = user.PostalCode;
  
              //personal information
              document.getElementById('DOB').innerText = user.Birthdate;
              document.getElementById('country').innerText = user.Country;
              document.getElementById('languagesSpoken').innerText = user.Language;
  
              //travel information
              document.getElementById('publicTransit').innerText = user.UsesPublicTransit;
              document.getElementById('license').innerText = user.HasLicense;
              document.getElementById('car').innerText = user.HasCar;
  
              //payment information
              document.getElementById('salary').innerText = user.SalaryPerHourInEuro;
              document.getElementById('bankinfo').innerText = user.BankId;
              document.getElementById('btwnr').innerText = user.BTWNumber;
              document.getElementById('kvknr').innerText = user.KVKNumber;
  
              //make globally accessible
              window.user = user;
              window.username = user.Username;
              
          } else {
              console.log('Failed to get user data');
          }
      })
      .catch(error => console.error('Error while fetching user data:', error));
  })
  
  function confirmationBlock() {
      let result = confirm("Weet je het zeker?");
      if(result === true) {
          block(window.username); 
          console.log('Blocked')
      } else {
          console.log('Canceled')
      }
  }
  
  function confirmationUnblock() {
      let result = confirm("Weet je het zeker?");
      if(result === true) {
          unblock(window.username); 
          console.log('Unblocked')
      } else {
          console.log('Canceled')
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
  