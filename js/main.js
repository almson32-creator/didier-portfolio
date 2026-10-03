"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation-principale");
const navigationLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const currentYear = document.querySelector("#current-year");
const siteHeader = document.querySelector(".site-header");

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  navigation.classList.toggle("is-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    menuToggle.getAttribute("aria-expanded") === "true" &&
    !navigation.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});

function updateActiveNavigation() {
  const activationPoint = window.scrollY + siteHeader.offsetHeight + 140;
  const activeSection = sections.reduce(
    (current, section) => (section.offsetTop <= activationPoint ? section : current),
    sections[0],
  );

  navigationLinks.forEach((link) => {
    if (link.hash === `#${activeSection.id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

let scrollUpdatePending = false;
window.addEventListener(
  "scroll",
  () => {
    if (scrollUpdatePending) {
      return;
    }

    scrollUpdatePending = true;
    window.requestAnimationFrame(() => {
      updateActiveNavigation();
      scrollUpdatePending = false;
    });
  },
  { passive: true },
);

updateActiveNavigation();
currentYear.textContent = String(new Date().getFullYear());
