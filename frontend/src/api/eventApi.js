import axiosClient from "./axiosClient";

export const getEventsApi = ({ page = 1, limit = 9, search = "", category = "All" } = {}) =>
  axiosClient
    .get("/events", { params: { page, limit, search, category } })
    .then((res) => res.data);

export const getEventByIdApi = (id) =>
  axiosClient.get(`/events/${id}`).then((res) => res.data);

export const createEventApi = (payload) =>
  axiosClient.post("/events", payload).then((res) => res.data);

export const updateEventApi = (id, payload) =>
  axiosClient.put(`/events/${id}`, payload).then((res) => res.data);

export const deleteEventApi = (id) =>
  axiosClient.delete(`/events/${id}`).then((res) => res.data);

export const getEventAttendeesApi = (id) =>
  axiosClient.get(`/events/${id}/attendees`).then((res) => res.data);