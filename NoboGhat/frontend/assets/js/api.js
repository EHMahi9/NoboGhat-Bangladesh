(function () {
    "use strict";

    // Local pages call Spring Boot directly. Set apiBaseUrl in config.js after
    // Render creates the production backend URL; this is intentionally the only
    // production API location in the frontend.
    var localHosts = new Set(["localhost", "127.0.0.1"]);
    var isLocal = localHosts.has(window.location.hostname);

    var productionBackend = (window.NoboGhatConfig && window.NoboGhatConfig.apiBaseUrl) || "";

    var apiBaseUrl = isLocal
        ? "http://localhost:8080"
        : productionBackend.replace(/\/$/, "");

    function requireConfiguredBackend() {
        if (!apiBaseUrl) {
            throw new Error("The production API is not configured. Set apiBaseUrl in assets/js/config.js to your Render service URL.");
        }
    }

    window.NoboGhatApi = {
        url: function (path) {
            if (!isLocal) requireConfiguredBackend();
            return apiBaseUrl + path;
        },

        googleLoginUrl: function () {
            if (!isLocal) requireConfiguredBackend();
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
