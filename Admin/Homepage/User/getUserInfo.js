/* <script src="authenticate.js"></script>
      
      $(document).ready(function () {
        const userId = localStorage.getItem("userId");
        console.log(userId); 
        console.log("Document ready. Attempting to fetch workshops.");
        const apiUrl = "https://skoolworkshopapi.azurewebsites.net/workshopcommission/" + userId;
         */

const userId = 1;
      

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
    // })
