const API_BASE_URL = "http://127.0.0.1:8001/api/auth";

export const apiService = {
  // Login: Uses FormData as required by FastAPI OAuth2
  async login(email: string, pass: string) {
    const formData = new FormData();
    formData.append('username', email); // FastAPI OAuth2 uses 'username' field
    formData.append('password', pass);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    // Store tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('token_type', data.token_type);
    
    return data;
  },

  // Signup: Uses JSON
  async signup(username: string, email: string, pass: string) {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password: pass,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const detail = Array.isArray(data.detail) ? data.detail[0].msg : data.detail;
      throw new Error(detail || 'Signup failed');
    }

    return data;
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  },

  // Check if logged in
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};
