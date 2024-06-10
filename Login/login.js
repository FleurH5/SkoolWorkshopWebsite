document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "https://skoolworkshopapi.azurewebsites.net/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.data.token);

        const userRole = data.data.userRole; // Admin, Docent, Moderator

        switch (userRole) {
          case "Admin":
            window.location.href =
              "http://127.0.0.1:5500/Admin/adminDashboard.html"; // Doorsturen naar het dashboard
            break;
          case "Default":
            window.location.href =
              "http://127.0.0.1:5500/Admin/Homepage/homepage.html";
            break;
          case "Moderator":
            window.location.href =
              "http://127.0.0.1:5500/Admin/adminDashboard.html";
            break;
          default:
            console.error("Unknown role:", userRole);
            document.getElementById("error-message").textContent =
              "Onbekende rol. Neem contact op met de beheerder.";
            document.getElementById("error-message").style.display = "block";
        }
      } else {
        document.getElementById("error-message").textContent =
          "Ongeldig emailadres of wachtwoord. Probeer het opnieuw.";
        document.getElementById("error-message").style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("error-message").textContent =
        "Er is een fout opgetreden. Probeer het later opnieuw.";
      document.getElementById("error-message").style.display = "block";
    }
  });
