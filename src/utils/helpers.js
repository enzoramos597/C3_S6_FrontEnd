export const getAbsoluteImageUrl = (poster) => {
  if (!poster) return "";

  // Si viene completa (http, https)
  if (poster.startsWith("http")) {
    return poster;
  }

  // Si viene relativa desde tu backend
  return `${import.meta.env.VITE_API_BASEURL}/${poster}`;
};
