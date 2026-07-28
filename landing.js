"use strict";

const revealItems = document.querySelectorAll(".step, .template-card, .principles-copy");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => observer.observe(item));

const sealTrigger = document.querySelector(".seal-trigger");
const heroVisual = document.querySelector(".hero-visual");

sealTrigger?.addEventListener("click", () => {
  const nextPressed = sealTrigger.getAttribute("aria-pressed") !== "true";
  sealTrigger.setAttribute("aria-pressed", String(nextPressed));
  document.body.classList.toggle("is-activated", nextPressed);
  heroVisual?.classList.toggle("is-awake", nextPressed);
  sealTrigger.querySelector("small").textContent = nextPressed ? "画布已唤醒" : "钤印唤醒";
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
