console.log("Hello! I am Mahi.");

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
});

document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault(); // ফর্ম সাবমিট হওয়ার পর পেজ রিলোড হওয়া বন্ধ করবে

    const userData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        role: document.getElementById("role").value
    };

    fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        alert("সফলভাবে রেজিস্ট্রেশন হয়েছে! User ID: " + data.userId);
    })
    .catch(error => {
        console.error("Error:", error);
        alert("কিছু ভুল হয়েছে, আবার চেষ্টা করুন।");
    });
});