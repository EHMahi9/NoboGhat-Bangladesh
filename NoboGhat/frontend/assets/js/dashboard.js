document.addEventListener("DOMContentLoaded", async function () {
    var api = window.NoboGhatApi;
    var bookings = [];
    var dashboardLinks = document.querySelectorAll("[data-dashboard-link]");
    var dashboardSections = document.querySelectorAll("[data-dashboard-section]");
    var profileForm = document.getElementById("profileForm");
    var profileMessage = document.getElementById("profileMessage");
    var notificationsBody = document.getElementById("notificationsBody");
    var notificationCount = document.getElementById("notificationCount");

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

    function setActiveSection(sectionKey) {
        dashboardLinks.forEach(function (link) {
            var isActive = link.getAttribute("data-dashboard-link") === sectionKey;
            link.classList.toggle("active", isActive);
        });

        dashboardSections.forEach(function (section) {
            var matches = section.getAttribute("data-dashboard-section") === sectionKey;
            section.classList.toggle("is-hidden", !matches);
        });
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
            tableBody.innerHTML = "<tr><td colspan=\"8\">No bookings found for your account.</td></tr>";
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

            var cargoType = document.createElement("td");
            cargoType.textContent = booking.cargoType || "General";

            var cargoWeight = document.createElement("td");
            cargoWeight.textContent = (booking.cargoWeight || 0) + " kg";

            var totalFare = document.createElement("td");
            totalFare.textContent = booking.totalFare ? "৳ " + booking.totalFare.toFixed(2) : "N/A";

            var bookedOn = document.createElement("td");
            bookedOn.textContent = booking.bookedAt ? formatDate(booking.bookedAt) : "N/A";

            var statusTd = document.createElement("td");
            var badge = document.createElement("span");
            badge.className = "status " + statusClass(booking.status);
            badge.textContent = booking.status || "PENDING";
            statusTd.appendChild(badge);

            var actionTd = document.createElement("td");
            var bStatus = (booking.status || "").toUpperCase();
            if (bStatus === "PENDING" || bStatus === "CONFIRMED") {
                if (bStatus === "PENDING") {
                    var payBtn = document.createElement("button");
                    payBtn.type = "button";
                    payBtn.className = "btn-primary";
                    payBtn.style.cssText = "font-size:0.78rem;padding:4px 10px;margin-right:8px;";
                    payBtn.textContent = "Pay Now";
                    payBtn.addEventListener("click", (function (id, btn) {
                        return async function () {
                            btn.disabled = true;
                            btn.textContent = "Processing...";
                            try {
                                var resp = await fetch(window.NoboGhatApi.url("/api/payments/initiate"), {
                                    method: "POST",
                                    headers: Object.assign({ "Content-Type": "application/json" }, window.NoboGhatApi.authHeaders()),
                                    body: JSON.stringify({ bookingId: id, gateway: "SSLCommerz" })
                                });
                                if (!resp.ok) throw new Error("Payment initiation failed.");
                                var data = await resp.json();
                                
                                // Mock gateway redirection by immediately calling the webhook for testing
                                alert("Redirecting to SSLCommerz... (MOCK)");
                                await fetch(window.NoboGhatApi.url("/api/payments/webhook"), {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ transactionRef: data.transactionRef, status: "SUCCESS" })
                                });
                                alert("Payment successful!");
                                location.reload();
                            } catch (err) {
                                alert(err.message);
                                btn.disabled = false;
                                btn.textContent = "Pay Now";
                            }
                        };
                    })(booking.bookingId, payBtn));
                    actionTd.appendChild(payBtn);
                }

                var cancelBtn = document.createElement("button");
                cancelBtn.type = "button";
                cancelBtn.className = "btn-outline";
                cancelBtn.style.cssText = "color:#e74c3c;border-color:#e74c3c;font-size:0.78rem;padding:4px 10px;";
                cancelBtn.textContent = "Cancel";
                cancelBtn.addEventListener("click", (function (id, btn) {
                    return async function () {
                        if (!confirm("Cancel booking #NBG-" + id + "?")) return;
                        btn.disabled = true;
                        btn.textContent = "Cancelling...";
                        try {
                            var resp = await fetch(window.NoboGhatApi.url("/api/bookings/" + id), {
                                method: "DELETE",
                                headers: window.NoboGhatApi.authHeaders()
                            });
                            if (!resp.ok) {
                                var errData = {};
                                try { errData = await resp.json(); } catch (e) {}
                                throw new Error(errData.message || "Could not cancel booking.");
                            }
                            location.reload();
                        } catch (err) {
                            alert(err.message);
                            btn.disabled = false;
                            btn.textContent = "Cancel";
                        }
                    };
                })(booking.bookingId, cancelBtn));
                actionTd.appendChild(cancelBtn);
            } else {
                actionTd.textContent = "-";
            }

            row.appendChild(bookingId);
            row.appendChild(route);
            row.appendChild(cargoType);
            row.appendChild(cargoWeight);
            row.appendChild(totalFare);
            row.appendChild(bookedOn);
            row.appendChild(statusTd);
            row.appendChild(actionTd);
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

    function setProfileMessage(text, type) {
        if (!profileMessage) return;
        profileMessage.textContent = text;
        profileMessage.className = "booking-message " + (type || "");
        profileMessage.hidden = !text;
    }

    function renderNotifications(list) {
        if (!notificationsBody) return;
        var unread = 0;
        if (list.length === 0) {
            notificationsBody.innerHTML = "<tr><td colspan=\"4\">No notifications yet.</td></tr>";
            if (notificationCount) notificationCount.textContent = "";
            return;
        }
        notificationsBody.innerHTML = "";
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (!item.read) unread += 1;
            var row = document.createElement("tr");
            var msg = document.createElement("td");
            msg.textContent = item.message;
            var date = document.createElement("td");
            date.textContent = formatDate(item.createdAt);
            var status = document.createElement("td");
            status.textContent = item.read ? "Read" : "Unread";
            var action = document.createElement("td");
            if (!item.read) {
                var btn = document.createElement("button");
                btn.type = "button";
                btn.className = "btn-outline";
                btn.textContent = "Mark Read";
                btn.addEventListener("click", async function (id) {
                    return async function () {
                        await fetch(api.url("/api/notifications/" + id + "/read"), { method: "PUT", headers: api.authHeaders() });
                        location.reload();
                    };
                }(item.notificationId));
                action.appendChild(btn);
            } else {
                action.textContent = "-";
            }
            row.appendChild(msg);
            row.appendChild(date);
            row.appendChild(status);
            row.appendChild(action);
            notificationsBody.appendChild(row);
        }
        if (notificationCount) notificationCount.textContent = unread ? "(" + unread + ")" : "";
    }

    var viewButton = document.getElementById("viewBookingStatusBtn");
    if (viewButton) {
        viewButton.addEventListener("click", function () {
            setActiveSection("active-bookings");
            var section = document.getElementById("active-bookings-section");
            if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    // Role Selection Modal Logic
    var roleModal = document.getElementById("roleSelectionModal");
    var roleError = document.getElementById("roleError");

    function showRoleModal() {
        if (roleModal) roleModal.style.display = "flex";
    }

    function hideRoleModal() {
        if (roleModal) roleModal.style.display = "none";
    }

    // Attach role selection button handlers
    if (roleModal) {
        var roleButtons = roleModal.querySelectorAll(".role-btn");
        roleButtons.forEach(function (btn) {
            btn.addEventListener("click", async function () {
                var selectedRole = btn.getAttribute("data-role");
                if (!selectedRole) return;
                btn.disabled = true;
                btn.textContent = "Saving...";
                if (roleError) roleError.style.display = "none";
                try {
                    var response = await fetch(api.url("/api/users/update-role"), {
                        method: "PUT",
                        headers: Object.assign({ "Content-Type": "application/json" }, api.authHeaders()),
                        body: JSON.stringify({ role: selectedRole })
                    });
                    var data = await response.json();
                    if (!response.ok) throw new Error(data.message || "Role update failed.");
                    // Update stored token and role
                    localStorage.setItem("noboghatToken", data.token);
                    localStorage.setItem("noboghatRole", data.role);
                    // Reload the page to reflect the new role
                    window.location.reload();
                } catch (error) {
                    if (roleError) {
                        roleError.textContent = error.message;
                        roleError.style.display = "block";
                    }
                    btn.disabled = false;
                    btn.innerHTML = btn.getAttribute("data-original-html") || btn.innerHTML;
                }
            });
            // Save original button HTML for restoration
            btn.setAttribute("data-original-html", btn.innerHTML);
        });
    }

    try {
        var profileResponse = await fetch(api.url("/api/users/profile"), { headers: api.authHeaders() });
        if (!profileResponse.ok) throw new Error("Your session has expired. Please sign in again.");
        var user = await profileResponse.json();

        // Check if user role is PENDING – show role selection modal
        if (user.role === "PENDING") {
            var setupMessage = new URLSearchParams(window.location.search).get("message");
            if (setupMessage && roleError) {
                roleError.textContent = setupMessage;
                roleError.style.display = "block";
            }
            
            var container = document.querySelector(".dashboard-container");
            if (roleModal) {
                showRoleModal();
                if (container) {
                    container.style.opacity = "0.3";
                    container.style.pointerEvents = "none";
                }
            } else {
                if (container) {
                    container.innerHTML = "<div class='error-state'><h2>Account Setup Incomplete</h2><p>Please contact support to assign a role to your account.</p></div>";
                } else {
                    alert("Account Setup Incomplete. Please contact support.");
                }
            }
            return; // Stop further dashboard loading
        }

        document.querySelectorAll("[data-user-name]").forEach(function (element) {
            element.textContent = user.name;
        });

        var role = document.querySelector("[data-user-role]");
        if (role) role.textContent = (user.role || "").replace("_", " ");
        var profileName = document.getElementById("profileName");
        var profilePhone = document.getElementById("profilePhone");
        var profilePicPreview = document.getElementById("profilePicturePreview");
        var profilePicUrl = document.getElementById("profilePictureUrl");
        if (profileName) profileName.value = user.name || "";
        if (profilePhone) profilePhone.value = user.phone || "";
        if (user.profilePictureUrl && profilePicPreview) {
            profilePicPreview.src = window.NoboGhatApi.url(user.profilePictureUrl);
            profilePicUrl.value = user.profilePictureUrl;
        }

        var profilePicInput = document.getElementById("profilePictureInput");
        if (profilePicInput) {
            profilePicInput.addEventListener("change", async function(e) {
                if (!e.target.files || e.target.files.length === 0) return;
                var file = e.target.files[0];
                var formData = new FormData();
                formData.append("file", file);
                try {
                    setProfileMessage("Uploading image...", "");
                    var resp = await fetch(window.NoboGhatApi.url("/api/files/upload"), {
                        method: "POST",
                        headers: window.NoboGhatApi.authHeaders(),
                        body: formData
                    });
                    if (!resp.ok) throw new Error("Upload failed");
                    var data = await resp.json();
                    profilePicPreview.src = window.NoboGhatApi.url(data.fileDownloadUri);
                    profilePicUrl.value = data.fileDownloadUri;
                    setProfileMessage("Image uploaded, click Save Changes.", "success");
                } catch (err) {
                    setProfileMessage(err.message, "error");
                }
            });
        }

        dashboardLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                var sectionKey = link.getAttribute("data-dashboard-link");
                if (!sectionKey) return;
                event.preventDefault();
                setActiveSection(sectionKey);
                var target = document.querySelector('[data-dashboard-section="' + sectionKey + '"]');
                if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });

        setActiveSection("overview");

        var bookingsResponse = await fetch(api.url("/api/bookings"), {
            headers: api.authHeaders()
        });

        if (!bookingsResponse.ok) throw new Error("Your bookings could not be loaded.");

        bookings = await bookingsResponse.json();
        renderBookings(bookings);
        renderTrips(bookings);
        var notificationsResponse = await fetch(api.url("/api/notifications"), { headers: api.authHeaders() });
        if (notificationsResponse.ok) {
            renderNotifications(await notificationsResponse.json());
        }

        if (profileForm) {
            profileForm.addEventListener("submit", async function (event) {
                event.preventDefault();
                var submitButton = profileForm.querySelector("button[type='submit']");
                if (submitButton) submitButton.disabled = true;
                setProfileMessage("Saving changes...", "");

                try {
                    var currentPasswordValue = document.getElementById("currentPassword").value.trim();
                    var newPasswordValue = document.getElementById("newPassword").value.trim();
                    var payload = {
                        name: document.getElementById("profileName").value.trim(),
                        phone: document.getElementById("profilePhone").value.trim() || null,
                        currentPassword: currentPasswordValue || null,
                        newPassword: newPasswordValue || null,
                        profilePictureUrl: document.getElementById("profilePictureUrl") ? document.getElementById("profilePictureUrl").value : null
                    };
                    var response = await fetch(api.url("/api/users/profile"), {
                        method: "PUT",
                        headers: Object.assign({ "Content-Type": "application/json" }, api.authHeaders()),
                        body: JSON.stringify(payload)
                    });
                    var data = await response.json();
                    if (!response.ok) throw new Error(data.message || "Profile update failed.");
                    document.querySelectorAll("[data-user-name]").forEach(function (element) { element.textContent = data.name; });
                    var roleNode = document.querySelector("[data-user-role]");
                    if (roleNode) roleNode.textContent = (data.role || "").replace("_", " ");
                    setProfileMessage(data.message || "Profile updated successfully.", "success");
                    profileForm.reset();
                    if (profileName) profileName.value = data.name || "";
                    if (profilePhone) profilePhone.value = data.phone || "";
                } catch (error) {
                    setProfileMessage(error.message, "error");
                } finally {
                    if (submitButton) submitButton.disabled = false;
                }
            });
        }
        // Deactivate account handler
        var deactivateBtn = document.getElementById("deactivateAccountBtn");
        if (deactivateBtn) {
            deactivateBtn.addEventListener("click", async function () {
                if (!confirm("Are you sure you want to deactivate your account? This cannot be undone.")) return;
                if (!confirm("All your active bookings will be cancelled. Proceed?")) return;
                try {
                    var resp = await fetch(api.url("/api/users/profile"), {
                        method: "DELETE",
                        headers: api.authHeaders()
                    });
                    if (!resp.ok) {
                        var err = await resp.json();
                        throw new Error(err.message || "Deactivation failed.");
                    }
                    localStorage.removeItem("noboghatToken");
                    localStorage.removeItem("noboghatRole");
                    window.location.replace("login.html?message=" + encodeURIComponent("Your account has been deactivated."));
                } catch (error) {
                    setProfileMessage(error.message, "error");
                }
            });
        }
    } catch (error) {
        console.error("Dashboard initialization error:", error);

        var summaryElement = document.getElementById("activeBookingsSummary");
        var tableBodyElement = document.getElementById("bookingHistoryBody");
        var tripsBodyElement = document.getElementById("myTripsBody");

        if (summaryElement) summaryElement.textContent = "Unable to load your data.";
        if (tableBodyElement) {
            tableBodyElement.innerHTML = "<tr><td colspan='8' style='color:red;'>" + error.message + "</td></tr>";
        }
        if (tripsBodyElement) {
            tripsBodyElement.innerHTML = "<tr><td colspan='5' style='color:red;'>" + error.message + "</td></tr>";
        }
    }
});
