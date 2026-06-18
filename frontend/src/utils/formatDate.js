export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (timeString) => {
  // timeString is stored as "HH:mm" (24h). Convert to a friendly 12h label.
  if (!timeString) return "";
  const [hoursStr, minutes] = timeString.split(":");
  const hours = parseInt(hoursStr, 10);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${period}`;
};

export const isPastEvent = (dateString) => new Date(dateString) < new Date();