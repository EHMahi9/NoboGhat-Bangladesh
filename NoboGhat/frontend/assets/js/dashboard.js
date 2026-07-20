document.addEventListener("DOMContentLoaded", async function () {
    var api = window.NoboGhatApi;
    try {
        var response = await fetch(api.url("/api/users/profile"), { headers: api.authHeaders() });
        if (!response.ok) throw new Error("Your session has expired. Please sign in again.");
        var user = await response.json();
        document.querySelectorAll("[data-user-name]").forEach(function (element) { element.textContent = user.name; });
        var role = document.querySelector("[data-user-role]");
        if (role) role.textContent = user.role.replace("_", " ");
    } catch (error) {
        localStorage.removeItem("noboghatToken");
        localStorage.removeItem("noboghatRole");
        window.location.replace("login.html?message=" + encodeURIComponent(error.message));
    }
});
