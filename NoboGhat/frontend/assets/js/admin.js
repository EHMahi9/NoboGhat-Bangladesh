document.addEventListener("DOMContentLoaded", async function() {
  var api = window.NoboGhatApi;
  var errorMessage = document.getElementById("dashboardError");
  var boatsBody = document.getElementById("boatsBody");
  var boatForm = document.getElementById("boatForm");
  var boatMessage = document.getElementById("boatMessage");
  var bookingsBody = document.getElementById("bookingsBody");

  function setBoatMessage(text, type) {
    if (!boatMessage) return;
    boatMessage.textContent = text;
    boatMessage.className = "booking-message " + (type || "");
    boatMessage.hidden = !text;
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
    await loadBoats();
    await loadBookings();

    boatsBody.addEventListener("click", async function (event) {
      var id = event.target.getAttribute("data-delete");
      if (!id) return;
      await fetch(api.url("/api/boats/" + id), { method: "DELETE", headers: api.authHeaders() });
      await loadBoats();
    });
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
