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
  const numero = (CONFIG.whatsapp || "").replace(/\D/g, "");
  document.querySelectorAll("[data-wsp]").forEach(function (a) {
    if (numero) {
      a.href = "https://wa.me/" + numero + "?text=" + encodeURIComponent(CONFIG.mensaje);
      a.target = "_blank";
      a.rel = "noopener";
      a.removeAttribute("data-placeholder");
    } else {
      a.remove(); // sin número cargado, no se muestra
    }
  });

  const usuario = (CONFIG.instagram || "").replace(/^@/, "").trim();
  document.querySelectorAll("[data-instagram]").forEach(function (a) {
    if (usuario) {
      a.href = "https://www.instagram.com/" + usuario + "/";
      a.target = "_blank";
      a.rel = "noopener";
      a.removeAttribute("data-placeholder");
    } else {
      a.remove();
    }
  });
})();


/* ---------- Altura real del header (para scroll y menú móvil) ---------- */
(function () {
  const header = document.querySelector("header");
  if (!header) return;

  function actualizar() {
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }
  actualizar();
  window.addEventListener("resize", actualizar);
  window.addEventListener("orientationchange", actualizar);
  // Recalcula al cargar las fuentes (puede cambiar la altura)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(actualizar);
})();


/* ---------- Imágenes: si falla la carga, se oculta y queda el placeholder ---------- */
(function () {
  document.querySelectorAll("img[data-hide-on-error]").forEach(function (img) {
    function ocultar() { img.remove(); }
    if (img.complete && img.naturalWidth === 0) ocultar();
    else img.addEventListener("error", ocultar);
  });
})();


/* ---------- Menú del celular ---------- */
(function () {
  const header = document.querySelector("header");
  const boton = document.querySelector(".menu-btn");
  if (!header || !boton) return;

  function cambiar(abrir) {
    header.classList.toggle("abierto", abrir);
    boton.setAttribute("aria-expanded", abrir ? "true" : "false");
    boton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("menu-abierto", abrir);
  }

  boton.addEventListener("click", function (e) {
    e.stopPropagation();
    cambiar(!header.classList.contains("abierto"));
  });

  // Cierra al tocar un link
  document.querySelectorAll("nav a").forEach(function (a) {
    a.addEventListener("click", function () { cambiar(false); });
  });

  // Cierra con Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("abierto")) cambiar(false);
  });

  // Cierra al tocar afuera
  document.addEventListener("click", function (e) {
    if (!header.classList.contains("abierto")) return;
    if (!header.contains(e.target)) cambiar(false);
  });

  // Cierra si se pasa a escritorio
  window.addEventListener("resize", function () {
    if (window.innerWidth > 700 && header.classList.contains("abierto")) cambiar(false);
  });

  // Sombra al bajar
  function sombra() { header.classList.toggle("scroll", window.scrollY > 20); }
  window.addEventListener("scroll", sombra, { passive: true });
  sombra();
})();


/* ---------- Link del menú activo según la sección visible ---------- */
(function () {
  const links = document.querySelectorAll("nav a.link");
  if (!("IntersectionObserver" in window) || !links.length) return;

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      const id = "#" + entrada.target.id;
      links.forEach(function (a) {
        const activo = a.getAttribute("href") === id;
        a.classList.toggle("activo", activo);
        if (activo) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  links.forEach(function (a) {
    const href = a.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;
    const seccion = document.querySelector(href);
    if (seccion) observador.observe(seccion);
  });
})();


/* ---------- Tarjetas de yerbas: tocar para abrir (celular) ---------- */
(function () {
  const tarjetas = document.querySelectorAll(".tarjeta");
  if (!tarjetas.length) return;

  function alternar(tarjeta) {
    const abrir = !tarjeta.classList.contains("abierta");
    tarjetas.forEach(function (t) { t.classList.remove("abierta"); });
    tarjeta.classList.toggle("abierta", abrir);
  }

  tarjetas.forEach(function (tarjeta) {
    tarjeta.addEventListener("click", function (e) {
      if (e.target.closest("a")) return; // los enlaces funcionan normal
      alternar(tarjeta);
    });
    tarjeta.addEventListener("keydown", function (e) {
      if (e.target !== tarjeta) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        alternar(tarjeta);
      }
    });
    tarjeta.addEventListener("blur", function (e) {
      if (tarjeta.contains(e.relatedTarget)) return;
      tarjeta.classList.remove("abierta");
    });
  });

  // Cierra al tocar afuera
  document.addEventListener("click", function (e) {
    if (e.target.closest(".tarjeta")) return;
    tarjetas.forEach(function (t) { t.classList.remove("abierta"); });
  });
})();


/* ---------- Año automático en el pie de página ---------- */
(function () {
  const anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();