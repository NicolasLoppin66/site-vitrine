export class Animations {
  constructor() {
    this.observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");

          // Animation spécifique pour les éléments avec data-aos
          if (entry.target.dataset.aos) {
            this.animateOnScroll(entry.target);
          }
        }
      });
    }, this.observerOptions);

    // Observer les éléments à animer
    document
      .querySelectorAll("[data-aos], .service-card, .hero-content > *")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  animateOnScroll(element) {
    const animationType = element.dataset.aos;
    const delay = element.dataset.aosDelay || 0;

    setTimeout(() => {
      element.classList.add(`aos-${animationType}`);
    }, delay);
  }

  setupScrollAnimations() {
    // Animation du header au scroll
    window.addEventListener("scroll", () => {
      const header = document.getElementById("header");
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.backdropFilter = "blur(10px)";
        header.style.boxShadow = "var(--shadow-md)";
      } else {
        header.style.background = "transparent";
        header.style.backdropFilter = "none";
        header.style.boxShadow = "none";
      }
    });
  }
}
