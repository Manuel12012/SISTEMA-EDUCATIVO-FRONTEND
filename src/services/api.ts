import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000"}); // https://sistema-educativo-backend-production.up.railway.app produccion

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});