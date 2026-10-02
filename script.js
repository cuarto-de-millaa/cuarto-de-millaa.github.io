/* =========================================================
   CONFIGURACIÓN: acá editás tus datos (solo esta parte)
   ========================================================= */
const CONFIG = {
  // Número de WhatsApp: 54 + 9 + código de área (sin 0) + número.
  // Todo junto, sin espacios, sin + y sin guiones.
  // Ejemplo: "5493764123456". Si lo dejás vacío "", el botón se oculta.
  whatsapp: "",

  // Mensaje que aparece escrito cuando alguien toca el botón
  mensaje: "¡Hola! Quiero consultar por la yerba Cuarto de Milla.",

  // Usuario de Instagram, sin @. Si lo dejás vacío "", el botón se oculta.
  instagram: "yerbamateherenciaguarani",
};
/* ========================================================= */


/* ---------- WhatsApp e Instagram ---------- */
(function () {
  const numero = CONFIG.whatsapp.replace(/\D/g, "");
  document.querySelectorAll("[data-wsp]").forEach(function (a) {
    if (numero) {
      a.href = "https://wa.me/" + numero + "?text=" + encodeURIComponent(CONFIG.mensaje);
    } else {
      a.style.display = "none"; // sin número cargado, no se muestra
    }
  });

  const usuario = CONFIG.instagram.replace(/^@/, "").trim();
  document.querySelectorAll("[data-instagram]").forEach(function (a) {
    if (usuario) {
      a.href = "https://www.instagram.com/" + usuario + "/";
    } else {
      a.style.display = "none";
    }
  });
})();


/* ---------- Menú del celular ---------- */
(function () {
  const header = document.querySelector("header");
  const boton = document.querySelector(".menu-btn");
  if (!header || !boton) return;

  function cambiar(abrir) {
    header.classList.toggle("abierto", abrir);
    boton.setAttribute("aria-expanded", abrir);
    boton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
  }

  boton.addEventListener("click", function () {
    cambiar(!header.classList.contains("abierto"));
  });
  // Se cierra al tocar un link o al apretar Escape
  document.querySelectorAll("nav a").forEach(function (a) {
    a.addEventListener("click", function () { cambiar(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") cambiar(false);
  });

  // Sombra en el menú cuando bajás
  function sombra() { header.classList.toggle("scroll", window.scrollY > 20); }
  window.addEventListener("scroll", sombra, { passive: true });
  sombra();
})();


/* ---------- Link del menú activo según la sección ---------- */
(function () {
  const links = document.querySelectorAll("nav a.link");
  if (!("IntersectionObserver" in window) || !links.length) return;

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      links.forEach(function (a) {
        a.classList.toggle("activo", a.getAttribute("href") === "#" + entrada.target.id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  links.forEach(function (a) {
    const seccion = document.querySelector(a.getAttribute("href"));
    if (seccion) observador.observe(seccion);
  });
})();


/* ---------- Tarjetas de yerbas: tocar para abrir (celular) ---------- */
(function () {
  const tarjetas = document.querySelectorAll(".tarjeta");

  function alternar(tarjeta) {
    const abrir = !tarjeta.classList.contains("abierta");
    tarjetas.forEach(function (t) { t.classList.remove("abierta"); });
    tarjeta.classList.toggle("abierta", abrir);
  }

  tarjetas.forEach(function (tarjeta) {
    tarjeta.addEventListener("click", function (e) {
      if (e.target.closest("a")) return; // el botón Comprar funciona normal
      alternar(tarjeta);
    });
    tarjeta.addEventListener("keydown", function (e) {
      if (e.target !== tarjeta) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        alternar(tarjeta);
      }
    });
  });
})();


/* ---------- Año automático en el pie de página ---------- */
(function () {
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();
