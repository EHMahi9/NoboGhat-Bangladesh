document.addEventListener("DOMContentLoaded", function() {
    var hamburger = document.querySelector(".hamburger");
    var navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function() {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // Close menu when a nav link is clicked
        var links = navLinks.querySelectorAll("li a");
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function() {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        }
    }

    // Auth-aware navbar: check if user is logged in
    var token = localStorage.getItem("noboghatToken");
    var authBtn = document.querySelector(".auth-btn-nav");
    if (authBtn) {
        if (token) {
            // Logged in: Dashboard + Logout as plain text links
            var linkStyle = "text-decoration:none;color:var(--deep-navy);font-weight:600;font-size:1rem;";
            authBtn.innerHTML = '<a href="pages/dashboard.html" style="' + linkStyle + '">Dashboard</a>' +
                '<a href="#" id="logoutNavLink" style="' + linkStyle + 'margin-left:16px;">Logout</a>';
            var logoutLink = document.getElementById("logoutNavLink");
            if (logoutLink) {
                logoutLink.addEventListener("click", function(e) {
                    e.preventDefault();
                    localStorage.removeItem("noboghatToken");
                    localStorage.removeItem("noboghatRole");
                    window.location.href = "/";
                });
            }
        } else {
            // Not logged in: Login + Register as solid buttons
            authBtn.innerHTML = '<a href="pages/login.html" class="btn btn-primary">Login</a>' +
                '<a href="pages/login.html#register" class="btn btn-primary" style="margin-left:8px">Register</a>';
        }
    }
});
