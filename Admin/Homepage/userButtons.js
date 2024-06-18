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