(function () {
    "use strict";

    // Local pages call Spring Boot directly; deployed pages call the Render backend.
    var localHosts = new Set(["localhost", "127.0.0.1"]);
    var isLocal = localHosts.has(window.location.hostname);

    // In production on Render, the backend is at this fixed URL.
    // If you rename the Render service, update this value.
    var productionBackend = "https://noboghat-backend.onrender.com";

    var apiBaseUrl = isLocal ? "http://localhost:8080" : productionBackend;

    window.NoboGhatApi = {
        url: function (path) {
            return apiBaseUrl + path;
        },

        googleLoginUrl: function () {
            // Google OAuth2 redirect must go through the backend (port 8080 locally,
            // the Render backend in production).
            return isLocal
                ? apiBaseUrl + "/oauth2/authorization/google"
                : apiBaseUrl + "/oauth2/authorization/google";
        },

        authHeaders: function () {
            var token = localStorage.getItem("noboghatToken");
            return token ? { "Authorization": "Bearer " + token } : {};
        }
    };
})();
