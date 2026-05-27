import { useState, useEffect } from "react";
import { api } from "../lib/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("codepath_token");
    if (!token) { setLoading(false); return; }

    api.user.me()
      .then(setUser)
      .catch(() => localStorage.removeItem("codepath_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    localStorage.setItem("codepath_token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await api.auth.register({ name, email, password });
    localStorage.setItem("codepath_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("codepath_token");
    setUser(null);
  };

  return { user, loading, login, register, logout };
}