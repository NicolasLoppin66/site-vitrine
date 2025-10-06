import {
  servicesData,
  portfolioData,
  teamData,
  testimonialsData,
} from "../data/content.js";

export class ContentManager {
  constructor() {
    this.servicesGrid = document.getElementById("servicesGrid");
    this.portfolioGrid = document.getElementById("portfolioGrid");
    this.teamGrid = document.getElementById("teamGrid");
    this.testimonialsGrid = document.getElementById("testimonialsGrid");
  }

  init() {
    this.loadServices();
    this.loadPortfolio();
    this.loadTeam();
    this.loadTestimonials();
  }

  // Charger les services
  loadServices() {
    if (!this.servicesGrid) return;

    const servicesHTML = servicesData
      .map(
        (service, index) => `
            <div class="service-card" data-aos="fade-up" data-aos-delay="${
              index * 100
            }">
                <div class="service-icon">${service.icon}</div>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description}</p>
                
                ${
                  service.features
                    ? `
                    <ul class="service-features">
                        ${service.features
                          .map((feature) => `<li>${feature}</li>`)
                          .join("")}
                    </ul>
                `
                    : ""
                }
                
                ${
                  service.cta
                    ? `
                    <button class="service-cta" data-service="${service.id}">
                        ${service.cta}
                    </button>
                `
                    : ""
                }
            </div>
        `
      )
      .join("");

    this.servicesGrid.innerHTML = servicesHTML;
    this.bindServiceEvents();
  }

  // Charger le portfolio
  loadPortfolio() {
    if (!this.portfolioGrid) return;

    const portfolioHTML = portfolioData
      .map(
        (project, index) => `
            <div class="portfolio-item" data-aos="zoom-in" data-aos-delay="${
              index * 100
            }">
                <div class="portfolio-image">
                    <img src="${project.image}" alt="${
          project.title
        }" loading="lazy">
                    <div class="portfolio-overlay">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <span class="portfolio-category">${
                          project.category
                        }</span>
                        
                        ${
                          project.technologies
                            ? `
                            <div class="portfolio-technologies">
                                ${project.technologies
                                  .map(
                                    (tech) =>
                                      `<span class="tech-tag">${tech}</span>`
                                  )
                                  .join("")}
                            </div>
                        `
                            : ""
                        }
                        
                        <a href="${
                          project.link
                        }" class="portfolio-link">Voir le projet</a>
                    </div>
                </div>
            </div>
        `
      )
      .join("");

    this.portfolioGrid.innerHTML = portfolioHTML;
  }

  // Charger l'équipe
  loadTeam() {
    if (!this.teamGrid) return;

    const teamHTML = teamData
      .map(
        (member, index) => `
            <div class="team-member" data-aos="fade-up" data-aos-delay="${
              index * 100
            }">
                <div class="member-image">
                    <img src="${member.image}" alt="${member.name}">
                    <div class="member-social">
                        ${Object.entries(member.social)
                          .map(
                            ([platform, link]) => `
                            <a href="${link}" class="social-link ${platform}" target="_blank">
                                <i class="icon-${platform}"></i>
                            </a>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                <div class="member-info">
                    <h3 class="member-name">${member.name}</h3>
                    <p class="member-role">${member.role}</p>
                    <p class="member-bio">${member.bio}</p>
                </div>
            </div>
        `
      )
      .join("");

    this.teamGrid.innerHTML = teamHTML;
  }

  // Charger les témoignages
  loadTestimonials() {
    if (!this.testimonialsGrid) return;

    const testimonialsHTML = testimonialsData
      .map(
        (testimonial, index) => `
            <div class="testimonial-card" data-aos="fade-up" data-aos-delay="${
              index * 100
            }">
                <div class="testimonial-content">
                    <div class="testimonial-text">"${testimonial.text}"</div>
                    <div class="testimonial-rating">
                        ${"★".repeat(testimonial.rating)}${"☆".repeat(
          5 - testimonial.rating
        )}
                    </div>
                </div>
                <div class="testimonial-author">
                    <img src="${testimonial.image}" alt="${
          testimonial.name
        }" class="author-image">
                    <div class="author-info">
                        <h4 class="author-name">${testimonial.name}</h4>
                        <p class="author-company">${testimonial.company}</p>
                    </div>
                </div>
            </div>
        `
      )
      .join("");

    this.testimonialsGrid.innerHTML = testimonialsHTML;
  }

  // Événements pour les services
  bindServiceEvents() {
    document.querySelectorAll(".service-cta").forEach((button) => {
      button.addEventListener("click", (e) => {
        const serviceId = e.target.dataset.service;
        this.handleServiceClick(serviceId);
      });
    });
  }

  handleServiceClick(serviceId) {
    const service = servicesData.find((s) => s.id == serviceId);
    if (service) {
      // Ouvrir une modal ou rediriger
      console.log("Service cliqué:", service.title);
      // this.openServiceModal(service);
    }
  }

  // Méthode pour filtrer le portfolio
  filterPortfolio(category) {
    const filteredProjects =
      category === "all"
        ? portfolioData
        : portfolioData.filter((project) => project.category === category);

    this.renderFilteredPortfolio(filteredProjects);
  }

  renderFilteredPortfolio(projects) {
    const portfolioHTML = projects
      .map(
        (project, index) => `
            <div class="portfolio-item" data-aos="zoom-in" data-aos-delay="${
              index * 100
            }">
                <!-- Même structure que loadPortfolio -->
            </div>
        `
      )
      .join("");

    this.portfolioGrid.innerHTML = portfolioHTML;
  }
}
