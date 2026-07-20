module.exports = (request, response) => {
  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    return response.status(500).json({ message: "BACKEND_API_URL is not configured." });
  }
  return response.redirect(302, `${backendUrl.replace(/\/$/, "")}/oauth2/authorization/google`);
};
