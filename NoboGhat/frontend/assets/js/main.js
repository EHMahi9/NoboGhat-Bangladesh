document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => navLinks.classList.toggle("active"));
  }

  const routeSearchForm = document.querySelector(".route-search-form");
  if (routeSearchForm) {
    routeSearchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const source = document.getElementById("source").value.trim();
      const destination = document.getElementById("destination").value.trim();
      const query = new URLSearchParams({ source, destination });
      window.location.href = `pages/routes.html?${query}`;
    });
  }

  const registrationForm = document.getElementById("registrationForm");
  if (!registrationForm) return;

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = registrationForm.querySelector('button[type="submit"]');
    const payload = {
      name: document.getElementById("regName").value.trim(),
      phone: document.getElementById("regPhone").value.trim(),
      role: document.getElementById("regRole").value
    };

    submitButton.disabled = true;
    submitButton.textContent = "Registering...";
    try {
      const response = await fetch(window.NoboGhatApi.url("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed.");
      alert(`Registration completed. Your user ID is ${data.userId}.`);
      registrationForm.reset();
    } catch (error) {
      alert(error.message || "Could not reach the server. Please try again.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Register";
    }
  });
});
