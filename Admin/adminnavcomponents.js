class SideNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="sidenav">
        <ul class="nav flex-column">
          <li>
            <a class="nav-link" href="adminDashboard.html"><span class="bi bi-speedometer2"></span> Dashboard</a>
          </li>
          <li>
            <a class="nav-link" href="allWorkshopsAdmin.html"> <span class="bi bi-person-arms-up"></span> Workshops</a>
          </li>
          <li>
            <a class="nav-link" href="assignmentOverview.html"> <span class="bi bi-calendar"></span> Opdrachten</a>
          </li>
          <li>
            <a class="nav-link" href="clients.html"><span class="bi bi-person"></span> Klanten</a>
          </li>
          <li>
            <a class="nav-link" href="allAccounts.html"><span class="bi bi-suitcase-lg"></span> Docenten</a>
          </li>
          <li><a class="nav-link" href="EmailTemplatesPage.html"><span class="bi bi-mailbox"></span> Email Templates</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="sidebardropdown" role="button" aria-haspopup="true" aria-expanded="false">
              <span class="bi bi-plus-lg"></span> Nieuw
            </a>
            <ul class="dropdown-menu" aria-labelledby="sidebardropdown">
              <li><a class="dropdown-item" href="addWorkshops.html">Workshop</a></li>
              <li><a class="dropdown-item" href="addCommission.html">Opdracht</a></li>
              <li><a class="dropdown-item" href="registerClient.html">Klant</a></li>
            </ul>
          </li>
          <li>
          <a class="nav-link" href="Aanmeldingen.html"><span class="bi bi-bookmark-check-fill"></span> Aanmeldingen</a>
          </li>
        </ul>
        <div class="d-flex justify-content-center mt-5">
        <button
          id="logout-button"
          style="padding: 5px"
          type="button"
          class="btn btn-primary nav-btn"
          data-bs-toggle="modal"
          data-bs-target="#commissionModal"
        >
        Log uit
      </button>
      </div>
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
                    <a class="navbar-brand" href="Homepage/Homepage.html">
                        <img src="../Images/Skool-Workshop_Logo_Black.jpg" alt="Logo" width="100" height="30" class="d-inline-block align-text-top">
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

document.getElementById("logout-button").addEventListener("click", function () {
  localStorage.removeItem("accessToken"); // Verwijder de token uit de lokale opslag
  window.location.href = "http://127.0.0.1:5500/Login/login.html"; // Leid de gebruiker om naar de loginpagina
});
