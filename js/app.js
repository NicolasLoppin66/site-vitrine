import { Navigation } from "./modules/navigation.js";
import { Animations } from "./modules/animations.js";
import { ContactForm } from "./modules/form.js";
import { loadServices } from "./utils/helpers.js";

class App {
  constructor() {
    this.navigation = new Navigation();
    this.animations = new Animations();
    this.contactForm = new ContactForm();

    this.init();
  }

  init() {
    // Initialisation des modules
    this.navigation.init();
    this.animations.init();
    this.contactForm.init();

    // Chargement des données
    this.loadInitialData();

    // Gestion des événements globaux
    this.bindEvents();

    console.log("🚀 Application initialisée");
  }

  async loadInitialData() {
    try {
      await loadServices();
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  }

  bindEvents() {
    // Scroll smooth pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Gestion du scroll pour le header
    window.addEventListener("scroll", () => {
      this.handleScroll();
    });
  }

  handleScroll() {
    const header = document.getElementById("header");
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
}

// Initialisation de l'application quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
