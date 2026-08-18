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

    // Override global fetch to automatically handle credentials and 401 refreshes
    var originalFetch = window.fetch;
    window.fetch = async function () {
        var args = Array.prototype.slice.call(arguments);
        var url = args[0];
        var options = args[1] || {};
        
        // Ensure credentials are sent for our API calls so cookies are included
        if (typeof url === 'string' && url.startsWith(apiBaseUrl)) {
            options.credentials = "include";
        }
        args[1] = options;

        var response = await originalFetch.apply(window, args);

        // If unauthorized and we're not already trying to refresh or login
        if (response.status === 401 && typeof url === 'string' && url.startsWith(apiBaseUrl) && !url.includes("/api/auth/")) {
            // Attempt to refresh the token using the HttpOnly cookie
            var refreshResponse = await originalFetch(apiBaseUrl + "/api/auth/refresh", {
                method: "POST",
                credentials: "include"
            });

            if (refreshResponse.ok) {
                var data = await refreshResponse.json();
                if (data.token) {
                    localStorage.setItem("noboghatToken", data.token);
                    // Update Authorization header and retry original request
                    if (options.headers && options.headers["Authorization"]) {
                        options.headers["Authorization"] = "Bearer " + data.token;
                    } else if (options.headers instanceof Headers && options.headers.has("Authorization")) {
                        options.headers.set("Authorization", "Bearer " + data.token);
                    }
                    args[1] = options;
                    return originalFetch.apply(window, args);
                }
            } else {
                // Refresh failed, clear session and redirect to login
                localStorage.removeItem("noboghatToken");
                localStorage.removeItem("noboghatUser");
                if (!window.location.pathname.endsWith("login.html") && !window.location.pathname.endsWith("index.html") && window.location.pathname !== "/") {
                    window.location.href = "login.html?expired=true";
                }
            }
        }
        return response;
    };
})();
