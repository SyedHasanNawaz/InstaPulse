document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if user is logged in
    const token = localStorage.getItem('access_token');
    
    // List of pages that require a login
    const protectedPages = [
        'dashboard.html', 
        'feed-simulation.html', 
        'explore.html', 
        'profile.html', 
        'profile-settings.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !token) {
        // Not logged in, redirect to login
        window.location.href = 'login.html';
    }

    // 2. Handle Logout Buttons
    const logoutBtns = document.querySelectorAll(".logoutBtn, #logoutBtn");
    logoutBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Clear local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_type');
            
            // Redirect to login
            window.location.href = 'login.html';
        });
    });
});
