import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://meetify.uz/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach both user token and guest token
api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem("token");
  const guestToken = localStorage.getItem("guest_token");

  // Always include guest token
  if (guestToken) {
    config.headers["X-Guest-Token"] = guestToken;
  }

  // Add user token if exists
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

// ✅ Optional: auto-remove invalid guest token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (localStorage.getItem("guest_token")) {
        console.warn("⚠️ Guest token expired — removing");
        localStorage.removeItem("guest_token");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
