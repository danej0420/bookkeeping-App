const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function register(email: string, password: string) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export async function login(email: string, password: string) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export async function fetchSummary(token: string) {
  return request("/transactions/summary", {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function fetchTransactions(token: string) {
  return request("/transactions", {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function createTransaction(
  token: string,
  data: { accountId: number; date: string; description: string; amount: number; categoryId?: number }
) {
  return request("/transactions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}

export async function fetchAccounts(token: string) {
  return request("/accounts", {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function createAccount(token: string, data: { name: string; provider: string }) {
  return request("/accounts", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
}
