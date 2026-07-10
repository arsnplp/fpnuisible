/* FP Solutions Nuisibles — interactions */
(function () {
  "use strict";

  /* Menu mobile */
  var burger = document.querySelector(".burger");
  var mnav = document.getElementById("menu-mobile");
  if (burger && mnav) {
    burger.addEventListener("click", function () {
      var open = mnav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Ombre du header au scroll */
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Apparition au scroll (respecte prefers-reduced-motion) */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ============================================================
     FORMULAIRE DE DEVIS
     ------------------------------------------------------------
     TODO : brancher le vrai endpoint (Formspree, Google Forms,
     Web3Forms, etc.). Remplacer la constante FORM_ENDPOINT
     ci-dessous par l'URL fournie, ex. :
       var FORM_ENDPOINT = "https://formspree.io/f/XXXXXXX";
     Tant que FORM_ENDPOINT est vide, le formulaire affiche la
     confirmation visuelle sans rien envoyer (mode démo).
     ============================================================ */
  var FORM_ENDPOINT = "";

  var form = document.getElementById("form-devis") || document.getElementById("form-contact");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var success = document.getElementById("form-success");
      var done = function () {
        form.style.display = "none";
        if (success) {
          success.classList.add("is-visible");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };
      if (!FORM_ENDPOINT) {
        done(); /* mode démo : aucune donnée envoyée */
        return;
      }
      if (btn) { btn.disabled = true; btn.textContent = "Envoi en cours…"; }
      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (r) {
          if (r.ok) { done(); }
          else { throw new Error("HTTP " + r.status); }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = "Réessayer l'envoi"; }
          alert("L'envoi a échoué. Vous pouvez nous appeler directement au 06 68 03 57 76.");
        });
    });
  }
})();
