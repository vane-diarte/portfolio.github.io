/* =========================================================
   Vanessa Diarte — Portfolio · interacciones
   Sin dependencias externas.
   ========================================================= */

(function () {
	"use strict";

	var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	/* ---------- Tema claro / oscuro ---------- */

	var themeToggle = document.getElementById("theme-toggle");

	if (themeToggle) {
		themeToggle.addEventListener("click", function () {
			var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
			document.documentElement.dataset.theme = next;

			var meta = document.querySelector('meta[name="theme-color"]');
			if (meta) meta.setAttribute("content", next === "dark" ? "#0a0b0d" : "#f6f5f3");

			try {
				localStorage.setItem("vd-theme", next);
			} catch (e) {}
		});
	}

	/* ---------- Nav: sombra al hacer scroll + menú móvil ---------- */

	var nav = document.getElementById("nav");
	var burger = document.getElementById("nav-burger");
	var drawer = document.getElementById("nav-drawer");

	function onScroll() {
		if (nav) nav.classList.toggle("is-stuck", window.scrollY > 12);
	}

	window.addEventListener("scroll", onScroll, { passive: true });
	onScroll();

	function closeDrawer() {
		if (!nav) return;
		nav.classList.remove("is-open");
		if (burger) burger.setAttribute("aria-expanded", "false");
	}

	if (burger && nav) {
		burger.addEventListener("click", function () {
			var open = nav.classList.toggle("is-open");
			burger.setAttribute("aria-expanded", String(open));
		});
	}

	if (drawer) {
		drawer.addEventListener("click", function (e) {
			if (e.target.closest("a")) closeDrawer();
		});
	}

	document.addEventListener("click", function (e) {
		if (nav && nav.classList.contains("is-open") && !e.target.closest("#nav")) closeDrawer();
	});

	/* ---------- Reveal al entrar en viewport ---------- */

	var revealables = document.querySelectorAll(".reveal");

	if (!("IntersectionObserver" in window) || reduceMotion) {
		revealables.forEach(function (el) {
			el.classList.add("is-visible");
		});
	} else {
		var revealObserver = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					entry.target.classList.add("is-visible");
					revealObserver.unobserve(entry.target);
				});
			},
			{ rootMargin: "0px 0px -12% 0px", threshold: 0.1 }
		);

		revealables.forEach(function (el) {
			revealObserver.observe(el);
		});
	}

	/* ---------- Link activo según la sección visible ---------- */

	var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
	var sections = navLinks
		.map(function (link) {
			return document.querySelector(link.getAttribute("href"));
		})
		.filter(Boolean);

	if ("IntersectionObserver" in window && sections.length) {
		var sectionObserver = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					navLinks.forEach(function (link) {
						link.classList.toggle(
							"is-active",
							link.getAttribute("href") === "#" + entry.target.id
						);
					});
				});
			},
			{ rootMargin: "-40% 0px -45% 0px" }
		);

		sections.forEach(function (section) {
			sectionObserver.observe(section);
		});
	}

	/* ---------- Marquee infinito ---------- */

	var track = document.getElementById("marquee-track");

	if (track) {
		var originals = Array.prototype.slice.call(track.children);
		originals.forEach(function (node) {
			var clone = node.cloneNode(true);
			clone.setAttribute("aria-hidden", "true");
			track.appendChild(clone);
		});
	}

	/* ---------- Rotador de roles ---------- */

	var roles = document.getElementById("roles");

	if (roles && !reduceMotion) {
		var items = roles.children.length;
		var index = 0;

		setInterval(function () {
			index += 1;
			roles.style.transition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)";
			roles.style.transform = "translateY(" + -index * 1.4 + "em)";

			// El último elemento repite al primero: al llegar, volvemos sin animación.
			if (index === items - 1) {
				window.setTimeout(function () {
					roles.style.transition = "none";
					roles.style.transform = "translateY(0)";
					index = 0;
				}, 720);
			}
		}, 2600);
	}

	/* ---------- Lightbox de imágenes ---------- */

	var lightbox = document.getElementById("lightbox");
	var lightboxImg = document.getElementById("lightbox-img");
	var lightboxCaption = document.getElementById("lightbox-caption");
	var lightboxClose = document.getElementById("lightbox-close");
	var lastFocused = null;

	function openLightbox(src, caption) {
		if (!lightbox) return;
		lastFocused = document.activeElement;
		lightboxImg.src = src;
		lightboxImg.alt = caption || "";
		lightboxCaption.textContent = caption || "";
		lightbox.classList.add("is-open");
		document.body.style.overflow = "hidden";
		lightboxClose.focus();
	}

	function closeLightbox() {
		if (!lightbox) return;
		lightbox.classList.remove("is-open");
		document.body.style.overflow = "";
		if (lastFocused) lastFocused.focus();
	}

	document.querySelectorAll("[data-full]").forEach(function (el) {
		el.addEventListener("click", function () {
			openLightbox(el.getAttribute("data-full"), el.getAttribute("data-caption"));
		});
	});

	if (lightbox) {
		lightbox.addEventListener("click", function (e) {
			if (e.target === lightbox || e.target.closest("#lightbox-close")) closeLightbox();
		});
	}

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") {
			closeLightbox();
			closeDrawer();
		}
	});

	/* ---------- Copiar correo ---------- */

	var copyBtn = document.getElementById("copy-email");

	if (copyBtn) {
		copyBtn.addEventListener("click", function () {
			var email = copyBtn.getAttribute("data-email");
			var label = copyBtn.querySelector("[data-copy-label]");

			function done() {
				copyBtn.classList.add("is-copied");
				label.textContent = "¡Copiado!";
				window.setTimeout(function () {
					copyBtn.classList.remove("is-copied");
					label.textContent = "Copiar correo";
				}, 2000);
			}

			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(email).then(done).catch(fallback);
			} else {
				fallback();
			}

			function fallback() {
				var input = document.createElement("input");
				input.value = email;
				document.body.appendChild(input);
				input.select();
				try {
					document.execCommand("copy");
					done();
				} catch (e) {
					window.location.href = "mailto:" + email;
				}
				document.body.removeChild(input);
			}
		});
	}

	/* ---------- Glow que sigue al puntero ---------- */

	var glow1 = document.querySelector(".fx__glow--1");
	var glow2 = document.querySelector(".fx__glow--2");

	if (glow1 && glow2 && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
		window.addEventListener(
			"pointermove",
			function (e) {
				var x = (e.clientX / window.innerWidth - 0.5) * 2;
				var y = (e.clientY / window.innerHeight - 0.5) * 2;
				glow1.style.transform = "translate(" + x * 36 + "px," + y * 36 + "px)";
				glow2.style.transform = "translate(" + x * -30 + "px," + y * -30 + "px)";
			},
			{ passive: true }
		);
	}

	/* ---------- Año en el footer ---------- */

	var year = document.getElementById("year");
	if (year) year.textContent = String(new Date().getFullYear());
})();
