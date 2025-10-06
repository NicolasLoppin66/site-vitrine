export class Navigation {
  constructor() {
    this.navToggle = document.getElementById("navToggle");
    this.navMenu = document.getElementById("navMenu");
    this.isOpen = false;
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Toggle menu mobile
    if (this.navToggle) {
      this.navToggle.addEventListener("click", () => {
        this.toggleMenu();
      });
    }

    // Fermer le menu en cliquant sur un lien
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (this.isOpen) {
          this.closeMenu();
        }
      });
    });

    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener("click", (e) => {
      if (
        this.isOpen &&
        !this.navToggle.contains(e.target) &&
        !this.navMenu.contains(e.target)
      ) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.navMenu.classList.add("active");
    this.navToggle.classList.add("active");
    this.isOpen = true;
    document.body.style.overflow = "hidden";
  }

  closeMenu() {
    this.navMenu.classList.remove("active");
    this.navToggle.classList.remove("active");
    this.isOpen = false;
    document.body.style.overflow = "";
  }
}
