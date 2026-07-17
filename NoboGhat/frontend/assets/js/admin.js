async function loadDashboard() {
  const errorMessage = document.getElementById("dashboardError");
  try {
    const response = await fetch(window.NoboGhatApi.url("/api/admin/dashboard"));
    if (!response.ok) throw new Error("Dashboard data could not be loaded.");
    const data = await response.json();
    document.getElementById("totalUsers").textContent = data.totalUsers;
    document.getElementById("totalBoats").textContent = data.totalBoats;
    document.getElementById("totalBookings").textContent = data.totalBookings;
    document.getElementById("totalCargoWeight").textContent = `${data.totalCargoWeight} kg`;
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.hidden = false;
  }
}

loadDashboard();
