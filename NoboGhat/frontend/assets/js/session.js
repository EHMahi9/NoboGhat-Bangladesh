(function () {
    "use strict";

    function signOut() {
        localStorage.removeItem("noboghatToken");
        localStorage.removeItem("noboghatRole");
        window.location.href = "login.html";
    }

    function receiveOAuthToken() {
        var params = new URLSearchParams(window.location.search);
        var token = params.get("token");
        if (!token) return;
        localStorage.setItem("noboghatToken", token);
        localStorage.setItem("noboghatRole", params.get("role") || "FARMER");
        history.replaceState({}, document.title, window.location.pathname);
    }

    document.addEventListener("DOMContentLoaded", function () {
        receiveOAuthToken();
        var page = document.body;
        var token = localStorage.getItem("noboghatToken");
        var role = localStorage.getItem("noboghatRole");

        if (page.dataset.requiresAuth === "true" && !token) {
            window.location.replace("login.html");
            return;
        }
        if (page.dataset.requiresAdmin === "true" && role !== "ADMIN") {
            window.location.replace("dashboard.html");
            return;
        }

        document.querySelectorAll("[data-action='logout']").forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                signOut();
            });
        });
    });

    window.NoboGhatSession = { signOut: signOut };
})();
