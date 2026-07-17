async function loadDashboard() {
    try {
        const response = await fetch('http://localhost:8080/api/admin/dashboard');
        const data = await response.json();

        // HTML কার্ডগুলোতে ডাটা বসানো
        document.getElementById('totalUsers').innerText = data.totalUsers;
        document.getElementById('totalBoats').innerText = data.totalBoats;
        document.getElementById('totalBookings').innerText = data.totalBookings;
        document.getElementById('totalCargoWeight').innerText = data.totalCargoWeight + ' kg';
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// পেজ লোড হওয়ার সাথে সাথে ডাটা কল করা
loadDashboard();