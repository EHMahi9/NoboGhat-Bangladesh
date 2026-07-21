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
    var bookingTripDetails = document.getElementById("bookingTripDetails");
    var closeBookingPanel = document.getElementById("closeBookingPanel");
    var currentSearchSource = "";
    var currentSearchDestination = "";
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
        if (bookingTripDetails) {
            bookingTripDetails.innerHTML = "";

            var items = [
                { label: "Trip ID", value: "#TRP-" + trip.tripId },
                { label: "Route", value: (trip.route.source || "N/A") + " → " + (trip.route.destination || "N/A") },
                { label: "Boat", value: trip.boat.name || "N/A" },
                { label: "Departure", value: formatDeparture(trip) },
                { label: "Available Capacity", value: (trip.boat.capacity || 0) + " kg" }
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
        setBookingMessage("", "");
    }

    function createTripCard(trip) {
        var card = document.createElement("div");
        card.className = "trip-card";

        var header = document.createElement("div");
        header.className = "trip-header";

        var boatName = document.createElement("span");
        boatName.className = "boat-name";
        boatName.innerHTML = '<i class="fa-solid fa-ship"></i> ' + (trip.boat.name || "Unknown");

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
        src.textContent = trip.route.source || "N/A";
        var arrow = document.createElement("i");
        arrow.className = "fa-solid fa-arrow-right";
        var dst = document.createElement("h4");
        dst.textContent = trip.route.destination || "N/A";

        routeInfo.appendChild(src);
        routeInfo.appendChild(arrow);
        routeInfo.appendChild(dst);

        var details = document.createElement("ul");
        details.className = "trip-details";

        var li1 = document.createElement("li");
        li1.innerHTML = '<i class="fa-regular fa-calendar"></i> ' + formatDeparture(trip);

        var li2 = document.createElement("li");
        li2.innerHTML = '<i class="fa-solid fa-weight-scale"></i> <strong>Available Capacity:</strong> ' + (trip.boat.capacity || "0") + ' kg';

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
        price.textContent = "Live booking";

        var bookLink = document.createElement("button");
        bookLink.type = "button";
        bookLink.className = "btn-book";
        bookLink.textContent = "Book Space";
        bookLink.addEventListener("click", function () {
            var token = localStorage.getItem("noboghatToken");
            if (!token) {
                window.location.href = "login.html?message=" + encodeURIComponent("Please sign in to book cargo.");
                return;
            }
            openBookingPanel(trip);
        });

        footer.appendChild(price);
        footer.appendChild(bookLink);

        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(footer);

        return card;
    }

    async function loadTrips(searchSource, searchDestination) {
        currentSearchSource = searchSource || "";
        currentSearchDestination = searchDestination || "";
        resultsContainer.innerHTML = '<p>Loading available trips...</p>';
        errorMessage.hidden = true;

        try {
            var response = await fetch(window.NoboGhatApi.url("/api/trips"));
            if (!response.ok) throw new Error("Trips could not be loaded from the server.");
            var trips = await response.json();

            var matches = trips.filter(function(trip) {
                var route = trip.route || {};
                var srcMatch = (route.source || "").toLowerCase().includes(currentSearchSource.toLowerCase());
                var dstMatch = (route.destination || "").toLowerCase().includes(currentSearchDestination.toLowerCase());
                return srcMatch && dstMatch;
            });

            resultsCount.textContent = "Showing " + matches.length + " available trip" + (matches.length !== 1 ? "s" : "");
            resultsContainer.innerHTML = "";

            if (matches.length === 0) {
                var noResults = document.createElement("p");
                noResults.style.cssText = "grid-column: 1 / -1; text-align: center; font-size: 1.2rem; padding: 2rem;";
                noResults.textContent = "No trips match this route yet. Please try different districts.";
                resultsContainer.appendChild(noResults);
            } else {
                for (var i = 0; i < matches.length; i++) {
                    resultsContainer.appendChild(createTripCard(matches[i]));
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

    if (bookingForm) {
        bookingForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (!selectedTrip) {
                setBookingMessage("Please select a trip first.", "error");
                return;
            }

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
                        cargoWeight: cargoWeight
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

                setBookingMessage("Booking created successfully.", "success");
                await loadTrips(currentSearchSource, currentSearchDestination);
                bookingForm.reset();
                selectedTrip = null;
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
            loadTrips(sourceInput, destInput);
        });
    }

    var params = new URLSearchParams(window.location.search);
    var initialSource = params.get("source") || "";
    var initialDestination = params.get("destination") || "";

    if (initialSource) document.getElementById("searchSource").value = initialSource;
    if (initialDestination) document.getElementById("searchDestination").value = initialDestination;

    loadTrips(initialSource, initialDestination);
});
