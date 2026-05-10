const API_BASE_URL = "http://127.0.0.1:8000/api";

export const apiService = {
  // Login: Uses FormData as required by FastAPI OAuth2
  async login(email: string, pass: string) {
    const formData = new FormData();
    formData.append('username', email); // FastAPI OAuth2 uses 'username' field
    formData.append('password', pass);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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

  // Create Post: Uses Multipart/Form-Data
  async createPost(file: File, caption?: string, hashtags?: string) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('file', file);
    if (caption) formData.append('caption', caption);
    if (hashtags) formData.append('hashtags', hashtags);

    const response = await fetch(`${API_BASE_URL}/posts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Post creation failed');
    }

    return data;
  },

  // Get Posts
  async getPosts(skip: number = 0, limit: number = 10, type?: string) {
    const token = localStorage.getItem('access_token');
    const url = new URL(`${API_BASE_URL}/posts/`);
    url.searchParams.append('skip', skip.toString());
    url.searchParams.append('limit', limit.toString());
    if (type) url.searchParams.append('type', type);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to fetch posts');
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
