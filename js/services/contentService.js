import { apiClient } from "../utils/api.js";

export class ContentService {
  constructor() {
    this.cacheKey = "website_content";
    this.cacheDuration = 15 * 60 * 1000; // 15 minutes
  }

  // Récupérer tout le contenu
  async getWebsiteContent() {
    try {
      // Vérifier le cache
      const cached = this.getFromCache(this.cacheKey);
      if (cached) return cached;

      // Récupérer depuis l'API
      const content = await apiClient.get("/content/website");

      // Mettre en cache
      this.setToCache(this.cacheKey, content);

      return content;
    } catch (error) {
      console.error("Erreur chargement contenu:", error);
      return this.getFallbackContent();
    }
  }

  // Récupérer les services
  async getServices() {
    try {
      const response = await apiClient.get("/services");
      return response.data;
    } catch (error) {
      return this.getFallbackServices();
    }
  }

  // Récupérer les projets
  async getProjects() {
    try {
      const response = await apiClient.get("/projects?featured=true");
      return response.data;
    } catch (error) {
      return this.getFallbackProjects();
    }
  }

  // Gestion du cache
  getFromCache(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);

    if (Date.now() - timestamp > this.cacheDuration) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  }

  setToCache(key, data) {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }

  // Contenu de fallback
  getFallbackContent() {
    return {
      services: [
        {
          id: 1,
          title: "Développement Web",
          description: "Service de développement web personnalisé",
          icon: "💻",
        },
      ],
      projects: [
        {
          id: 1,
          title: "Projet Exemple",
          description: "Description du projet",
          image: "images/default-project.jpg",
        },
      ],
    };
  }

  getFallbackServices() {
    return [
      {
        id: 1,
        title: "Développement Web",
        description:
          "Créez votre présence en ligne avec nos solutions web sur mesure.",
        icon: "💻",
      },
    ];
  }

  getFallbackProjects() {
    return [
      {
        id: 1,
        title: "Site Vitrine",
        description: "Exemple de réalisation",
        image: "images/default-project.jpg",
        category: "Développement",
      },
    ];
  }
}
