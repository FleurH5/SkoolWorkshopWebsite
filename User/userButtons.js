function confirmChanges() {
    let result = confirm("Weet je het zeker?");
    if(result === true) {
        updateUser(); 
        console.log('Changed')
    } else {
        console.log('Canceled')
    }
}

function updateUser(){
    console.log('updateUser clicked')
}