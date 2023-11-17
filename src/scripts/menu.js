document.addEventListener("astro:page-load", () => {
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".mobile-nav-links").classList.toggle("expanded");
  });
});
