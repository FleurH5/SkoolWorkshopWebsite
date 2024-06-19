document.addEventListener("DOMContentLoaded", function () {
  const kvkField = document.getElementById("kvkField");
  const btwField = document.getElementById("btwField");
  const geboortedatumInput = document.getElementById("geboortedatum");
  const ibanInput = document.getElementById("bankrekeningnummer");
  const validIcon = document.getElementById("valid-iban-icon");
  const registrationForm = document.getElementById("registrationForm");
  const passwordInput = document.getElementById("wachtwoord");
  const confirmPasswordInput = document.getElementById("bevestig_wachtwoord");
  const passwordMismatch = document.getElementById("passwordMismatch");
  const passwordRequirements = document.getElementById("passwordRequirements");
  const successPopup = document.getElementById("successPopup");

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

  async function validateIBAN() {
    const iban = ibanInput.value.trim();

    if (iban.length === 0) {
      validIcon.style.display = "none";
      validIcon.classList.remove("valid", "invalid");
      return;
    }

    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/iban?iban=${iban}`,
        {
          headers: {
            "X-Api-Key": "ok6d642VlAFXbnaLPkCf9w==bUIO2k4FesuljgY2",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Fout bij het valideren van IBAN");
      }

      const data = await response.json();
      validIcon.style.display = "inline";

      if (data.valid) {
        validIcon.classList.add("valid");
        validIcon.classList.remove("invalid");
        validIcon.innerHTML = "&#10004;"; // Unicode for check mark
      } else {
        validIcon.classList.add("invalid");
        validIcon.classList.remove("valid");
        validIcon.innerHTML = "&#10008;"; // Unicode for cross mark
        alert("Ongeldige IBAN, probeer het opnieuw.");
      }
    } catch (error) {
      console.error("Error validating IBAN:", error);
      alert("Er is een fout opgetreden bij het valideren van de IBAN.");
    }
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

  // Event listener voor het verzenden van het formulier
  registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validatePostcode()) {
      return;
    }

    const selectedWorkshops = Array.from(
      document.querySelectorAll(
        '#workshopOptions input[type="checkbox"]:checked'
      )
    ).map((checkbox) => checkbox.value);

    const formData = {
      Username: document.getElementById("naam").value,
      Birthdate: document.getElementById("geboortedatum").value,
      City: document.getElementById("woonplaats").value,
      Address: document.getElementById("adres").value,
      Email: document.getElementById("email").value,
      Password: passwordInput.value,
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
      HasCar: false,
      HasLicense: false,
      Status: "Afwachtend",
      Workshops: selectedWorkshops,
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
        successPopup.style.display = "block";
        setTimeout(function () {
          successPopup.style.display = "none";
        }, 3000);
        registrationForm.reset();
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

  // Password validatie
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

  // Confirm Password validatie
  confirmPasswordInput.addEventListener("input", function () {
    if (confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordInput.setCustomValidity("invalid");
      passwordMismatch.style.display = "block";
    } else {
      confirmPasswordInput.setCustomValidity("");
      passwordMismatch.style.display = "none";
    }
  });

  // Functie om de postcode te valideren
  function validatePostcode() {
    const postcode = document.getElementById("postcode").value.trim();
    const land = document.getElementById("land").value;

    let regex;
    if (land === "Nederland") {
      regex = new RegExp("^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$", "i");
    } else if (land === "Belgie") {
      regex = new RegExp("^\\d{4}$");
    }

    if (!regex.test(postcode)) {
      alert("Voer een geldige postcode in voor " + land);
      return false;
    }

    return true;
  }

  // Event listener voor het veranderen van het land selectieveld
  document.getElementById("land").addEventListener("change", function () {
    const land = this.value;
    const postcodeInput = document.getElementById("postcode");

    if (land === "Nederland") {
      postcodeInput.placeholder = "4822 HV";
      // Voeg eventuele andere validatie toe voor Nederlandse postcodes
    } else if (land === "Belgie") {
      postcodeInput.placeholder = "1000-1299";
      // Voeg eventuele andere validatie toe voor Belgische postcodes
    }
  });
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
