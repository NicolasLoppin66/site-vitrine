// ===== CONFIGURATION DE L'API =====
const API_CONFIG = {
  baseURL: process.env.API_URL || "https://api.monsite.com/v1",
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// ===== CLIENT HTTP =====
class ApiClient {
  constructor(config = {}) {
    this.config = { ...API_CONFIG, ...config };
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  // Intercepteurs
  interceptRequest(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  interceptResponse(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  // Méthode HTTP générique
  async request(endpoint, options = {}) {
    const url = `${this.config.baseURL}${endpoint}`;
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Appliquer les intercepteurs de requête
    for (const interceptor of this.interceptors.request) {
      await interceptor(config);
    }

    let response;
    let attempts = 0;

    while (attempts <= this.config.retryAttempts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout
        );

        config.signal = controller.signal;

        response = await fetch(url, config);
        clearTimeout(timeoutId);

        // Appliquer les intercepteurs de réponse
        for (const interceptor of this.interceptors.response) {
          await interceptor(response);
        }

        if (!response.ok) {
          throw new HttpError(response.status, response.statusText);
        }

        return await this.handleResponse(response);
      } catch (error) {
        attempts++;

        if (attempts > this.config.retryAttempts) {
          throw this.handleError(error);
        }

        await this.delay(this.config.retryDelay * attempts);
      }
    }
  }

  async handleResponse(response) {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  }

  handleError(error) {
    if (error.name === "AbortError") {
      return new ApiError("Timeout: La requête a pris trop de temps");
    }

    if (error instanceof HttpError) {
      return error;
    }

    return new ApiError(`Erreur réseau: ${error.message}`);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Méthodes HTTP spécifiques
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  // Upload de fichiers
  async upload(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      headers: {
        ...options.headers,
      },
    });
  }
}

// ===== CLASSES D'ERREUR =====
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiError";
  }
}

// ===== SERVICES SPÉCIFIQUES =====

// Service pour les contacts
class ContactService {
  constructor(apiClient) {
    this.api = apiClient;
    this.endpoint = "/contacts";
  }

  async sendContact(formData) {
    try {
      const response = await this.api.post(this.endpoint, formData);
      return {
        success: true,
        data: response,
        message: "Message envoyé avec succès",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Erreur lors de l'envoi du message",
      };
    }
  }

  async subscribeNewsletter(email) {
    try {
      const response = await this.api.post("/newsletter/subscribe", { email });
      return {
        success: true,
        data: response,
        message: "Inscription à la newsletter réussie",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Erreur lors de l'inscription",
      };
    }
  }
}

// Service pour les projets/portfolio
class ProjectService {
  constructor(apiClient) {
    this.api = apiClient;
    this.endpoint = "/projects";
  }

  async getAllProjects(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `${this.endpoint}?${queryParams}`
        : this.endpoint;

      const response = await this.api.get(endpoint);
      return {
        success: true,
        data: response,
        projects: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        projects: [],
      };
    }
  }

  async getProjectById(id) {
    try {
      const response = await this.api.get(`${this.endpoint}/${id}`);
      return {
        success: true,
        data: response,
        project: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        project: null,
      };
    }
  }

  async getFeaturedProjects() {
    try {
      const response = await this.api.get(`${this.endpoint}?featured=true`);
      return {
        success: true,
        data: response,
        projects: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        projects: [],
      };
    }
  }
}

// Service pour les services
class ServiceService {
  constructor(apiClient) {
    this.api = apiClient;
    this.endpoint = "/services";
  }

  async getAllServices() {
    try {
      const response = await this.api.get(this.endpoint);
      return {
        success: true,
        data: response,
        services: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        services: [],
      };
    }
  }

  async getServiceBySlug(slug) {
    try {
      const response = await this.api.get(`${this.endpoint}/${slug}`);
      return {
        success: true,
        data: response,
        service: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        service: null,
      };
    }
  }
}

// Service pour le blog/articles
class BlogService {
  constructor(apiClient) {
    this.api = apiClient;
    this.endpoint = "/articles";
  }

  async getArticles(page = 1, limit = 10) {
    try {
      const response = await this.api.get(
        `${this.endpoint}?page=${page}&limit=${limit}`
      );
      return {
        success: true,
        data: response,
        articles: response.data || response,
        pagination: response.pagination || {},
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        articles: [],
        pagination: {},
      };
    }
  }

  async getArticleBySlug(slug) {
    try {
      const response = await this.api.get(`${this.endpoint}/${slug}`);
      return {
        success: true,
        data: response,
        article: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        article: null,
      };
    }
  }

  async getRelatedArticles(articleId, limit = 3) {
    try {
      const response = await this.api.get(
        `${this.endpoint}/${articleId}/related?limit=${limit}`
      );
      return {
        success: true,
        data: response,
        articles: response.data || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        articles: [],
      };
    }
  }
}

// ===== GESTION DU CACHE =====
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    const item = this.cache.get(key);
    return item && Date.now() <= item.expiry;
  }
}

// ===== INSTANCE PRINCIPALE ET EXPORTS =====

// Création de l'instance principale
const apiClient = new ApiClient();

// Configuration des intercepteurs
apiClient.interceptRequest(async (config) => {
  // Ajouter le token d'authentification
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Ajouter des headers personnalisés
  config.headers["X-Requested-With"] = "XMLHttpRequest";
});

apiClient.interceptResponse(async (response) => {
  // Gérer les erreurs globales
  if (response.status === 401) {
    // Token expiré, rediriger vers la page de login
    localStorage.removeItem("auth_token");
    window.location.href = "/login";
  }

  if (response.status === 429) {
    // Trop de requêtes
    throw new HttpError(429, "Trop de requêtes, veuillez réessayer plus tard");
  }
});

// Instances des services
const contactService = new ContactService(apiClient);
const projectService = new ProjectService(apiClient);
const serviceService = new ServiceService(apiClient);
const blogService = new BlogService(apiClient);

// Gestionnaire de cache global
const cacheManager = new CacheManager();

// Export des services et utilitaires
export {
  ApiClient,
  HttpError,
  ApiError,
  ContactService,
  ProjectService,
  ServiceService,
  BlogService,
  CacheManager,
  apiClient,
  contactService,
  projectService,
  serviceService,
  blogService,
  cacheManager,
};

// Export par défaut
export default apiClient;
