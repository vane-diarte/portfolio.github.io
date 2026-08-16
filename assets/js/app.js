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

	// Solo los enlaces internos (#seccion) apuntan a una sección de ESTA página.
	// En las páginas de proyecto los enlaces son "../index.html#seccion", que no
	// es un selector válido y haría fallar a querySelector.
	var navLinks = Array.prototype.slice
		.call(document.querySelectorAll(".nav__links a"))
		.filter(function (link) {
			return (link.getAttribute("href") || "").charAt(0) === "#";
		});

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

	/* ---------- Carruseles infinitos ----------
	   La animación desplaza la pista un 50%. Para que el salto sea invisible,
	   la pista debe contener dos mitades idénticas y ser más ancha que su
	   contenedor: primero repetimos los ítems hasta cubrir el ancho visible
	   y recién después duplicamos todo. */

	function buildLoop(track) {
		var viewport = track.parentElement;
		if (!track || !viewport) return;

		var originals = Array.prototype.slice.call(track.children);
		if (!originals.length) return;

		function cloneInto(nodes) {
			nodes.forEach(function (node) {
				var clone = node.cloneNode(true);
				clone.setAttribute("aria-hidden", "true");
				// Dentro de una pista animada, loading="lazy" puede no dispararse
				// nunca y dejar huecos: los clones se cargan siempre.
				Array.prototype.forEach.call(clone.querySelectorAll("img"), function (img) {
					img.loading = "eager";
				});
				track.appendChild(clone);
			});
		}

		// Repetimos hasta que una mitad tape el ancho del contenedor.
		// El tope de 20 vueltas evita cualquier bucle infinito accidental.
		var guard = 0;
		while (track.scrollWidth < viewport.clientWidth * 1.15 && guard < 20) {
			cloneInto(originals);
			guard += 1;
		}

		// Segunda mitad: exactamente lo mismo que la primera.
		cloneInto(Array.prototype.slice.call(track.children));
	}

	Array.prototype.forEach.call(document.querySelectorAll("[data-loop]"), buildLoop);

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

	/* ---------- Metodología: pestañas del proceso ----------
	   Los arcos del círculo hacen lo mismo que las pestañas: son un atajo
	   visual, no un control aparte. */

	var methodTabs = Array.prototype.slice.call(document.querySelectorAll(".method__tab"));

	if (methodTabs.length) {
		var methodRings = Array.prototype.slice.call(document.querySelectorAll("[data-ring]"));
		var methodNodes = Array.prototype.slice.call(document.querySelectorAll("[data-node]"));

		function selectPhase(index, moveFocus) {
			methodTabs.forEach(function (tab, i) {
				var on = i === index;
				tab.setAttribute("aria-selected", String(on));
				tab.tabIndex = on ? 0 : -1;
				document.getElementById(tab.getAttribute("aria-controls")).hidden = !on;
			});

			methodRings.forEach(function (ring, i) {
				ring.classList.toggle("is-active", i === index);
			});

			methodNodes.forEach(function (node, i) {
				node.classList.toggle("is-active", i === index);
			});

			if (moveFocus) methodTabs[index].focus();
		}

		methodTabs.forEach(function (tab, i) {
			tab.addEventListener("click", function () {
				selectPhase(i, false);
			});

			tab.addEventListener("keydown", function (e) {
				var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
				if (dir) {
					e.preventDefault();
					selectPhase((i + dir + methodTabs.length) % methodTabs.length, true);
				} else if (e.key === "Home") {
					e.preventDefault();
					selectPhase(0, true);
				} else if (e.key === "End") {
					e.preventDefault();
					selectPhase(methodTabs.length - 1, true);
				}
			});
		});

		methodRings.concat(methodNodes).forEach(function (el) {
			el.addEventListener("click", function () {
				var n = el.getAttribute("data-ring") || el.getAttribute("data-node");
				selectPhase(parseInt(n, 10) - 1, false);
			});
		});

		selectPhase(0, false);
	}

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
