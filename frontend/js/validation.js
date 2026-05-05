document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "http://127.0.0.1:8000/api/auth";

    // Helper to toggle error states on inputs
    const showError = (inputId, show, message = '') => {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(`${inputId}Error`);
        if (!input || !errorEl) return;
        
        if (show) {
            input.classList.remove('border-transparent', 'focus:border-purple-400', 'focus:ring-purple-100');
            input.classList.add('border-red-400', 'focus:border-red-500', 'focus:ring-red-100', 'bg-red-50/30');
            if (message) errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        } else {
            input.classList.remove('border-red-400', 'focus:border-red-500', 'focus:ring-red-100', 'bg-red-50/30');
            input.classList.add('border-transparent', 'focus:border-purple-400', 'focus:ring-purple-100');
            errorEl.classList.add('hidden');
        }
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Login Form Validation & API Call
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
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
                const btn = loginForm.querySelector('button');
                const originalBtnText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Signing in...';
                btn.disabled = true;

                try {
                    // FastAPI OAuth2 expects form data, not JSON for login
                    const formData = new FormData();
                    formData.append('username', email); // Using email as username
                    formData.append('password', password);

                    const response = await fetch(`${API_BASE_URL}/login`, {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();

                    if (response.ok) {
                        localStorage.setItem('access_token', data.access_token);
                        localStorage.setItem('token_type', data.token_type);
                        window.location.href = 'dashboard.html';
                    } else {
                        showError("password", true, data.detail || "Invalid email or password");
                        btn.innerHTML = originalBtnText;
                        btn.disabled = false;
                    }
                } catch (error) {
                    showError("password", true, "Connection failed. Is the server running?");
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                }
            }
        });
        
        ['email', 'password'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => showError(id, false));
        });
    }

    // Signup Form Validation & API Call
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
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

            if (password.length < 8) {
                showError("password", true, "Password must be at least 8 characters.");
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
                const originalBtnText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Creating account...';
                btn.disabled = true;

                try {
                    const response = await fetch(`${API_BASE_URL}/signup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: name,
                            email: email,
                            password: password
                        }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert("Account created successfully! Please login.");
                        window.location.href = 'login.html';
                    } else {
                        // Show server error (e.g. username taken)
                        const detail = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
                        showError("email", true, detail || "Signup failed");
                        btn.innerHTML = originalBtnText;
                        btn.disabled = false;
                    }
                } catch (error) {
                    showError("email", true, "Connection failed. Is the server running?");
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                }
            }
        });
        
        ['name', 'email', 'password', 'confirmPassword'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => showError(id, false));
        });
    }
});
