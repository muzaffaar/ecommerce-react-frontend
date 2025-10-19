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

// ✅ Response interceptors for guest token + email verification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;

    // ⚠️ Auto-remove expired guest token
    if (res?.status === 401 && localStorage.getItem("guest_token")) {
      console.warn("⚠️ Guest token expired — removing");
      localStorage.removeItem("guest_token");
    }

    // 🚫 Handle email not verified (localization-safe)
    if (res?.status === 403 && res.data?.code === "EMAIL_NOT_VERIFIED") {
      // Store verification notice temporarily
      localStorage.setItem(
        "verify_notice",
        JSON.stringify({
          message: res.data.message,
          resend_url: res.data.resend_url,
        })
      );

      // Redirect to verify notice page
      window.location.href = "/verify-notice";
    }

    return Promise.reject(error);
  }
);

export default api;
