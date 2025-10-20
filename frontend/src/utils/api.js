export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const authFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Automatically handle expired tokens
  if (res.status === 401) {
    console.warn("Token invalid or expired — logging out.");
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return res;
};

export const fetchCurrentTeams = async () => {
  const res = await authFetch("/api/projects/current-teams");
  return res.json();
};

