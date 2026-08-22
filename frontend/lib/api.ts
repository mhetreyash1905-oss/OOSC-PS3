'use client';

import { getIdToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiFetch<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  // Get a fresh Firebase ID token (auto-refreshed if expired)
  const token = await getIdToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The request took too long. Please try again.');
    }
    throw new Error('Unable to reach CivicSaathi. Check your connection and try again.');
  } finally {
    window.clearTimeout(timeout);
  }

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Authentication expired. Please log in again.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${response.status}`);
  }

  // Handle PDF/blob responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/pdf')) {
    return response.blob() as unknown as T;
  }

  return response.json();
}
