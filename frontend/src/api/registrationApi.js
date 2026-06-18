import axiosClient from "./axiosClient";

export const registerForEventApi = (eventId) =>
  axiosClient.post(`/events/${eventId}/register`).then((res) => res.data);

export const cancelRegistrationApi = (eventId) =>
  axiosClient.delete(`/events/${eventId}/register`).then((res) => res.data);

export const getMyRegistrationsApi = () =>
  axiosClient.get("/registrations/my").then((res) => res.data);