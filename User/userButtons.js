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
  // Add your update logic here
}