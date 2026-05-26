const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getToken() {
  return localStorage.getItem("codepath_token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Something went wrong");

  return data;
}

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),

    login: (body: { email: string; password: string }) =>
      request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  },

  user: {
    me: () => request("/api/user/me"),
  },
};