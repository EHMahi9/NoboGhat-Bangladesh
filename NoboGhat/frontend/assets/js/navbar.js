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
            // Logged in: show Dashboard link
            authBtn.innerHTML = '<a href="pages/dashboard.html" class="btn-primary">Dashboard</a>';
            // Add logout button next to it
            var logoutBtn = document.createElement("a");
            logoutBtn.href = "#";
            logoutBtn.className = "btn-outline";
            logoutBtn.textContent = "Logout";
            logoutBtn.style.marginLeft = "8px";
            logoutBtn.addEventListener("click", function(e) {
                e.preventDefault();
                localStorage.removeItem("noboghatToken");
                localStorage.removeItem("noboghatRole");
                window.location.href = "index.html";
            });
            authBtn.parentNode.insertBefore(logoutBtn, authBtn.nextSibling);
        } else {
            // Not logged in: show Login and Register
            authBtn.innerHTML = '<a href="pages/login.html" class="btn-primary">Login</a>' +
                '<a href="pages/login.html#register" class="btn-outline" style="margin-left:8px">Register</a>';
        }
    }
});