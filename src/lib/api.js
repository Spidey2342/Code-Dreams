const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getToken() {
  return localStorage.getItem("codepath_token");
}

async function request(path, options = {}) {
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
    register: (body) =>
      request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) =>
      request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  },
user: {
  me: () => request("/api/user/me"),
  leaderboard: () => request("/api/user/leaderboard"),
  activity: () => request("/api/user/activity"),
},
 tracks: {
  getAll: () => request("/api/tracks"),
  getLessons: (slug) => request(`/api/tracks/${slug}/lessons`),
  getLesson: (slug, id) => request(`/api/tracks/${slug}/lessons/${id}`),
  completeLesson: (slug, id) =>
    request(`/api/tracks/${slug}/lessons/${id}/complete`, { method: "POST" }),
},
  code: {
  run: (code, language = "python") =>
    request("/api/code/run", { method: "POST", body: JSON.stringify({ code, language }) }),
},
referral: () => request("/api/user/referral"),
setReferralCode: (code) => request("/api/user/referral", { method: "POST", body: JSON.stringify({ code }) }),
};

  const API_URL = import.meta.env.VITE_API_URL || "https://code-dreams-backend.onrender.com";

export async function forgotPassword(email) {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export async function resetPassword(token, password) {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Reset failed");
  return data;
}

