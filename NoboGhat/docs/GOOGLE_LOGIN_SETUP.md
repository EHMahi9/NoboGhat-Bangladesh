# Enable Google login

The code is complete, but Google requires credentials owned by the project. This is the one manual step that cannot be done safely without access to your Google Cloud account.

1. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project.
2. Configure the OAuth consent screen. For testing, add your own Google account as a test user.
3. Create an **OAuth client ID** of type **Web application**.
4. Add these authorized redirect URIs exactly:
   * Local: `http://localhost:8080/login/oauth2/code/google`
   * Deployed: `https://YOUR-RENDER-DOMAIN/login/oauth2/code/google`
5. Put the client ID and client secret in `backend/.env` locally, or Render environment variables in production:

```properties
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID=...
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=...
FRONTEND_URL=http://localhost:5500
```

For Render, set `FRONTEND_URL` to your frontend static site URL. The `render.yaml` blueprint handles all environment variables automatically for both backend and frontend services.

The login button starts the standard Spring Security path. Google verifies the identity, the API creates or reuses a local Google user by email, creates a NoboGhat JWT, and returns the user to the dashboard. Google users are initially `FARMER`; an administrator can later add a role-selection/approval process.

Spring Boot recognizes Google as a common OAuth provider when the registration credentials are supplied, and Spring Security's default authorization path is `/oauth2/authorization/google`. See [Spring Boot OAuth2 documentation](https://docs.spring.io/spring-boot/reference/security/oauth2.html) and [Spring Security OAuth2 login documentation](https://docs.spring.io/spring-security/reference/7.0/servlet/oauth2/login/core.html).
