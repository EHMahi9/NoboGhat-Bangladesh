document.addEventListener("DOMContentLoaded", async function() {
  var api = window.NoboGhatApi;
  var errorMessage = document.getElementById("dashboardError");
  var boatsBody = document.getElementById("boatsBody");
  var boatForm = document.getElementById("boatForm");
  var boatMessage = document.getElementById("boatMessage");
  var tripForm = document.getElementById("tripForm");
  var tripMessage = document.getElementById("tripMessage");
  var tripsBody = document.getElementById("tripsBody");
  var tripRouteSelect = document.getElementById("tripRoute");
  var tripBoatSelect = document.getElementById("tripBoat");
  var usersBody = document.getElementById("usersBody");
  var bookingsBody = document.getElementById("bookingsBody");

  function setBoatMessage(text, type) {
    if (!boatMessage) return;
    boatMessage.textContent = text;
    boatMessage.className = "booking-message " + (type || "");
    boatMessage.hidden = !text;
  }

  function setTripMessage(text, type) {
    if (!tripMessage) return;
    tripMessage.textContent = text;
    tripMessage.className = "booking-message " + (type || "");
    tripMessage.hidden = !text;
  }

  function formatTripDeparture(value) {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  }

  async function loadBoats() {
    var response = await fetch(api.url("/api/boats"), { headers: api.authHeaders() });
    if (!response.ok) throw new Error("Boats could not be loaded.");
    var boats = await response.json();
    boatsBody.innerHTML = "";
    if (!boats.length) {
      boatsBody.innerHTML = "<tr><td colspan=\"3\">No boats found.</td></tr>";
      return;
    }
    boats.forEach(function (boat) {
      var row = document.createElement("tr");
      row.innerHTML = "<td>" + boat.name + "</td><td>" + boat.capacity + " kg</td><td><button type='button' class='btn-outline' data-delete='" + boat.boatId + "'>Delete</button></td>";
      boatsBody.appendChild(row);
    });
  }

  async function loadTripOptions() {
    var routesResponse = await fetch(api.url("/api/routes"), { headers: api.authHeaders() });
    if (!routesResponse.ok) throw new Error("Routes could not be loaded.");
    var boatsResponse = await fetch(api.url("/api/boats"), { headers: api.authHeaders() });
    if (!boatsResponse.ok) throw new Error("Boats could not be loaded.");
    var routes = await routesResponse.json();
    var boats = await boatsResponse.json();

    if (tripRouteSelect) {
      tripRouteSelect.innerHTML = routes.map(function(route) {
        return "<option value='" + route.routeId + "'>" + route.source + " → " + route.destination + "</option>";
      }).join("");
    }
    if (tripBoatSelect) {
      tripBoatSelect.innerHTML = boats.map(function(boat) {
        return "<option value='" + boat.boatId + "'>" + boat.name + " (" + boat.capacity + " kg)</option>";
      }).join("");
    }
  }

  async function loadTrips() {
    var response = await fetch(api.url("/api/admin/trips"), { headers: api.authHeaders() });
    if (!response.ok) throw new Error("Trips could not be loaded.");
    var trips = await response.json();
    tripsBody.innerHTML = "";
    if (!trips.length) {
      tripsBody.innerHTML = "<tr><td colspan=\"5\">No trips found.</td></tr>";
      return;
    }
    trips.forEach(function (trip) {
      var row = document.createElement("tr");
      row.innerHTML = "<td>#TRP-" + trip.tripId + "</td><td>" + (trip.route ? trip.route.source : "") + " → " + (trip.route ? trip.route.destination : "") + "</td><td>" + (trip.boat ? trip.boat.name : "") + "</td><td>" + formatTripDeparture(trip.departureTime) + "</td><td><button type='button' class='btn-outline' data-delete-trip='" + trip.tripId + "'>Delete</button></td>";
      tripsBody.appendChild(row);
    });
  }

  async function loadUsers() {
    var response = await fetch(api.url("/api/admin/users"), { headers: api.authHeaders() });
    if (!response.ok) throw new Error("Users could not be loaded.");
    var users = await response.json();
    usersBody.innerHTML = "";
    if (!users.length) {
      usersBody.innerHTML = "<tr><td colspan=\"7\">No users found.</td></tr>";
      return;
    }
    users.forEach(function (user) {
      var row = document.createElement("tr");
      row.innerHTML = "<td>#USR-" + user.userId + "</td><td>" + user.name + "</td><td>" + (user.phone || user.email || "—") + "</td><td>" + user.role + "</td><td>" + user.boatCount + "</td><td>" + user.bookingCount + "</td><td><button type='button' class='btn-outline' data-delete-user='" + user.userId + "'>Delete</button></td>";
      usersBody.appendChild(row);
    });
  }

  async function loadBookings() {
    var response = await fetch(api.url("/api/admin/bookings"), { headers: api.authHeaders() });
    if (!response.ok) throw new Error("Bookings could not be loaded.");
    var bookings = await response.json();
    bookingsBody.innerHTML = "";
    if (!bookings.length) {
      bookingsBody.innerHTML = "<tr><td colspan=\"5\">No bookings found.</td></tr>";
      return;
    }
    bookings.forEach(function (booking) {
      var row = document.createElement("tr");
      row.innerHTML = "<td>#NBG-" + booking.bookingId + "</td><td>" + booking.source + " → " + booking.destination + "</td><td>" + booking.cargoWeight + " kg</td><td>" + booking.status + "</td><td><button type='button' class='btn-outline' data-booking='" + booking.bookingId + "' data-status='CONFIRMED'>Confirm</button> <button type='button' class='btn-outline' data-booking='" + booking.bookingId + "' data-status='CANCELLED'>Cancel</button></td>";
      bookingsBody.appendChild(row);
    });
  }

  try {
    var response = await fetch(api.url("/api/admin/dashboard"), { headers: api.authHeaders() });
    if (!response.ok) throw new Error("Dashboard data could not be loaded.");
    var data = await response.json();
    document.getElementById("totalUsers").textContent = data.totalUsers;
    document.getElementById("totalBoats").textContent = data.totalBoats;
    document.getElementById("totalBookings").textContent = data.totalBookings;
    document.getElementById("totalCargoWeight").textContent = data.totalCargoWeight + " kg";
    await loadTripOptions();
    await loadBoats();
    await loadTrips();
    await loadUsers();
    await loadBookings();

    boatsBody.addEventListener("click", async function (event) {
      var id = event.target.getAttribute("data-delete");
      if (!id) return;
      await fetch(api.url("/api/boats/" + id), { method: "DELETE", headers: api.authHeaders() });
      await loadBoats();
    });
    tripsBody.addEventListener("click", async function (event) {
      var id = event.target.getAttribute("data-delete-trip");
      if (!id) return;
      await fetch(api.url("/api/admin/trips/" + id), { method: "DELETE", headers: api.authHeaders() });
      await loadTrips();
    });
    if (usersBody) {
      usersBody.addEventListener("click", async function (event) {
        var id = event.target.getAttribute("data-delete-user");
        if (!id) return;
        await fetch(api.url("/api/admin/users/" + id), { method: "DELETE", headers: api.authHeaders() });
        await loadUsers();
      });
    }
    bookingsBody.addEventListener("click", async function (event) {
      var id = event.target.getAttribute("data-booking");
      var status = event.target.getAttribute("data-status");
      if (!id) return;
      await fetch(api.url("/api/admin/bookings/" + id + "/status"), {
        method: "PATCH",
        headers: Object.assign({ "Content-Type": "application/json" }, api.authHeaders()),
        body: JSON.stringify({ status: status })
      });
      await loadBookings();
    });

    if (tripForm) {
      tripForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        setTripMessage("Saving trip...", "");
        try {
          var payload = {
            routeId: Number(tripRouteSelect ? tripRouteSelect.value : 0),
            boatId: Number(tripBoatSelect ? tripBoatSelect.value : 0),
            departureTime: document.getElementById("tripDepartureTime").value
          };
          var save = await fetch(api.url("/api/admin/trips"), {
            method: "POST",
            headers: Object.assign({ "Content-Type": "application/json" }, api.authHeaders()),
            body: JSON.stringify(payload)
          });
          var body = await save.json();
          if (!save.ok) throw new Error(body.message || "Trip could not be saved.");
          tripForm.reset();
          setTripMessage("Trip saved successfully.", "success");
          await loadTrips();
        } catch (error) {
          setTripMessage(error.message, "error");
        }
      });
    }

    if (boatForm) {
      boatForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        setBoatMessage("Saving boat...", "");
        try {
          var payload = {
            name: document.getElementById("boatName").value.trim(),
            capacity: Number(document.getElementById("boatCapacity").value)
          };
          var save = await fetch(api.url("/api/boats"), {
            method: "POST",
            headers: Object.assign({ "Content-Type": "application/json" }, api.authHeaders()),
            body: JSON.stringify(payload)
          });
          var body = await save.json();
          if (!save.ok) throw new Error(body.message || "Boat could not be saved.");
          boatForm.reset();
          setBoatMessage("Boat saved successfully.", "success");
          await loadBoats();
        } catch (error) {
          setBoatMessage(error.message, "error");
        }
      });
    }
  } catch (error) {
    if (errorMessage) {
      errorMessage.textContent = error.message;
      errorMessage.hidden = false;
    }
  }
});
