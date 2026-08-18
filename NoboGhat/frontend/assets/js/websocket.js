(function () {
    "use strict";

    var stompClient = null;

    function connectWebSocket() {
        var user = localStorage.getItem("noboghatUser");
        if (!user) return; // Not logged in

        try {
            var userData = JSON.parse(user);
            var userId = userData.userId; // We don't have userId in localStorage initially, we might need to fetch profile first if not present
            
            // To make it robust, we need the userId to subscribe to /topic/notifications/{userId}
            // If we don't have it, we should get it.
            if (!userId) {
                fetch(window.NoboGhatApi.url("/api/users/profile"), {
                    headers: window.NoboGhatApi.authHeaders()
                }).then(res => res.json()).then(data => {
                    userData.userId = data.userId;
                    localStorage.setItem("noboghatUser", JSON.stringify(userData));
                    connectWithUserId(data.userId);
                }).catch(err => console.error("Could not fetch profile for WS", err));
            } else {
                connectWithUserId(userId);
            }
        } catch (e) {
            console.error("Error parsing user data for WS", e);
        }
    }

    function connectWithUserId(userId) {
        var socket = new SockJS(window.NoboGhatApi.url("/ws"));
        stompClient = Stomp.over(socket);
        
        // Disable STOMP debug logs in production
        stompClient.debug = null;

        stompClient.connect({}, function (frame) {
            console.log('Connected to WebSocket');
            
            stompClient.subscribe('/topic/notifications/' + userId, function (message) {
                var notification = JSON.parse(message.body);
                showToastNotification(notification.message);
                
                // If there's a notification badge, update it
                var notifBadge = document.getElementById("navNotificationBadge");
                if (notifBadge) {
                    notifBadge.style.display = "inline-flex";
                    notifBadge.textContent = "!";
                }
            });
        }, function(error) {
            console.error("WebSocket connection error:", error);
            // Reconnect after 5 seconds
            setTimeout(connectWebSocket, 5000);
        });
    }

    function showToastNotification(message) {
        var toast = document.createElement("div");
        toast.className = "toast show";
        toast.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: var(--bg-surface); border-left: 4px solid var(--accent); padding: 15px; box-shadow: var(--shadow-lg); border-radius: var(--radius-sm); z-index: 9999; display: flex; align-items: center; gap: 10px; animation: slideInRight 0.3s ease-out;";
        
        toast.innerHTML = `
            <i class="fa-solid fa-bell" style="color: var(--accent);"></i>
            <span style="color: var(--text-primary); font-size: 0.9rem;">${message}</span>
            <button style="background: none; border: none; cursor: pointer; color: var(--text-secondary); margin-left: 10px;" onclick="this.parentElement.remove()">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(function() {
            if(toast.parentElement) {
                toast.style.animation = "slideOutRight 0.3s ease-in forwards";
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Auto connect on load if session exists
    if (localStorage.getItem("noboghatToken")) {
        // Wait a small moment to ensure API script loaded
        setTimeout(connectWebSocket, 500);
    }

    // Expose for manual connect/disconnect if needed
    window.NoboGhatWebSocket = {
        connect: connectWebSocket,
        disconnect: function() {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
        }
    };
})();
