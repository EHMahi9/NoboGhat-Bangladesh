document.addEventListener("DOMContentLoaded", function() {
  // Route Search Form Logic
  var routeSearchForm = document.querySelector(".route-search-form");
  if (routeSearchForm) {
    routeSearchForm.addEventListener("submit", function(event) {
      event.preventDefault();
      var source = document.getElementById("source").value.trim();
      var destination = document.getElementById("destination").value.trim();
      if (source && destination) {
        var query = new URLSearchParams({ source: source, destination: destination });
        window.location.href = "pages/routes.html?" + query.toString();
      }
    });
  }

  // Registration Form on Index Page (index.html section)
  var registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", async function(event) {
      event.preventDefault();
      var submitButton = registrationForm.querySelector('button[type="submit"]');
      var payload = {
        name: document.getElementById("regName").value.trim(),
        phone: document.getElementById("regPhone").value.trim(),
        role: document.getElementById("regRole").value,
        password: document.getElementById("regPassword") ? document.getElementById("regPassword").value.trim() : ""
      };

      submitButton.disabled = true;
      submitButton.textContent = "Registering...";
      try {
        var api = window.NoboGhatApi;
        var url = api ? api.url("/api/auth/register") : "/api/auth/register";
        var response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        var data;
        try { data = await response.json(); } catch (parseError) {
          data = { message: "The server returned an invalid response. Check that the backend is running." };
        }
        if (!response.ok) throw new Error(data.message || "Registration failed.");
        alert("Registration completed. Your user ID is " + data.userId + ".");
        registrationForm.reset();
      } catch (error) {
        alert(error.message || "Could not reach the server. Please try again.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Register";
      }
    });
  }
});
