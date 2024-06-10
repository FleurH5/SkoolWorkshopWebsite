document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; //hardcoded 1 voor nu voor janine doe
    fetch('/user/${userId}')
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            const user = data.data[0];
            document.querySelector('h2').innerText = user.Username;
            document.querySelector('')
        }
    })
})