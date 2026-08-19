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

    // Override global fetch to automatically handle credentials and 401 refreshes.
    // A semaphore prevents concurrent refresh attempts from creating a loop.
    var isRefreshing = false;
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

        var response;
        try {
            response = await originalFetch.apply(window, args);
        } catch (networkErr) {
            // Network-level error (backend unreachable, CORS crash, etc.).
            // Don't attempt a refresh; just let the caller handle it.
            throw networkErr;
        }

        // If unauthorized and we're not already trying to refresh or on an auth endpoint
        if (
            response.status === 401 &&
            typeof url === 'string' &&
            url.startsWith(apiBaseUrl) &&
            !url.includes("/api/auth/") &&
            !isRefreshing
        ) {
            isRefreshing = true;
            try {
                // Attempt to refresh the token using the HttpOnly cookie
                var refreshResponse = await originalFetch(apiBaseUrl + "/api/auth/refresh", {
                    method: "POST",
                    credentials: "include"
                });

                if (refreshResponse.ok) {
                    var data = await refreshResponse.json();
                    if (data.token) {
                        localStorage.setItem("noboghatToken", data.token);
                        if (data.role) localStorage.setItem("noboghatRole", data.role);
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
                    // Refresh failed — clear ALL session state and redirect to login
                    localStorage.removeItem("noboghatToken");
                    localStorage.removeItem("noboghatRole");
                    localStorage.removeItem("noboghatUser");
                    var currentPath = window.location.pathname;
                    var isLoginPage = currentPath.endsWith("login.html") ||
                        currentPath.endsWith("index.html") ||
                        currentPath === "/";
                    if (!isLoginPage) {
                        window.location.replace("login.html?expired=true");
                    }
                }
            } finally {
                isRefreshing = false;
            }
        }
        return response;
    };
})();
