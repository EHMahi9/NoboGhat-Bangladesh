console.log("Hello! I am Mahi.");

// --- ১. হ্যামবার্গার মেনু কন্ট্রোল (Responsive Navbar) ---
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
});

// --- ২. রেজিস্ট্রেশন ফর্ম সাবমিশন এবং API কল ---
// ফর্মটিকে আইডি দিয়ে সিলেক্ট করা হলো
const registrationForm = document.getElementById("registrationForm");

// ফর্ম সাবমিট ইভেন্ট লিসেনার
registrationForm.addEventListener("submit", function(event) {
    // ফর্ম সাবমিট হওয়ার পর পেজ রিলোড হওয়া বন্ধ করবে
    event.preventDefault(); 
    console.log("Form submission intercepted!");

    // ইনপুট ফিল্ড থেকে ভ্যালু এক্সট্রাক্ট করা
    const nameValue = document.getElementById("regName").value;
    const phoneValue = document.getElementById("regPhone").value;
    const roleValue = document.getElementById("regRole").value;
    
    // কনসোলে চেক করার জন্য প্রিন্ট করা
    console.log("Name:", nameValue);
    console.log("Phone:", phoneValue);
    console.log("Role:", roleValue);

    // জাভাস্ক্রিপ্ট অবজেক্ট বা পেলোড (Payload) তৈরি
    const userRegistrationData = {
        name: nameValue,
        phone: phoneValue,
        role: roleValue
    };
    
    // অবজেক্টটিকে JSON স্ট্রিং-এ রূপান্তর
    const jsonPayload = JSON.stringify(userRegistrationData);
    console.log("Final Payload ready for backend:", jsonPayload);

    // Fetch API এর মাধ্যমে স্প্রিং বুট ব্যাকএন্ডে ডাটা পাঠানো
    fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonPayload 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("নেটওয়ার্ক রেসপন্স সঠিক ছিল না");
        }
        return response.json();
    })
    .then(data => {
        // সফলভাবে রেজিস্ট্রেশন হলে অ্যালার্ট দেখাবে
        alert("সফলভাবে রেজিস্ট্রেশন হয়েছে! User ID: " + data.userId);
    })
    .catch(error => {
        // কোনো এরর বা ভুল হলে কনসোল এবং অ্যালার্টে দেখাবে
        console.error("Error:", error);
        alert("কিছু ভুল হয়েছে, আবার চেষ্টা করুন।");
    });
});
