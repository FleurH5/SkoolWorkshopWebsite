class MainNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav
      class="navbar navbar-expand-lg navbar-dark"
      style="background: #3a2d2d"
    >
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img
            class="img-fluid custom-img-size"
            src="../Images/SKWLogoTransparentWhite.png"
            alt="SkoolWorkshop Logo"
          />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#myNavbar"
          aria-controls="myNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="myNavbar">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="addWorkshops.html"
                ><span class="bi bi-person"></span> Your Account</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="https://weather.com/nl-NL/weer/vandaag/l/NLXX0002:1:NL?Goto=Redirected"
                target="_blank"
                ><span class="bi bi-globe"></span> Weather</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
          `;
  }
}

customElements.define("main-nav", MainNav);

class MainFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
      <p>Skoolworkshop Copyright © 2024</p>
    </footer>
          `;
  }
}

customElements.define("main-footer", MainFooter);
