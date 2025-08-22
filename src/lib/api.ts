import axios from "axios";

const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081").replace(/\/$/, "");

export const api = axios.create({
  baseURL: base,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export const err = (e: any) => e?.response?.data?.error ?? e?.message ?? "Unexpected error";
/** Backward compat for old imports */
export const errMessage = err;
