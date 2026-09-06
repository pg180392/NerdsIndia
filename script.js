
const service = document.getElementById("service");
const selectedLinks = document.querySelectorAll("[data-service]");
const startBooking = document.getElementById("startBooking");

selectedLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (!service) return;
    service.value = link.dataset.service;
  });
});

if (startBooking) {
  startBooking.addEventListener("click", () => {
    const chosen = service ? service.value : "";
    const url = chosen ? `book.html?service=${encodeURIComponent(chosen)}` : "book.html";
    window.location.href = url;
  });
}

/* Mobile navigation */
const menu = document.querySelector(".menu");
const mainNav = document.querySelector(".main-nav");

if (menu && mainNav) {
  menu.addEventListener("click", () => {
    const open = mainNav.classList.toggle("mobile-open");
    menu.setAttribute("aria-expanded", String(open));
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("mobile-open");
      menu.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", event => {
    if (!mainNav.contains(event.target) && !menu.contains(event.target)) {
      mainNav.classList.remove("mobile-open");
      menu.setAttribute("aria-expanded", "false");
    }
  });
}
