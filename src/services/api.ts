import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private token: string | null = null;

  async init() {
    this.token = await AsyncStorage.getItem('token');
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('token', token);
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        await this.clearToken();
        // Handle unauthorized
      }
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await this.setToken(response.access_token);
    return response;
  }

  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    await this.setToken(data.access_token);
    return data;
  }

  async googleAuth(googleData: any) {
    const response = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData),
    });
    await this.setToken(response.access_token);
    return response;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Profile endpoints
  async getProfile() {
    return this.request('/users/profile');
  }

  async createProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Friends endpoints
  async getFriends() {
    return this.request('/friends');
  }

  async createFriend(friendData: any) {
    return this.request('/friends', {
      method: 'POST',
      body: JSON.stringify(friendData),
    });
  }

  async updateFriend(friendId: string, friendData: any) {
    return this.request(`/friends/${friendId}`, {
      method: 'PUT',
      body: JSON.stringify(friendData),
    });
  }

  async deleteFriend(friendId: string) {
    return this.request(`/friends/${friendId}`, {
      method: 'DELETE',
    });
  }

  // Compatibility endpoints
  async getCompatibility(friendId: string) {
    return this.request(`/compatibility/${friendId}`);
  }

  async getAllCompatibilities() {
    return this.request('/compatibility/all');
  }
}

export default new ApiService();