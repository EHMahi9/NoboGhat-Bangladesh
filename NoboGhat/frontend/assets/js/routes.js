document.addEventListener("DOMContentLoaded", function() {
    var resultsContainer = document.getElementById("tripResults");
    var errorMessage = document.getElementById("routesError");
    var searchForm = document.getElementById("routeSearchForm");
    var resultsCount = document.getElementById("resultsCount");
    var bookingSection = document.getElementById("bookingSection");
    var bookingForm = document.getElementById("bookingForm");
    var bookingMessage = document.getElementById("bookingMessage");
    var bookingTripIdInput = document.getElementById("bookingTripId");
    var bookingCargoWeightInput = document.getElementById("bookingCargoWeight");
    var bookingCargoTypeSelect = document.getElementById("bookingCargoType");
    var estimatedFareDisplay = document.getElementById("estimatedFareDisplay");
    var bookingTripDetails = document.getElementById("bookingTripDetails");
    var closeBookingPanel = document.getElementById("closeBookingPanel");
    var currentSearchSource = "";
    var currentSearchDestination = "";
    var currentSearchDate = "";
    var selectedTrip = null;

    function setBookingMessage(text, type) {
        if (!bookingMessage) return;
        bookingMessage.textContent = text;
        bookingMessage.className = "booking-message " + (type || "");
        bookingMessage.hidden = !text;
    }

    function formatDeparture(trip) {
        if (!trip.departureTime) return "Scheduled departure";
        var date = new Date(trip.departureTime);
        if (Number.isNaN(date.getTime())) return "Scheduled departure";
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    }

    function openBookingPanel(trip) {
        selectedTrip = trip;
        if (bookingTripIdInput) bookingTripIdInput.value = trip.tripId;
        if (bookingCargoWeightInput) bookingCargoWeightInput.value = "";
        if (bookingCargoTypeSelect) bookingCargoTypeSelect.value = "";
        if (estimatedFareDisplay) {
            estimatedFareDisplay.hidden = true;
            estimatedFareDisplay.textContent = "Estimated Fare: ৳ 0";
        }
        if (bookingTripDetails) {
            bookingTripDetails.innerHTML = "";

            var items = [
                { label: "Trip ID", value: "#TRP-" + trip.tripId },
                { label: "Route", value: (trip.source || "N/A") + " → " + (trip.destination || "N/A") },
                { label: "Boat", value: trip.boatName || "N/A" },
                { label: "Departure", value: formatDeparture(trip) },
                { label: "Available Capacity", value: (trip.remainingCapacity || 0) + " kg" },
                { label: "Fare Rate", value: trip.pricePerKg ? "৳ " + trip.pricePerKg.toFixed(2) + " / kg" : "On request" }
            ];

            for (var i = 0; i < items.length; i++) {
                var chip = document.createElement("div");
                chip.className = "booking-chip";

                var label = document.createElement("strong");
                label.textContent = items[i].label;

                var value = document.createElement("span");
                value.textContent = items[i].value;

                chip.appendChild(label);
                chip.appendChild(value);
                bookingTripDetails.appendChild(chip);
            }
        }

        if (bookingSection) {
            bookingSection.hidden = false;
            bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        setBookingMessage("", "");
        if (bookingCargoWeightInput) bookingCargoWeightInput.focus();
    }

    function closeBookingPanelView() {
        selectedTrip = null;
        if (bookingSection) bookingSection.hidden = true;
        if (bookingCargoTypeSelect) bookingCargoTypeSelect.value = "";
        if (estimatedFareDisplay) estimatedFareDisplay.hidden = true;
        setBookingMessage("", "");
    }

    function canCreateBooking() {
        var token = localStorage.getItem("noboghatToken");
        var rawRole = localStorage.getItem("noboghatRole") || "";
        var role = rawRole.toUpperCase().replace(/^ROLE_/, "");

        if (!token) {
            window.location.href = "login.html?message=" + encodeURIComponent("Please sign in to book cargo.");
            return false;
        }

        if (role === "PENDING") {
            window.location.href = "dashboard.html?message=" + encodeURIComponent("Choose Farmer or Trader to finish setting up your account before booking cargo.");
            return false;
        }

        if (role !== "FARMER" && role !== "TRADER") {
            setBookingMessage("Only Farmer and Trader accounts can create cargo bookings. (Current role: " + (role || "None") + ". You can switch roles in your Dashboard).", "error");
            return false;
        }

        return true;
    }

    function createTripCard(trip) {
        var card = document.createElement("div");
        card.className = "trip-card";

        var header = document.createElement("div");
        header.className = "trip-header";

        var boatName = document.createElement("span");
        boatName.className = "boat-name";
        boatName.innerHTML = '<i class="fa-solid fa-ship"></i> ' + (trip.boatName || "Unknown");

        var badge = document.createElement("span");
        badge.className = "status-badge available";
        badge.textContent = "Available";

        header.appendChild(boatName);
        header.appendChild(badge);

        var body = document.createElement("div");
        body.className = "trip-body";

        var routeInfo = document.createElement("div");
        routeInfo.className = "route-info";

        var src = document.createElement("h4");
        src.textContent = trip.source || "N/A";
        var arrow = document.createElement("i");
        arrow.className = "fa-solid fa-arrow-right";
        var dst = document.createElement("h4");
        dst.textContent = trip.destination || "N/A";

        routeInfo.appendChild(src);
        routeInfo.appendChild(arrow);
        routeInfo.appendChild(dst);

        var details = document.createElement("ul");
        details.className = "trip-details";

        var li1 = document.createElement("li");
        li1.innerHTML = '<i class="fa-regular fa-calendar"></i> ' + formatDeparture(trip);

        var li2 = document.createElement("li");
        li2.innerHTML = '<i class="fa-solid fa-weight-scale"></i> <strong>Available Capacity:</strong> ' + (trip.remainingCapacity || "0") + ' kg';

        var li3 = document.createElement("li");
        li3.innerHTML = '<i class="fa-solid fa-user-check"></i> Verified Owner';

        details.appendChild(li1);
        details.appendChild(li2);
        details.appendChild(li3);

        body.appendChild(routeInfo);
        body.appendChild(details);

        var footer = document.createElement("div");
        footer.className = "trip-footer";

        var price = document.createElement("span");
        price.className = "price-estimate";
        price.textContent = trip.pricePerKg
            ? "৳ " + trip.pricePerKg.toFixed(2) + " / kg"
            : "Price on request";

        var bookLink = document.createElement("button");
        bookLink.type = "button";
        bookLink.className = "btn-book";
        bookLink.textContent = "Book Space";
        bookLink.addEventListener("click", function () {
            if (!canCreateBooking()) return;
            openBookingPanel(trip);
        });

        footer.appendChild(price);
        footer.appendChild(bookLink);

        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(footer);

        return card;
    }

    async function loadTrips(searchSource, searchDestination, searchDate) {
        currentSearchSource = searchSource || "";
        currentSearchDestination = searchDestination || "";
        currentSearchDate = searchDate || "";
        resultsContainer.innerHTML = '<p>Loading available trips...</p>';
        errorMessage.hidden = true;

        try {
            // Build query string — server does the filtering, not the browser
            var params = new URLSearchParams();
            if (currentSearchSource) params.set("source", currentSearchSource);
            if (currentSearchDestination) params.set("destination", currentSearchDestination);
            if (currentSearchDate) params.set("date", currentSearchDate);
            var query = params.toString() ? "?" + params.toString() : "";

            var response = await fetch(window.NoboGhatApi.url("/api/trips" + query));
            if (!response.ok) throw new Error("Trips could not be loaded from the server.");
            var trips = await response.json();

            resultsCount.textContent = "Showing " + trips.length + " available trip" + (trips.length !== 1 ? "s" : "");
            resultsContainer.innerHTML = "";

            if (trips.length === 0) {
                var noResults = document.createElement("p");
                noResults.style.cssText = "grid-column: 1 / -1; text-align: center; font-size: 1.2rem; padding: 2rem;";
                noResults.textContent = "No trips match this route yet. Please try different districts.";
                resultsContainer.appendChild(noResults);
            } else {
                for (var i = 0; i < trips.length; i++) {
                    resultsContainer.appendChild(createTripCard(trips[i]));
                }
            }
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.hidden = false;
            resultsContainer.innerHTML = "";
            resultsCount.textContent = "Error loading trips";
        }
    }


    if (closeBookingPanel) {
        closeBookingPanel.addEventListener("click", function () {
            closeBookingPanelView();
        });
    }

    if (bookingCargoWeightInput) {
        bookingCargoWeightInput.addEventListener("input", function() {
            if (estimatedFareDisplay && selectedTrip) {
                var weight = Number(bookingCargoWeightInput.value);
                if (weight > 0 && selectedTrip.pricePerKg) {
                    estimatedFareDisplay.textContent = "Estimated Fare: ৳ " + (weight * selectedTrip.pricePerKg).toFixed(2);
                    estimatedFareDisplay.hidden = false;
                } else {
                    estimatedFareDisplay.hidden = true;
                }
            }
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (!selectedTrip) {
                setBookingMessage("Please select a trip first.", "error");
                return;
            }

            if (!canCreateBooking()) return;

            var cargoWeight = Number(bookingCargoWeightInput ? bookingCargoWeightInput.value : "");
            if (!cargoWeight || cargoWeight <= 0) {
                setBookingMessage("Cargo weight must be greater than zero.", "error");
                return;
            }

            var submitButton = bookingForm.querySelector("button[type='submit']");
            if (submitButton) submitButton.disabled = true;
            setBookingMessage("Submitting booking...", "");

            try {
                var response = await fetch(window.NoboGhatApi.url("/api/bookings"), {
                    method: "POST",
                    headers: Object.assign({
                        "Content-Type": "application/json"
                    }, window.NoboGhatApi.authHeaders()),
                    body: JSON.stringify({
                        tripId: selectedTrip.tripId,
                        cargoWeight: cargoWeight,
                        cargoType: bookingCargoTypeSelect ? bookingCargoTypeSelect.value || "General" : "General"
                    })
                });

                if (!response.ok) {
                    var payload = {};
                    try {
                        payload = await response.json();
                    } catch (parseError) {
                        payload = {};
                    }
                    throw new Error(payload.message || "Booking could not be created.");
                }

                setBookingMessage("Booking created successfully! Redirecting to Dashboard...", "success");
                await loadTrips(currentSearchSource, currentSearchDestination, currentSearchDate);
                bookingForm.reset();
                selectedTrip = null;
                setTimeout(function () {
                    window.location.href = "dashboard.html";
                }, 1500);
            } catch (error) {
                setBookingMessage(error.message, "error");
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }

    if (searchForm) {
        searchForm.addEventListener("submit", function(event) {
            event.preventDefault();
            var sourceInput = document.getElementById("searchSource").value.trim();
            var destInput = document.getElementById("searchDestination").value.trim();
            var dateInput = document.getElementById("searchDate").value;
            loadTrips(sourceInput, destInput, dateInput);
        });
    }

    var params = new URLSearchParams(window.location.search);
    var initialSource = params.get("source") || "";
    var initialDestination = params.get("destination") || "";
    var initialDate = params.get("date") || "";

    if (initialSource) document.getElementById("searchSource").value = initialSource;
    if (initialDestination) document.getElementById("searchDestination").value = initialDestination;
    if (initialDate) document.getElementById("searchDate").value = initialDate;

    loadTrips(initialSource, initialDestination, initialDate);
});
