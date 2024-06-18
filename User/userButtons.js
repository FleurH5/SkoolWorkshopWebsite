function confirmChanges() {
    console.log('confirmChanges clicked')
  let result = confirm("Weet je het zeker?");
  if(result === true) {
    console.log('Changed');
    updateUser(); 
  } else {
    console.log('Canceled');
  }
}

function updateUser() {
  console.log('updateUser clicked');
  
  const form = document.getElementById('userForm');
  const formData = new FormData(form);
  const requestBody = {};

  formData.forEach((value, key) => {
      if (value !== "" && value !== "Selecteer een optie") {
          requestBody[key] = value;
      }
  });

  console.log('Request Body:', requestBody);

  fetch('https://skoolworkshopapi.azurewebsites.net/user/updateProfile', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
  })
  .then(response => {
      console.log('Response status:', response.status);
      return response.json();
  })
  .then(data => {
      console.log('Response data:', data);
      if (data.status === 200) {
          alert('Gebruikersgegevens succesvol bijgewerkt');
          document.querySelector('.alert-success').style.display = 'block';
      } else {
          alert('Het bijwerken van gebruikersgegevens is mislukt');
      }
  })
  .catch(error => {
      console.error("Er was een fout bij het bijwerken van de gebruikersgegevens", error);
      alert('Fout bij het bijwerken van gebruikersgegevens');
  });
}