(function () {
    "use strict";

    // Local pages call Spring Boot directly; deployed pages call Vercel's /api proxy.
    var localHosts = new Set(["localhost", "127.0.0.1"]);
    var apiBaseUrl = localHosts.has(window.location.hostname) ? "http://localhost:8080" : "";

    window.NoboGhatApi = {
        url: function (path) {
            return apiBaseUrl + path;
        },

        authHeaders: function () {
            var token = localStorage.getItem("noboghatToken");
            return token ? { "Authorization": "Bearer " + token } : {};
        }
    };
})();
