// src/constants/api.js

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://meetify.uz/api";
export const STORAGE_BASE = import.meta.env.VITE_STORAGE_BASE_URL || "http://meetify.uz/storage";


export const API = {
  // ---------- AUTH ----------
  AUTH: {
    REGISTER: (locale) => `${API_BASE}/${locale}/v1/auth/register`,
    LOGIN: (locale) => `${API_BASE}/${locale}/v1/auth/login`,
    LOGOUT: (locale) => `${API_BASE}/${locale}/v1/auth/logout`,
    FORGOT_PASSWORD: (locale) => `${API_BASE}/${locale}/v1/auth/forgot-password`,
    RESET_PASSWORD: (locale) => `${API_BASE}/${locale}/v1/auth/reset-password`,
    EMAIL_RESEND: (locale) => `${API_BASE}/${locale}/v1/email/resend`,
    EMAIL_VERIFY: (locale, id, hash) => `${API_BASE}/${locale}/v1/email/verify/${id}/${hash}`,
    GUEST_TOKEN: (locale) => `${API_BASE}/${locale}/v1/guest-token`,
  },

  // ---------- CATALOG ----------
  CATALOG: {
    LIST: (locale) => `${API_BASE}/${locale}/v1/catalogs`,
    DETAIL: (locale, id) => `${API_BASE}/${locale}/v1/catalogs/${id}`,
    CREATE: (locale) => `${API_BASE}/${locale}/v1/admin/catalogs`,
    UPDATE: (locale, id) => `${API_BASE}/${locale}/v1/admin/catalogs/${id}`,
    DELETE: (locale, id) => `${API_BASE}/${locale}/v1/admin/catalogs/${id}`,
  },

  // ---------- PRODUCTS ----------
  PRODUCT: {
    LIST: (locale) => `${API_BASE}/${locale}/v1/products`,
    DETAIL: (locale, slug) => `${API_BASE}/${locale}/v1/products/${slug}`,
    CREATE: (locale) => `${API_BASE}/${locale}/v1/admin/products`,
    UPDATE: (locale, id) => `${API_BASE}/${locale}/v1/admin/products/${id}`,
    DELETE: (locale, id) => `${API_BASE}/${locale}/v1/admin/products/${id}`,
    RECOMMENDED: (locale) => `${API_BASE}/${locale}/v1/recommendations`,
  },

  // ---------- CART ----------
  CART: {
    ADD: (locale) => `${API_BASE}/${locale}/v1/cart`,
    LIST: (locale) => `${API_BASE}/${locale}/v1/cart`,
    UPDATE: (locale) => `${API_BASE}/${locale}/v1/cart`,
    DELETE: (locale) => `${API_BASE}/${locale}/v1/cart`,
  },

  // ---------- CHECKOUT ----------
  CHECKOUT: {
    CREATE: (locale) => `${API_BASE}/${locale}/v1/checkout`,
  },

  // ---------- ORDERS ----------
  ORDER: {
    LIST: (locale) => `${API_BASE}/${locale}/v1/orders`,
    ADMIN_LIST: (locale) => `${API_BASE}/${locale}/v1/admin/orders`,
    ADMIN_UPDATE: (locale) => `${API_BASE}/${locale}/v1/admin/orders`,
  },

  // ---------- DISCOUNTS ----------
  DISCOUNT: {
    LIST: (locale) => `${API_BASE}/${locale}/v1/admin/discounts`,
    CREATE: (locale) => `${API_BASE}/${locale}/v1/admin/discounts`,
    DELETE: (locale, id) => `${API_BASE}/${locale}/v1/admin/discounts/${id}`,
  },

  // ---------- STATS (Admin) ----------
  STATS: {
    DASHBOARD: (locale) => `${API_BASE}/${locale}/v1/admin`,
  },

  // ---------- PAYMENT ----------
  PAYMENT: {                    
    STRIPE_WEBHOOK: (locale) => `${API_BASE}/${locale}/stripe/webhook`,
  },

  // ---------- POLICY / ROLES ----------
  POLICY: {
    CREATE_ROLE: (locale) => `${API_BASE}/${locale}/v1/admin/roles`,
    ASSIGN_PERMISSIONS: (locale) => `${API_BASE}/${locale}/v1/admin/roles/assign-permissions`,
    ASSIGN_ROLE: (locale, userId) => `${API_BASE}/${locale}/v1/admin/users/${userId}/assign-role`,
    UNASSIGN_ROLE: (locale, userId) => `${API_BASE}/${locale}/v1/admin/users/${userId}/unassign-role`,
  },
};
