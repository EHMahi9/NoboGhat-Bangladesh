// Function to toggle between Login and Register tabs
function toggleAuth(tabName) {
    // Get DOM elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    // Hide any previous error
    document.querySelectorAll('.auth-error').forEach(function(el) { el.classList.remove('visible'); });
    // Re-enable submit buttons
    document.querySelectorAll('.auth-btn').forEach(function(btn) { btn.disabled = false; btn.textContent = btn.getAttribute('data-original-text') || btn.textContent; });

    if (tabName === 'login') {
        loginForm.classList.add('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.remove('active');
        registerForm.classList.add('hidden');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.remove('active');
        loginForm.classList.add('hidden');
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

// Shared submit helper - shows loading state, calls the API, handles errors
async function submitAuthForm(form, endpoint, button) {
    // Prevent double-submit
    if (button.disabled) return;
    
    // Hide any previous error
    var errorEl = form.querySelector('.auth-error');
    if (errorEl) errorEl.classList.remove('visible');

    var originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Processing...';

    try {
        // Map form field IDs to API field names expected by backend
        var inputs = form.querySelectorAll('input, select');
        var formData = {};
        for (var i = 0; i < inputs.length; i++) {
            var inp = inputs[i];
            if (!inp.id) continue;
            // Map frontend IDs to backend DTO field names
            switch (inp.id) {
                case 'loginEmail': formData['email'] = inp.value.trim(); break;
                case 'loginPassword': formData['password'] = inp.value.trim(); break;
                case 'regName': formData['name'] = inp.value.trim(); break;
                case 'regEmail': formData['email'] = inp.value.trim(); break;
                case 'regRole': formData['role'] = inp.value.trim(); break;
                case 'regPassword': formData['password'] = inp.value.trim(); break;
                default: formData[inp.id] = inp.value.trim(); break;
            }
        }

        var response = await fetch(window.NoboGhatApi ? window.NoboGhatApi.url(endpoint) : endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            var errData;
            try { errData = await response.json(); } catch(e) { errData = {}; }
            throw new Error(errData.message || errData.error || 'Request failed. Please try again.');
        }

        var result = await response.json();
        if (result.token) {
            localStorage.setItem('noboghatToken', result.token);
            localStorage.setItem('noboghatRole', result.role || '');
        }

        // Success - redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        if (errorEl) {
            errorEl.textContent = error.message || 'Could not connect to server. Please try again.';
            errorEl.classList.add('visible');
        } else {
            alert(error.message || 'Could not connect to server. Please try again.');
        }
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

// Handle Form Submissions
document.addEventListener('DOMContentLoaded', function() {
    var googleLogin = document.getElementById('googleLogin');
    if (googleLogin) {
        // Google OAuth is not configured for the production backend yet.
        googleLogin.addEventListener('click', function(e) {
            e.preventDefault();
            var errorEl = document.querySelector('.auth-error');
            if (errorEl) {
                errorEl.textContent = 'Google sign-in is not available yet. Please use email and password.';
                errorEl.classList.add('visible');
            }
        });
    }
    
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');

    // Save original button texts for loading state restoration
    document.querySelectorAll('.auth-btn').forEach(function(btn) {
        btn.setAttribute('data-original-text', btn.textContent);
    });

    // Login Action
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = loginForm.querySelector('.auth-btn');
            submitAuthForm(loginForm, '/api/auth/login', btn);
        });
    }

    // Register Action
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = registerForm.querySelector('.auth-btn');
            submitAuthForm(registerForm, '/api/auth/register', btn);
        });
    }

    // Check if the URL came with a hash (e.g., index.html#register)
    if (window.location.hash === '#register') {
        toggleAuth('register');
    }

    // ============ Password Recovery Modal (Task 3) ============
    var recoverModal = document.getElementById("recoverModal");
    var forgotPasswordLink = document.getElementById("forgotPasswordLink");
    var forgotPasswordForm = document.getElementById("forgotPasswordForm");
    var resetPasswordForm = document.getElementById("resetPasswordForm");
    var recoverMessage = document.getElementById("recoverMessage");
    var resetMessage = document.getElementById("resetMessage");

    function openRecoverModal() {
        if (!recoverModal) return;
        recoverModal.style.display = "flex";
        if (forgotPasswordForm) forgotPasswordForm.style.display = "block";
        if (resetPasswordForm) resetPasswordForm.style.display = "none";
        if (recoverMessage) { recoverMessage.textContent = ""; recoverMessage.hidden = true; }
        if (resetMessage) { resetMessage.textContent = ""; resetMessage.hidden = true; }
    }

    function closeRecoverModal() {
        if (recoverModal) recoverModal.style.display = "none";
    }

    if (forgotPasswordLink) forgotPasswordLink.addEventListener("click", function(e) {
        e.preventDefault();
        openRecoverModal();
    });
    var closeRecover = document.getElementById("closeRecoverModal");
    var closeRecover2 = document.getElementById("closeRecoverModal2");
    if (closeRecover) closeRecover.addEventListener("click", function(e) { e.preventDefault(); closeRecoverModal(); });
    if (closeRecover2) closeRecover2.addEventListener("click", function(e) { e.preventDefault(); closeRecoverModal(); });
    var backToForgot = document.getElementById("backToForgot");
    if (backToForgot) backToForgot.addEventListener("click", function(e) {
        e.preventDefault();
        if (forgotPasswordForm) forgotPasswordForm.style.display = "block";
        if (resetPasswordForm) resetPasswordForm.style.display = "none";
    });
    // Click outside modal to close
    if (recoverModal) recoverModal.addEventListener("click", function(e) {
        if (e.target === recoverModal) closeRecoverModal();
    });

    // Step 1: Submit email to get a token
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            var btn = forgotPasswordForm.querySelector("button[type='submit']");
            if (!btn) return;
            var originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = "Sending...";
            if (recoverMessage) { recoverMessage.textContent = ""; recoverMessage.hidden = true; }
            try {
                var email = document.getElementById("recoverEmail").value.trim();
                var response = await fetch(window.NoboGhatApi.url("/api/auth/forgot-password"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email })
                });
                var data;
                try { data = await response.json(); } catch (err) { data = {}; }
                if (!response.ok) throw new Error(data.message || "Could not request password reset.");
                if (recoverMessage) {
                    recoverMessage.textContent = data.message || "Token generated. Check the server console for your recovery token.";
                    recoverMessage.className = "booking-message success";
                    recoverMessage.hidden = false;
                }
                // Show step 2
                if (forgotPasswordForm) forgotPasswordForm.style.display = "none";
                if (resetPasswordForm) resetPasswordForm.style.display = "block";
            } catch (error) {
                if (recoverMessage) {
                    recoverMessage.textContent = error.message;
                    recoverMessage.className = "booking-message error";
                    recoverMessage.hidden = false;
                }
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }

    // Step 2: Submit token + new password
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            var btn = resetPasswordForm.querySelector("button[type='submit']");
            if (!btn) return;
            var originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = "Resetting...";
            if (resetMessage) { resetMessage.textContent = ""; resetMessage.hidden = true; }
            try {
                var token = document.getElementById("resetToken").value.trim();
                var newPassword = document.getElementById("resetNewPassword").value.trim();
                var response = await fetch(window.NoboGhatApi.url("/api/auth/reset-password"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: token, newPassword: newPassword })
                });
                var data;
                try { data = await response.json(); } catch (err) { data = {}; }
                if (!response.ok) throw new Error(data.message || "Password reset failed.");
                if (resetMessage) {
                    resetMessage.textContent = data.message || "Password reset successful. You can now sign in.";
                    resetMessage.className = "booking-message success";
                    resetMessage.hidden = false;
                }
                // After a short delay, close modal and let user log in
                setTimeout(function() {
                    closeRecoverModal();
                    if (forgotPasswordForm) forgotPasswordForm.style.display = "block";
                    if (resetPasswordForm) resetPasswordForm.style.display = "none";
                }, 1800);
            } catch (error) {
                if (resetMessage) {
                    resetMessage.textContent = error.message;
                    resetMessage.className = "booking-message error";
                    resetMessage.hidden = false;
                }
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    }
});
