document.addEventListener("DOMContentLoaded", function() {
    var hamburger = document.querySelector(".hamburger");
    var navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function() {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
            hamburger.setAttribute("aria-expanded", navLinks.classList.contains("active"));
        });

        // Close menu when a nav link is clicked
        var links = navLinks.querySelectorAll("li a");
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function() {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        }

        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape") {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Auth-aware navbar: check if user is logged in
    var token = localStorage.getItem("noboghatToken");
    var authBtn = document.querySelector(".auth-btn-nav");
    if (!authBtn) return;

    // Space the two auth buttons so they never touch each other
    authBtn.style.display = "flex";
    authBtn.style.alignItems = "center";
    authBtn.style.gap = "10px";

    // Fix routing: pages inside /pages/ need sibling-relative links,
    // while root pages (index.html) need the pages/ prefix.
    var isInPagesFolder = window.location.pathname.indexOf("/pages/") !== -1;
    var basePath = isInPagesFolder ? "" : "pages/";
    var homePath = isInPagesFolder ? "../index.html" : "index.html";

    if (token) {
        // Logged in: Dashboard + Logout as plain text links
        authBtn.innerHTML =
            '<a href="' + basePath + 'dashboard.html" class="nav-auth-link">Dashboard</a>' +
            '<a href="#" id="logoutNavLink" class="nav-auth-link">Logout</a>';

        var logoutLink = document.getElementById("logoutNavLink");
        if (logoutLink) {
            logoutLink.addEventListener("click", function(e) {
                e.preventDefault();
                localStorage.removeItem("noboghatToken");
                localStorage.removeItem("noboghatRole");
                window.location.href = homePath;
            });
        }
    } else {
        // Not logged in: single "Join NoboGhat" CTA that opens the register tab.
        authBtn.innerHTML =
            '<a href="' + basePath + 'login.html#register" class="nav-auth-btn btn-primary">' +
            '<i class="fa-solid fa-user-plus" style="margin-right:8px;"></i>Join NoboGhat</a>';
    }
});

