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
                case 'loginPhone': formData['phone'] = inp.value.trim(); break;
                case 'loginPassword': formData['password'] = inp.value.trim(); break;
                case 'regName': formData['name'] = inp.value.trim(); break;
                case 'regPhone': formData['phone'] = inp.value.trim(); break;
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
});
