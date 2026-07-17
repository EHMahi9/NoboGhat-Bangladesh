(() => {
  const localHosts = new Set(["localhost", "127.0.0.1"]);
  const apiBaseUrl = localHosts.has(window.location.hostname) ? "http://localhost:8080" : "";

  window.NoboGhatApi = {
    url(path) {
      return `${apiBaseUrl}${path}`;
    }
  };
})();
