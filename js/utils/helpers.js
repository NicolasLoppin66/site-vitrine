// Données des services (peut être remplacé par une API)
const servicesData = [
  {
    id: 1,
    title: "Développement Web",
    description: "Création de sites web modernes et responsives",
    icon: "💻",
  },
  {
    id: 2,
    title: "Design UX/UI",
    description: "Interfaces utilisateur intuitives et esthétiques",
    icon: "🎨",
  },
  {
    id: 3,
    title: "SEO",
    description: "Optimisation pour les moteurs de recherche",
    icon: "🚀",
  },
];

export async function loadServices() {
  const servicesGrid = document.getElementById("servicesGrid");

  if (!servicesGrid) return;

  try {
    // Simulation d'un chargement asynchrone
    await new Promise((resolve) => setTimeout(resolve, 500));

    const servicesHTML = servicesData
      .map(
        (service) => `
            <div class="service-card" data-aos="fade-up">
                <div class="service-icon">${service.icon}</div>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description}</p>
            </div>
        `
      )
      .join("");

    servicesGrid.innerHTML = servicesHTML;
  } catch (error) {
    console.error("Erreur lors du chargement des services:", error);
    servicesGrid.innerHTML = "<p>Erreur lors du chargement des services</p>";
  }
}

// Fonction de debounce pour optimiser les événements
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Gestionnaire d'erreurs global
export function setupErrorHandling() {
  window.addEventListener("error", (event) => {
    console.error("Erreur globale:", event.error);
    // Ici vous pourriez envoyer l'erreur à un service de tracking
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Promise rejetée non gérée:", event.reason);
    event.preventDefault();
  });
}

// Fonctions utilitaires pour le localStorage
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Erreur localStorage set:", error);
    }
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Erreur localStorage get:", error);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Erreur localStorage remove:", error);
    }
  },
};
