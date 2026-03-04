import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  role?: 'attendee' | 'organizer';
  termsAccepted?: boolean;
}

export interface AuthResponse {
  access_token: string;
}

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, data);
    if (response.data.access_token) {
      Cookies.set('token', response.data.access_token, { expires: 7 });
    }
    return response.data;
  },

  signup: async (data: SignupPayload): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/signup`, data);
    if (response.data.access_token) {
      Cookies.set('token', response.data.access_token, { expires: 7 });
    }
    return response.data;
  },

  logout: (): void => {
    Cookies.remove('token');
  },

  getToken: (): string | undefined => {
    return Cookies.get('token');
  },
};
