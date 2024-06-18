document.addEventListener("DOMContentLoaded", function () {
  const kvkField = document.getElementById("kvkField");
  const btwField = document.getElementById("btwField");
  const geboortedatumInput = document.getElementById("geboortedatum");
  const ibanInput = document.getElementById("bankrekeningnummer");
  const validIcon = document.getElementById("valid-iban-icon");
  const registrationForm = document.getElementById("registrationForm");

  // Toon/verberg BTW- en KVK-velden op basis van geselecteerde docenttype
  document
    .querySelectorAll('input[name="docentType"]')
    .forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (radio.value === "ZZP") {
          kvkField.style.display = "block";
          btwField.style.display = "block";
          document.getElementById("btwnummer").setAttribute("required", "true");
        } else {
          kvkField.style.display = "none";
          btwField.style.display = "none";
          document.getElementById("btwnummer").removeAttribute("required");
        }
      });
    });

  // IBAN validatie
  ibanInput.addEventListener("input", function () {
    validateIBAN();
  });

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

  // Geboortedatum validatie
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

  // Event listener voor het verzenden van het formulier
  registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      Username: document.getElementById("naam").value,
      Birthdate: document.getElementById("geboortedatum").value,
      City: document.getElementById("woonplaats").value,
      Address: document.getElementById("adres").value,
      Email: document.getElementById("email").value,
      Password: document.getElementById("wachtwoord").value,
      PhoneNumber: document.getElementById("telefoonnummer").value,
      PostalCode: document.getElementById("postcode").value,
      Country: document.getElementById("land").value,
      Language: document.getElementById("spreektaal").value,
      BTWNumber: document.getElementById("btwnummer").value,
      KVKNumber: document.getElementById("kvknummer").value,
      BankId: document.getElementById("bankrekeningnummer").value,
      Role: document.querySelector('input[name="docentType"]:checked').value,
      Permission: "Default",
      SalaryPerHourInEuro: 100,
      UsesPublicTransit: false,
      HasCar: true,
      HasLicense: true,
      Status: "Afwachtend",
    };

    try {
      const response = await fetch(
        "https://skoolworkshopapi.azurewebsites.net/user/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log("Server respons:", result);

      if (response.ok) {
        alert("Wij hebben uw aanmelding succesvol ontvangen");
      } else {
        alert(
          "Fout: " + (result.message || "Er is een onbekende fout opgetreden")
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Er is een fout opgetreden bij het toevoegen van de gebruiker");
    }
  });
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
