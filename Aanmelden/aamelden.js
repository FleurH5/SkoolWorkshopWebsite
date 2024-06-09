document.addEventListener("DOMContentLoaded", function () {
  const kvkField = document.getElementById("kvkField");
  const btwField = document.getElementById("btwField");
  const zzpRadio = document.getElementById("docentZZP");
  const flexRadio = document.getElementById("docentFlex");
  const ibanInput = document.getElementById("bankrekeningnummer");
  const validIcon = document.getElementById("valid-iban-icon");

  zzpRadio.addEventListener("change", function () {
    if (zzpRadio.checked) {
      kvkField.style.display = "block";
      btwField.style.display = "block";
    }
  });

  flexRadio.addEventListener("change", function () {
    if (flexRadio.checked) {
      kvkField.style.display = "none";
      btwField.style.display = "none";
    }
  });

  // Fetch workshop names from the server and populate the select field
  let workshopOptions = "";
  let addedCategories = new Set(); // Set to keep track of added categories

  fetch("https://skoolworkshopapi.azurewebsites.net/workshop/all")
    .then((response) => response.json())
    .then((data) => {
      workshopOptions += `<option value="" disabled selected>Category?</option>`; // Placeholder option
      data.data.forEach((item) => {
        // Check if the category has not been added yet
        if (!addedCategories.has(item.Category)) {
          workshopOptions += `<option value="${item.Category}">${item.Category}</option>`;
          addedCategories.add(item.Category); // Add category to the set
        }
      });
      document.getElementById("workshopSelect").innerHTML = workshopOptions; // Set workshop options
    })
    .catch((error) => {
      console.error("Error fetching workshop names:", error);
    });

  // Add event listener to the form
  const registrationForm = document.getElementById("registrationForm");
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    validateIBAN(() => registrationForm.submit());
  });

  // Add event listener to the IBAN input for real-time validation
  ibanInput.addEventListener("input", function () {
    validateIBAN();
  });

  // Function to validate IBAN
  function validateIBAN(callback) {
    const iban = ibanInput.value;

    if (iban.length === 0) {
      validIcon.style.display = "none";
      validIcon.classList.remove("valid", "invalid");
      return;
    }

    fetch(`https://api.api-ninjas.com/v1/iban?iban=${iban}`, {
      method: "GET",
      headers: {
        "X-Api-Key": "ok6d642VlAFXbnaLPkCf9w==bUIO2k4FesuljgY2",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        validIcon.style.display = "inline";
        if (data.valid) {
          validIcon.classList.add("valid");
          validIcon.classList.remove("invalid");
          validIcon.innerHTML = "&#10004;"; // Unicode for check mark
          if (callback) callback();
        } else {
          validIcon.classList.add("invalid");
          validIcon.classList.remove("valid");
          validIcon.innerHTML = "&#10008;"; // Unicode for cross mark
          if (callback) alert("Ongeldige IBAN, probeer het opnieuw.");
        }
      })
      .catch((error) => {
        console.error("Error validating IBAN:", error);
        alert("Er is een fout opgetreden bij het valideren van de IBAN.");
      });
  }
});

// EMAIL VERZENDEN
document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");

  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Verzamel de ingevoerde gegevens
    const formData = new FormData(registrationForm);
    const email = formData.get("email");

    // AJAX-verzoek om de verificatie-e-mail te verzenden
    fetch("backend_endpoint_url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => {
        if (response.ok) {
          // Toon een succesbericht aan de gebruiker
          alert(
            "Een verificatie-e-mail is verzonden naar uw e-mailadres. Controleer uw inbox om het registratieproces te voltooien."
          );
        } else {
          // Toon een foutmelding aan de gebruiker
          alert(
            "Er is een fout opgetreden bij het verzenden van de verificatie-e-mail. Probeer het later opnieuw."
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Toon een foutmelding aan de gebruiker
        alert(
          "Er is een fout opgetreden bij het verzenden van de verificatie-e-mail. Probeer het later opnieuw."
        );
      });
  });
});
