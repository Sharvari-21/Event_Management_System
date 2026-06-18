import axiosClient from "./axiosClient";

export const registerApi = (payload) =>
  axiosClient.post("/auth/register", payload).then((res) => res.data);

export const loginApi = (payload) =>
  axiosClient.post("/auth/login", payload).then((res) => res.data);

export const getMeApi = () =>
  axiosClient.get("/auth/me").then((res) => res.data);