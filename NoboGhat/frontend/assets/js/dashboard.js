document.addEventListener("DOMContentLoaded", async function () {
    var api = window.NoboGhatApi;
    var bookings = [];

    function formatDate(value) {
        if (!value) return "N/A";
        var date = new Date(value);
        if (Number.isNaN(date.getTime())) return "N/A";
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }

    function formatRoute(booking) {
        var source = booking.source || "N/A";
        var destination = booking.destination || "N/A";
        return source + " → " + destination;
    }

    function statusClass(status) {
        var normalized = (status || "").toUpperCase();
        if (normalized === "CONFIRMED" || normalized === "COMPLETED") return "completed";
        if (normalized === "CANCELLED") return "pending";
        return "pending";
    }

    function renderBookings(list) {
        var summary = document.getElementById("activeBookingsSummary");
        var tableBody = document.getElementById("bookingHistoryBody");

        if (!summary || !tableBody) return;

        var activeCount = 0;
        for (var i = 0; i < list.length; i++) {
            var status = (list[i].status || "").toUpperCase();
            if (status === "PENDING" || status === "CONFIRMED") {
                activeCount += 1;
            }
        }

        if (list.length === 0) {
            summary.textContent = "You do not have any bookings yet.";
            tableBody.innerHTML = "<tr><td colspan=\"5\">No bookings found for your account.</td></tr>";
            return;
        }

        summary.textContent = "You have " + activeCount + " active booking" + (activeCount === 1 ? "" : "s") + ".";
        tableBody.innerHTML = "";

        for (var j = 0; j < list.length; j++) {
            var booking = list[j];
            var row = document.createElement("tr");

            var bookingId = document.createElement("td");
            bookingId.textContent = "#NBG-" + booking.bookingId;

            var route = document.createElement("td");
            route.textContent = formatRoute(booking);

            var cargoWeight = document.createElement("td");
            cargoWeight.textContent = (booking.cargoWeight || 0) + " kg";

            var date = document.createElement("td");
            date.textContent = formatDate(booking.departureTime);

            var status = document.createElement("td");
            var badge = document.createElement("span");
            badge.className = "status " + statusClass(booking.status);
            badge.textContent = booking.status || "PENDING";
            status.appendChild(badge);

            row.appendChild(bookingId);
            row.appendChild(route);
            row.appendChild(cargoWeight);
            row.appendChild(date);
            row.appendChild(status);
            tableBody.appendChild(row);
        }
    }

    function renderTrips(list) {
        var tripsBody = document.getElementById("myTripsBody");

        if (!tripsBody) return;

        var groupedTrips = [];
        var seenTrips = {};

        for (var i = 0; i < list.length; i++) {
            var booking = list[i];
            var tripKey = booking.tripId;
            if (tripKey == null || seenTrips[tripKey]) {
                continue;
            }

            seenTrips[tripKey] = true;
            groupedTrips.push({
                tripId: booking.tripId,
                source: booking.source || "N/A",
                destination: booking.destination || "N/A",
                boatName: booking.boatName || "N/A",
                departureTime: booking.departureTime,
                cargoWeight: booking.cargoWeight || 0
            });
        }

        if (groupedTrips.length === 0) {
            tripsBody.innerHTML = "<tr><td colspan=\"5\">No trips found for your account.</td></tr>";
            return;
        }

        tripsBody.innerHTML = "";

        for (var j = 0; j < groupedTrips.length; j++) {
            var trip = groupedTrips[j];
            var row = document.createElement("tr");

            var tripId = document.createElement("td");
            tripId.textContent = "#TRP-" + trip.tripId;

            var route = document.createElement("td");
            route.textContent = trip.source + " → " + trip.destination;

            var boat = document.createElement("td");
            boat.textContent = trip.boatName;

            var departure = document.createElement("td");
            departure.textContent = formatDate(trip.departureTime);

            var cargo = document.createElement("td");
            cargo.textContent = trip.cargoWeight + " kg";

            row.appendChild(tripId);
            row.appendChild(route);
            row.appendChild(boat);
            row.appendChild(departure);
            row.appendChild(cargo);
            tripsBody.appendChild(row);
        }
    }

    var viewButton = document.getElementById("viewBookingStatusBtn");
    if (viewButton) {
        viewButton.addEventListener("click", function () {
            var section = document.getElementById("active-bookings-section");
            if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    try {
        var profileResponse = await fetch(api.url("/api/users/profile"), { headers: api.authHeaders() });
        if (!profileResponse.ok) throw new Error("Your session has expired. Please sign in again.");
        var user = await profileResponse.json();

        document.querySelectorAll("[data-user-name]").forEach(function (element) {
            element.textContent = user.name;
        });

        var role = document.querySelector("[data-user-role]");
        if (role) role.textContent = (user.role || "").replace("_", " ");

        var bookingsResponse = await fetch(api.url("/api/bookings"), {
            headers: api.authHeaders()
        });

        if (!bookingsResponse.ok) throw new Error("Your bookings could not be loaded.");

        bookings = await bookingsResponse.json();
        renderBookings(bookings);
        renderTrips(bookings);
    } catch (error) {
        localStorage.removeItem("noboghatToken");
        localStorage.removeItem("noboghatRole");

        var summaryElement = document.getElementById("activeBookingsSummary");
        var tableBodyElement = document.getElementById("bookingHistoryBody");
        var tripsBodyElement = document.getElementById("myTripsBody");

        if (summaryElement) summaryElement.textContent = "Unable to load your bookings.";
        if (tableBodyElement) {
            tableBodyElement.innerHTML = "";
            var errorRow = document.createElement("tr");
            var errorCell = document.createElement("td");
            errorCell.colSpan = 5;
            errorCell.textContent = error.message;
            errorRow.appendChild(errorCell);
            tableBodyElement.appendChild(errorRow);
        }
        if (tripsBodyElement) {
            tripsBodyElement.innerHTML = "";
            var tripsErrorRow = document.createElement("tr");
            var tripsErrorCell = document.createElement("td");
            tripsErrorCell.colSpan = 5;
            tripsErrorCell.textContent = error.message;
            tripsErrorRow.appendChild(tripsErrorCell);
            tripsBodyElement.appendChild(tripsErrorRow);
        }

        window.location.replace("login.html?message=" + encodeURIComponent(error.message));
    }
});
