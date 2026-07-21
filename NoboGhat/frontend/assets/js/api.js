(function () {
    "use strict";

    // Local pages call Spring Boot directly; deployed pages call the Railway backend.
    var localHosts = new Set(["localhost", "127.0.0.1"]);
    var isLocal = localHosts.has(window.location.hostname);

    // In production on Railway, the backend is at this fixed URL.
    // If you rename the Railway service, update this value.
    var productionBackend = "https://desktop-and-web-programming-lab-project-production.up.railway.app";

    var apiBaseUrl = isLocal
        ? "http://localhost:8080"
        : productionBackend;

    window.NoboGhatApi = {
        url: function (path) {
            return apiBaseUrl + path;
        },

        googleLoginUrl: function () {
            return apiBaseUrl + "/oauth2/authorization/google";
        },

        authHeaders: function () {
            var token = localStorage.getItem("noboghatToken");
            return token
                ? { "Authorization": "Bearer " + token }
                : {};
        }
    };
})();