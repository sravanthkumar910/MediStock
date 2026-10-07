# Deploy MediStock on Render with Aiven MySQL

This project can be deployed as two Render services:

- `medistock-management-api`: Spring Boot backend, built from `backend/Dockerfile`
- `medistock-management-web`: React/Vite static frontend
- Aiven MySQL: external database; Render does not create or manage this database

## Before deploying

1. Push the project to a GitHub repository. This workspace is not currently a Git repository, so Render cannot deploy directly from it.
2. In Aiven, open the MySQL service and note its **public hostname**, **port**, database name, username, and password. Do not use the Aiven Console URL as the database hostname.
3. Confirm that Aiven accepts connections from the Render service's outbound IP addresses. Add the addresses shown by Render for the deployed backend to the Aiven IP allowlist. Avoid opening MySQL to all addresses if your Aiven plan provides a safer allowlist option.
4. Ensure the target Aiven database is the intended database: the backend updates its schema at startup (`ddl-auto: update`). Back up any important data before the first deployment.

## Create the Render services

1. In Render, choose **New + → Blueprint** and connect the GitHub repository.
2. Select the repository root containing `render.yaml`. Render will request values for the variables marked `sync: false`.
3. Enter the Aiven connection values:
   - `DB_HOST`: Aiven's public MySQL hostname
   - `DB_PORT`: Aiven's MySQL port
   - `DB_NAME`: the existing Aiven database name (often `defaultdb`; verify in Aiven)
   - `DB_USERNAME` and `DB_PASSWORD`: Aiven's database credentials
   - `DB_SSL_MODE`: already set to `REQUIRED` in the Blueprint, enabling TLS
4. Set `JWT_SECRET` to a newly generated Base64 key of at least 32 bytes. For example, generate one locally with `openssl rand -base64 48`; do not commit or share it.
5. Set `ADMIN_EMAIL` and a unique, strong `ADMIN_PASSWORD`. The bootstrap admin is created only when the database has no users. Demo inventory seeding is disabled for deployment.
6. Set `CORS_ORIGINS` to the exact frontend origin, with no trailing slash. With the default service name this is `https://medistock-management-web.onrender.com`. If Render assigns a different hostname, use that hostname instead.
7. Deploy the Blueprint. Wait for the API health check to pass and the static site deployment to complete.

The frontend's `VITE_API_BASE_URL` is a build-time setting and defaults in the Blueprint to `https://medistock-management-api.onrender.com/api`. If the backend's Render hostname differs, update this variable on the frontend service and trigger a new deploy. The static site must use the backend's HTTPS URL, not `/api`, because it is hosted separately.

## Verify after deployment

- Open `https://<backend-host>/api/actuator/health`; expect `{"status":"UP"}` and a healthy database component.
- Open `https://<frontend-host>` and sign in with the configured bootstrap account if this database had no existing users.
- Verify categories, medicines, suppliers, and purchase orders load. A browser CORS error usually means `CORS_ORIGINS` does not exactly match the frontend origin.
- Review Render and Aiven logs for database connectivity, TLS, or authentication failures. Do not paste database passwords or JWT secrets into issues, logs, or chat.

Render's free web service may sleep when idle, so its first request can take a while. Choose a paid service plan if the app needs consistent availability.
