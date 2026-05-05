document.addEventListener("DOMContentLoaded", () => {
    
    // Helper to toggle error states on inputs
    const showError = (inputId, show, message = '') => {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(`${inputId}Error`);
        if (!input || !errorEl) return;
        
        if (show) {
            // Add error styling
            input.classList.remove('border-transparent', 'focus:border-purple-400', 'focus:ring-purple-100');
            input.classList.add('border-red-400', 'focus:border-red-500', 'focus:ring-red-100', 'bg-red-50/30');
            if (message) errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        } else {
            // Remove error styling
            input.classList.remove('border-red-400', 'focus:border-red-500', 'focus:ring-red-100', 'bg-red-50/30');
            input.classList.add('border-transparent', 'focus:border-purple-400', 'focus:ring-purple-100');
            errorEl.classList.add('hidden');
        }
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Login Form Validation
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!isValidEmail(email)) {
                showError("email", true);
                isValid = false;
            } else {
                showError("email", false);
            }

            if (!password) {
                showError("password", true);
                isValid = false;
            } else {
                showError("password", false);
            }

            if (isValid) {
                // Simulate button loading state
                const btn = loginForm.querySelector('button');
                btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Signing in...';
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
            }
        });
        
        // Clear errors on input
        ['email', 'password'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => showError(id, false));
        });
    }

    // Signup Form Validation
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirm = document.getElementById("confirmPassword").value;

            if (!name.trim()) {
                showError("name", true);
                isValid = false;
            } else {
                showError("name", false);
            }

            if (!isValidEmail(email)) {
                showError("email", true);
                isValid = false;
            } else {
                showError("email", false);
            }

            if (password.length < 6) {
                showError("password", true);
                isValid = false;
            } else {
                showError("password", false);
            }

            if (password !== confirm || !confirm) {
                showError("confirmPassword", true, "Passwords do not match.");
                isValid = false;
            } else {
                showError("confirmPassword", false);
            }

            if (isValid) {
                const btn = signupForm.querySelector('button');
                btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Creating account...';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 800);
            }
        });
        
        ['name', 'email', 'password', 'confirmPassword'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => showError(id, false));
        });
    }
});
