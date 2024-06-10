document.addEventListener("DOMContentLoaded", () => {
    // Haal de JWT-token op uit de localStorage
    const token = localStorage.getItem("accessToken");

    // Controleer of er een token aanwezig is
    if (!token) {
      //window.location.href = "http://127.0.0.1:5500/Login/login.html"; // Redirect de gebruiker naar de inlogpagina als er geen token is
      console.error("No token found");
      return;
    }

    // Voer een GET-verzoek uit om de token te valideren
    fetch(
      "https://skoolworkshopapi.azurewebsites.net/auth/validate-token",
      {
        // Gebruik de validate-token endpoint
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Voeg de JWT-token toe aan de Authorization header
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid token");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "Token is valid") {
          console.log("Token is valid");
        } else {
          throw new Error("Invalid token");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        localStorage.removeItem("accessToken");
        //window.location.href = "http://127.0.0.1:5500/Login/login.html"; // Redirect de gebruiker naar de inlogpagina in het geval van een fout
      });

    // Verwijder de token uit de localStorage bij het sluiten van het tabblad
    window.addEventListener("beforeunload", function (e) {
      localStorage.removeItem("accessToken");
    });
  });