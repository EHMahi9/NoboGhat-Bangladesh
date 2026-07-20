module.exports = async (request, response) => {
  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    return response.status(500).json({ message: "BACKEND_API_URL is not configured." });
  }

  const path = Array.isArray(request.query.path) ? request.query.path.join("/") : request.query.path;
  const query = new URLSearchParams();
  Object.entries(request.query).forEach(([key, value]) => {
    if (key !== "path") query.set(key, Array.isArray(value) ? value[0] : value);
  });
  const target = `${backendUrl.replace(/\/$/, "")}/api/${path || ""}${query.size ? `?${query}` : ""}`;

  const headers = { "Content-Type": "application/json" };
  // Preserve the browser's JWT when a protected API request is proxied.
  if (request.headers.authorization) headers.Authorization = request.headers.authorization;
  const options = { method: request.method, headers };
  if (!["GET", "HEAD"].includes(request.method) && request.body !== undefined) {
    options.body = typeof request.body === "string" ? request.body : JSON.stringify(request.body);
  }

  try {
    const upstream = await fetch(target, options);
    const contentType = upstream.headers.get("content-type");
    if (contentType) response.setHeader("Content-Type", contentType);
    return response.status(upstream.status).send(await upstream.text());
  } catch {
    return response.status(502).json({ message: "The backend service is unavailable." });
  }
};
