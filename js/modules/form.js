export class ContactForm {
  constructor() {
    this.form = document.getElementById("contactForm");
    this.submitBtn = this.form?.querySelector(".submit-btn");
  }

  init() {
    if (this.form) {
      this.bindEvents();
      this.setupValidation();
    }
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Validation en temps réel
    this.form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input);
      });

      input.addEventListener("input", () => {
        this.clearError(input);
      });
    });
  }

  setupValidation() {
    // Ajouter les contraintes de validation
    this.form.setAttribute("novalidate", true);
  }

  async handleSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.setLoading(true);

    try {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);

      // Simulation d'envoi (remplacer par une vraie API)
      await this.sendFormData(data);

      this.showSuccess("Message envoyé avec succès!");
      this.form.reset();
    } catch (error) {
      this.showError("Erreur lors de l'envoi du message");
      console.error("Erreur:", error);
    } finally {
      this.setLoading(false);
    }
  }

  validateForm() {
    let isValid = true;

    this.form
      .querySelectorAll("input[required], textarea[required]")
      .forEach((field) => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Validation basique
    if (field.required && !value) {
      isValid = false;
      errorMessage = "Ce champ est obligatoire";
    } else if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Email invalide";
      }
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    } else {
      this.clearError(field);
    }

    return isValid;
  }

  showError(field, message) {
    this.clearError(field);
    field.classList.add("error");

    const errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  clearError(field) {
    field.classList.remove("error");
    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }
  }

  setLoading(loading) {
    if (this.submitBtn) {
      if (loading) {
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = "Envoi en cours...";
      } else {
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = "Envoyer";
      }
    }
  }

  async sendFormData(data) {
    // Simulation d'appel API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simuler une erreur aléatoire pour le test
        if (Math.random() > 0.2) {
          resolve({ success: true });
        } else {
          reject(new Error("Erreur serveur simulée"));
        }
      }, 1500);
    });
  }

  showSuccess(message) {
    this.showNotification(message, "success");
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Styles de base pour la notification
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            color: white;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

    if (type === "success") {
      notification.style.background = "#10b981";
    } else {
      notification.style.background = "#ef4444";
    }

    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Disparaître après 5 secondes
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
}
