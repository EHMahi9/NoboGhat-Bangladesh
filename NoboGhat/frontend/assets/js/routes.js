async function loadTrips() {
  const results = document.getElementById("tripResults");
  const errorMessage = document.getElementById("routesError");
  const params = new URLSearchParams(window.location.search);
  const source = (params.get("source") || "").toLowerCase();
  const destination = (params.get("destination") || "").toLowerCase();

  try {
    const response = await fetch(window.NoboGhatApi.url("/api/trips"));
    if (!response.ok) throw new Error("Trips could not be loaded.");
    const trips = await response.json();
    const matches = trips.filter((trip) => {
      const route = trip.route || {};
      return route.source?.toLowerCase().includes(source) && route.destination?.toLowerCase().includes(destination);
    });
    results.innerHTML = matches.length
      ? matches.map((trip) => `<article class="trip-card"><h2>${escapeHtml(trip.route.source)} → ${escapeHtml(trip.route.destination)}</h2><p>Boat: ${escapeHtml(trip.boat.name)}</p><p>Capacity: ${trip.boat.capacity} kg</p></article>`).join("")
      : "<p>No trips match this route yet.</p>";
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.hidden = false;
  }
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value ?? "";
  return element.innerHTML;
}

loadTrips();
