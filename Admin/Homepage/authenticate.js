document.addEventListener("DOMContentLoaded", () => {
  // Haal de JWT-token op uit de localStorage
  const token = localStorage.getItem("accessToken");

  // Controleer of er een token aanwezig is
  if (!token) {
    window.location.href = "http://127.0.0.1:5500/Login/login.html"; // Redirect de gebruiker naar de inlogpagina als er geen token is
    console.log("No token found");
    return;
  }

  // Voer een GET-verzoek uit om de token te valideren
  fetch("https://skoolworkshopapi.azurewebsites.net/auth/validate-token", {
    // Gebruik de validate-token endpoint
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Voeg de JWT-token toe aan de Authorization header
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid token");
      }
      return response.json();
    })
    .then((data) => {
      if (data.message === "Token is valid") {
        const userId = data.decoded.id;
        console.log("userId: " + userId);
        localStorage.setItem("userId", userId);

        console.log("Token is valid");
      } else {
        throw new Error("Invalid token");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      localStorage.removeItem("accessToken");
      window.location.href = "http://127.0.0.1:5500/Login/login.html"; // Redirect de gebruiker naar de inlogpagina in het geval van een fout
    });
});

//   document
//     .getElementById("logout-button")
//     .addEventListener("click", function () {
//       localStorage.removeItem("accessToken"); // Verwijder de token uit de lokale opslag
//       window.location.href =
//         "http://127.0.0.1:5500/Login/login.html"; // Leid de gebruiker om naar de loginpagina
//     });
