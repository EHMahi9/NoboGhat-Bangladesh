(function () {
    "use strict";

    var sectionSelector = ".hero, .statistics-section, .problem-section, .features-section, .registration-section, .site-footer";
    var cardSelector = ".stat-card, .problem-card, .solution-card, .feature-card, .trip-card, .dashboard-cards .card";
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var observer;

    function setDelay(element, index) {
        element.style.setProperty("--delay", Math.min(index * 80, 480) + "ms");
    }

    function prepare(element, index) {
        if (!element || element.dataset.revealReady === "true") return;
        element.dataset.revealReady = "true";
        setDelay(element, index || 0);

        if (reducedMotion || !("IntersectionObserver" in window)) {
            element.classList.add("reveal-visible");
            return;
        }

        element.classList.add("reveal");
        observer.observe(element);
    }

    function prepareMatches(root) {
        var elements = [];
        if (root.nodeType === 1 && root.matches(sectionSelector + ", " + cardSelector)) elements.push(root);
        if (root.querySelectorAll) {
            elements = elements.concat(Array.prototype.slice.call(root.querySelectorAll(sectionSelector + ", " + cardSelector)));
        }
        elements.forEach(function (element, index) { prepare(element, index); });
    }

    function initialise() {
        if ("IntersectionObserver" in window && !reducedMotion) {
            observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("reveal-visible");
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.15 });
        }

        prepareMatches(document);

        document.querySelectorAll(".hero-content h1, .hero-content p, .hero-content .route-search-form").forEach(function (element, index) {
            element.classList.add("hero-animate");
            element.style.setProperty("--hero-delay", (index * 110) + "ms");
        });

        if ("MutationObserver" in window && !reducedMotion) {
            new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) prepareMatches(node);
                    });
                });
            }).observe(document.body, { childList: true, subtree: true });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialise, { once: true });
    } else {
        initialise();
    }
})();
