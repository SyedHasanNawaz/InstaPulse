const API_BASE_URL = "http://127.0.0.1:8000/api";
const ML_BASE_URL = "http://127.0.0.1:8000/api/ml";

// Helper for authenticated requests that handles 401 Unauthorized
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  
  return response;
}

export const apiService = {
  // Auth
  async login(credentials: any) {
    // OAuth2PasswordRequestForm expects x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', credentials.email); // standard oauth2 uses 'username' field
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(errorData.detail || 'Login failed');
    }
    
    const data = await response.json();
    // Save token to localStorage
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  async signup(fullName: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: fullName, // Mapping fullName to username as expected by backend
        email,
        password
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Signup failed' }));
      throw new Error(errorData.detail || 'Signup failed');
    }

    return await response.json();
  },

  async getMe() {
    const response = await authenticatedFetch(`${API_BASE_URL}/auth/me`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  },

  async updateMe(data: any) {
    const response = await authenticatedFetch(`${API_BASE_URL}/auth/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Update failed' }));
      throw new Error(errorData.detail || 'Update failed');
    }
    return await response.json();
  },

  // Posts
  async getPosts() {
    const response = await authenticatedFetch(`${API_BASE_URL}/posts`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return await response.json();
  },

  async createPost(formData: FormData) {
    const response = await authenticatedFetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to create post' }));
      throw new Error(errorData.detail || 'Failed to create post');
    }
    return await response.json();
  },

  // ML Services
  async getDashboardData() {
    const response = await authenticatedFetch(`${ML_BASE_URL}/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return await response.json();
  },

  // Get Optimization Advice
  async getOptimizationAdvice(category: string = "Technology", mediaType: string = "reel", followers: number = 5000, day: string = "Monday", hour: number = 12) {
    const params = new URLSearchParams({ 
      category, 
      media_type: mediaType, 
      followers: followers.toString(),
      day,
      hour: hour.toString()
    });
    const response = await authenticatedFetch(`${ML_BASE_URL}/optimize?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch optimization advice');
    return await response.json();
  },

  async refineCaption(caption: string) {
    const response = await authenticatedFetch(`${ML_BASE_URL}/refine-caption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption })
    });
    if (!response.ok) throw new Error('Failed to refine caption');
    return await response.json();
  },

  async getHistory() {
    const response = await authenticatedFetch(`${ML_BASE_URL}/history`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  }
};
