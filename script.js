const menuToggle = document.querySelector("#menuToggle");
const mobileMenu = document.querySelector("#mobileMenu");
const leadForm = document.querySelector("#leadForm");
const formMessage = document.querySelector("#formMessage");
const siteConfig = window.SITE_CONFIG || {};

document.querySelectorAll("[data-site-brand-name]").forEach((element) => {
  element.textContent = siteConfig.brandName || "Northstar AI";
});

document.querySelectorAll("[data-site-brand-short]").forEach((element) => {
  element.textContent = siteConfig.brandShort || "NA";
});

document.querySelectorAll("[data-site-company-name]").forEach((element) => {
  element.textContent = siteConfig.companyName || "Northstar AI Consulting";
});

document.querySelectorAll("[data-site-tagline]").forEach((element) => {
  element.textContent = siteConfig.tagline || "Build. Optimize. Simulate.";
});

document.querySelectorAll("[data-site-positioning]").forEach((element) => {
  element.textContent = siteConfig.positioning || "We build, optimize, and simulate AI systems to make them profitable.";
});

document.querySelectorAll("[data-site-contact-email]").forEach((element) => {
  element.textContent = siteConfig.contactEmail || "hello@northstarai.consulting";
});

document.querySelectorAll("[data-calendly-link]").forEach((element) => {
  element.setAttribute("href", siteConfig.calendlyUrl || "https://calendly.com/northstarai/consultation");
});

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden", isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function trackEvent(name, payload = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }

  console.info("analytics:event", name, payload);
}

document.querySelectorAll("[data-analytics]").forEach((element) => {
  element.addEventListener("click", () => {
    trackEvent("site_cta_click", { target: element.dataset.analytics });
  });
});

if (leadForm && formMessage) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    trackEvent("lead_form_submit_attempt", { formId: "leadForm" });

    const requiredFields = Array.from(leadForm.querySelectorAll("[required]"));
    let hasErrors = false;

    requiredFields.forEach((field) => {
      const isEmpty = !field.value.trim();
      field.classList.toggle("is-invalid", isEmpty);
      hasErrors ||= isEmpty;
    });

    if (hasErrors) {
      trackEvent("lead_form_submit_error", { formId: "leadForm", reason: "required_fields_missing" });
      formMessage.textContent = "Please complete the required fields so we can follow up with the right recommendation.";
      formMessage.classList.remove("hidden");
      formMessage.classList.remove("border-pine/15", "bg-pine/10", "text-pine");
      formMessage.classList.add("border-ember/20", "bg-ember/10", "text-ember");
      return;
    }

    const formData = Object.fromEntries(new FormData(leadForm).entries());
    trackEvent("lead_form_submit_success", formData);

    formMessage.textContent = "Thanks. Your inquiry was captured successfully and this form is ready to connect to your CRM or preferred form handler.";
    formMessage.classList.remove("hidden");
    formMessage.classList.remove("border-ember/20", "bg-ember/10", "text-ember");
    formMessage.classList.add("border-pine/15", "bg-pine/10", "text-pine");

    leadForm.reset();
    leadForm.querySelectorAll(".is-invalid").forEach((field) => {
      field.classList.remove("is-invalid");
    });
  });
}

const revealItems = document.querySelectorAll(
  ".metric-card, .showcase-card, .service-card, .feature-panel, .use-case-card, .case-card, .pricing-card, .cta-band, .contact-card"
);

revealItems.forEach((item, index) => {
  item.classList.add("reveal");
  item.style.transitionDelay = `${Math.min(index * 60, 320)}ms`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18
});

revealItems.forEach((item) => revealObserver.observe(item));
