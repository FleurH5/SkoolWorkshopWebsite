document.addEventListener("DOMContentLoaded", function () {
  const kvkField = document.getElementById("kvkField");
  const btwField = document.getElementById("btwField");
  const zzpRadio = document.getElementById("docentZZP");
  const flexRadio = document.getElementById("docentFlex");
  const ibanInput = document.getElementById("bankrekeningnummer");
  const validIcon = document.getElementById("valid-iban-icon");
  const geboortedatumInput = document.getElementById("geboortedatum");

  // Show/hide BTW field based on selected docent type
  zzpRadio.addEventListener("change", function () {
    if (zzpRadio.checked) {
      kvkField.style.display = "block";
      btwField.style.display = "block";
      document.getElementById("btwnummer").setAttribute("required", "true");
    }
  });

  flexRadio.addEventListener("change", function () {
    if (flexRadio.checked) {
      kvkField.style.display = "none";
      btwField.style.display = "none";
      document.getElementById("btwnummer").removeAttribute("required");
    }
  });

  // Fetch workshop names from the server and populate the select field with checkboxes
  fetch("https://skoolworkshopapi.azurewebsites.net/workshop/allnames")
    .then((response) => response.json())
    .then((data) => {
      const workshopOptions = document.getElementById("workshopOptions");
      data.data.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.classList.add("dropdown-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = item.WorkshopName;
        checkbox.id = item.WorkshopName;

        const label = document.createElement("label");
        label.htmlFor = item.WorkshopName;
        label.textContent = item.WorkshopName;

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        workshopOptions.appendChild(listItem);
      });
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

  // Validate date of birth to ensure it's not after today
  geboortedatumInput.addEventListener("change", function () {
    const selectedDate = new Date(geboortedatumInput.value);
    const today = new Date();

    if (selectedDate > today) {
      geboortedatumInput.setCustomValidity(
        "De geboortedatum kan niet in de toekomst liggen."
      );
      geboortedatumInput.reportValidity();
    } else {
      geboortedatumInput.setCustomValidity("");
    }
  });

  // Password and confirm password validation
  const passwordInput = document.getElementById("wachtwoord");
  const confirmPasswordInput = document.getElementById("bevestig_wachtwoord");
  const passwordMismatch = document.getElementById("passwordMismatch");
  const passwordRequirements = document.getElementById("passwordRequirements");

  confirmPasswordInput.addEventListener("input", function () {
    if (confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordInput.setCustomValidity("invalid");
      passwordMismatch.style.display = "block";
    } else {
      confirmPasswordInput.setCustomValidity("");
      passwordMismatch.style.display = "none";
    }
  });

  passwordInput.addEventListener("input", function () {
    const password = passwordInput.value;
    const regex = /^(?=.*[A-Z]).{8,}$/; // Minimaal 8 tekens en minstens één hoofdletter
    if (!regex.test(password)) {
      passwordInput.setCustomValidity("invalid");
      passwordRequirements.style.display = "block";
    } else {
      passwordInput.setCustomValidity("");
      passwordRequirements.style.display = "none";
    }
  });

  registrationForm.addEventListener("submit", function (event) {
    if (
      confirmPasswordInput.value !== passwordInput.value ||
      !/^(?=.*[A-Z]).{8,}$/.test(passwordInput.value)
    ) {
      event.preventDefault(); // Voorkom dat het formulier wordt verzonden
    }
  });
});
