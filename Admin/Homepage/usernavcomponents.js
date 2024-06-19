class SideNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="sidenav">
        <ul class="nav flex-column">
          <li>
        <a class="nav-link" href="userProfile.html"><span class="bi bi-file-person"></span> Profiel</a>
      </li>
      <li>
        <a class="nav-link" href="homepage.html"><span class="bi bi-calendar2-week"></span> Alle workshops</a>
      </li>
      <li>
        <a class="nav-link" href="myCommissions.html"><span class="bi bi-bell"></span> Mijn workshops</a>
      </li>
      <li>
        <a class="nav-link" href="userEnrollments.html"><span class="bi bi-bookmarks"></span> Mijn inschrijvingen</a>
      </li>
      <li>
        <a class="nav-link" href="userEnrollments.html"><span class="bi bi-bookmarks"></span> Mijn inschrijvingen</a>
      </li>
        <button class="nav-btn btn-outline-light m-5" id="logout-button">
        Log uit
      </button>
      </div>
        `;
  }
}

customElements.define("side-nav", SideNav);

class NavBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-dark bg-white navbar-border-bottom">
                <div class="container-fluid">
                    <a class="navbar-brand" href="homepage.html">
                        <img src="../../Images/Skool-Workshop_Logo_Black.jpg" alt="Logo" width="100" height="30" class="d-inline-block align-text-top">
                    </a>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <i class="bi bi-person"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
  }
}

customElements.define("nav-bar", NavBar);

document
        .getElementById("logout-button")
        .addEventListener("click", function () {
          localStorage.removeItem("accessToken"); // Verwijder de token uit de lokale opslag
          window.location.href =
            "http://127.0.0.1:5500/Login/login.html"; // Leid de gebruiker om naar de loginpagina
        });
