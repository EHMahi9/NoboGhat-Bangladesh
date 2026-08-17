# Render + Oracle MySQL deployment

NoboGhat keeps its static frontend on Vercel, its Spring Boot backend on Render,
and its MySQL database on Oracle Cloud MySQL HeatWave Always Free. No Railway
service or database is required by the application configuration.

## Oracle Cloud MySQL

1. In your Oracle Cloud home region, create an **Always Free MySQL DB System**
   using the `MySQL.Free` shape and create the NoboGhat database and a dedicated
   application user.
2. Configure a VCN/subnet and the DB system endpoint according to Oracle's
   current MySQL HeatWave documentation. If a public endpoint is required for
   Render, allow TCP `3306` only from the smallest source range Oracle permits.
   Render Free does not provide a stable outbound IP, so IP allow-listing may not
   be practical; do not expose `0.0.0.0/0` without accepting that risk.
3. Use Oracle's TLS requirements and CA material. Keep certificate verification
   enabled. Put any Oracle-provided Connector/J TLS options in
   `SPRING_DATASOURCE_URL`; do not add `trustServerCertificate=true`.
4. Record the actual JDBC URL, database username, and password. These values are
   intentionally not present in this repository.

## Render

1. Create a **Web Service** from this repository, using `render.yaml` or Docker
   root `backend`, Dockerfile `backend/Dockerfile`, Java 21, and health check
   `/actuator/health`.
2. Set these environment variables in Render:

   `SPRING_PROFILES_ACTIVE`, `SPRING_DATASOURCE_URL`,
   `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`,
   `SPRING_JPA_HIBERNATE_DDL_AUTO`, `FRONTEND_URL`,
   `CORS_ALLOWED_ORIGINS`, `JWT_SECRET`, `JWT_EXPIRATION_MS`,
   `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID`,
   `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET`.

   Use `production`, `update`, and `86400000` for the non-secret profile,
   schema, and token-expiration values respectively. Set both frontend variables
   to `https://noboghatbangladesh.vercel.app`. Generate a fresh JWT secret with
   at least 32 random characters.
3. Deploy and copy the generated HTTPS Render service URL. Verify
   `https://YOUR-RENDER-DOMAIN/actuator/health` returns `UP`.

## Vercel frontend

Set `frontend/assets/js/config.js` before deploying the frontend:

```js
window.NoboGhatConfig = { apiBaseUrl: "https://YOUR-RENDER-DOMAIN" };
```

This is the sole production API setting. Static Vercel HTML cannot read runtime
environment variables without a build/injection step, so do not put secrets
there. Redeploy Vercel after setting the URL.

## Google OAuth

In Google Cloud Console, update the authorized redirect URI to:

`https://YOUR-RENDER-DOMAIN/login/oauth2/code/google`

Keep the local URI only if you still develop locally:

`http://localhost:8080/login/oauth2/code/google`

## Database initialization

Hibernate with `SPRING_JPA_HIBERNATE_DDL_AUTO=update` is the one schema creation
strategy for a new Oracle database. `database/schema.sql` and
`database/migration-v2-auth.sql` are retained for reference/existing-database
migration and are not run automatically. Back up any Railway data before
manually importing it into Oracle.
