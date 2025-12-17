const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Simple helper to include JWT token stored in localStorage
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json();
}

export const api = {
  register(email: string, password: string) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  login(email: string, password: string) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  getSummary() {
    return apiFetch('/summary');
  },
  listTransactions() {
    return apiFetch('/transactions');
  },
  createTransaction(data: Record<string, unknown>) {
    return apiFetch('/transactions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  listAccounts() {
    return apiFetch('/accounts');
  },
  createAccount(data: Record<string, unknown>) {
    return apiFetch('/accounts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
