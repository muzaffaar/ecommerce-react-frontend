import { API } from "../constants/api";

export const fetchProducts = async (locale = "en", params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API.PRODUCT.LIST(locale)}?${query}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
  return res.json();
};
