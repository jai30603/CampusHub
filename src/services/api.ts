import { ENV } from '@/config/env';

const BASE_URL = ENV.apiUrl || 'http://localhost:8000/api/v1';

export interface APIEnvelope<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}

/**
 * Global HTTP request wrapper for FastAPI backend
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIEnvelope<T>> {
  const token = localStorage.getItem('campushub_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Automatically handle 401 Unauthorized token expiration
    if (response.status === 401) {
      localStorage.removeItem('campushub_token');
      // If unauthorized on protected endpoint, notify app
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'An error occurred while communicating with server.';
      if (typeof data?.detail === 'string') {
        errorMessage = data.detail;
      } else if (Array.isArray(data?.detail)) {
        errorMessage = data.detail.map((err: any) => err.msg || err.message).join(', ');
      } else if (data?.message) {
        errorMessage = data.message;
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to communicate with server.');
  }
}
