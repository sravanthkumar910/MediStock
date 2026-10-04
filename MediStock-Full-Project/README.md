# MediStock

Medical inventory management for pharmacies and healthcare organizations. The project includes a React/Vite frontend, Spring Boot REST API, MySQL database, JWT authentication, role-based permissions, inventory alerts, analytics, reports, and Docker Compose configuration.

## Project Structure

```text
MediStock-Full-Project/
|-- backend/             Spring Boot 3 / Java 17 REST API
|-- frontend/            React 18 / Vite / Tailwind application
|-- database/            MySQL schema and optional seed data
|-- docker-compose.yml   Complete local stack: MySQL, API, frontend
`-- README.md            Setup, run, API, and milestone notes
```

## Prerequisites

For the recommended Docker run, install Docker Desktop and start its engine. For running services individually, install Java 17+, Maven 3.8+, Node.js 18+, npm, and optionally MySQL 8.

Open PowerShell in the project root, the directory containing `docker-compose.yml`:

```powershell
cd path\to\MediStock-Full-Project
```

## Run the Whole Project with Docker

From that project root:

```powershell
docker compose up --build -d
docker compose ps
```

Open the app at <http://localhost:5174>. The backend API is at <http://localhost:8080/api>; Swagger UI is at <http://localhost:8080/api/docs/swagger-ui.html>. Compose starts MySQL, waits for database and API health checks, then starts the frontend. MySQL data is persisted in the `medistock_mysql_data` volume.

Useful lifecycle commands:

```powershell
docker compose logs -f                 # Follow service logs; Ctrl+C exits log view
docker compose restart                 # Restart services
docker compose down                    # Stop services and keep database data
docker compose down -v                 # Stop services AND delete database data
```

The local Compose database credentials are `root` / `root`; do not use these defaults in production. Local startup seeds `admin@medistock.com` / `Admin@123`; production Compose requires separate administrator credentials and does not seed demo inventory.

## Deploy the Whole Project to a VPS

The production Compose setup runs MySQL, the Spring API, the React frontend, and Caddy for HTTPS. It is intended for a Linux VPS with Docker Compose v2 and a domain name. Point the domain's DNS A/AAAA records to the VPS, then allow inbound TCP ports 80 and 443 (plus SSH for administration). The database and API are private to the Compose network; only Caddy is public.

On the VPS, clone the project and prepare a private environment file:

```sh
cp .env.production.example .env.production
chmod 600 .env.production
openssl rand -base64 48
openssl rand -hex 32
```

Put the domain, generated JWT secret, separate database/root passwords, and a strong initial admin email/password in `.env.production`. Never commit that file. Validate and launch the stack:

```sh
docker compose --env-file .env.production -f docker-compose.prod.yml config
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

Caddy obtains and renews the TLS certificate automatically after DNS points to the VPS. Open `https://<APP_DOMAIN>` and verify `https://<APP_DOMAIN>/api/actuator/health` reports `UP`. The first admin is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` only when the users table is empty. Change that password after first login.

Back up the database off the VPS before upgrades and regularly thereafter:

```sh
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T mysql \
	sh -c 'mysqldump -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' \
	> "medistock-$(date +%F).sql"
```

Before upgrading an existing database, check for repeated medicine/batch pairs before starting the new backend, which adds a unique index:

```sh
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T mysql \
  sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SELECT LOWER(TRIM(name)) AS medicine, LOWER(TRIM(batch_number)) AS batch, COUNT(*) AS duplicate_count FROM medicines GROUP BY LOWER(TRIM(name)), LOWER(TRIM(batch_number)) HAVING COUNT(*) > 1;"'
```

If any rows are returned, back up first and reconcile those batches and their stock/order history before upgrading; do not delete inventory rows without checking quantities and references.

For an upgrade, pull the reviewed source and rebuild the app services with the same Compose command. Do not use `docker compose down -v`; it deletes the persistent database volume. Restrict access to `.env.production` and store database backups off-site.

## Deploy to Render (Beginner Guide)

Render can host the frontend and Spring backend. This project uses MySQL, so create a separate MySQL 8 database with a provider that allows connections from Render and supports the TLS mode required by that provider. Do not choose PostgreSQL unless you intend to migrate the backend and database schema.

Before using a free/shared database, confirm that remote connections from Render are allowed, note the provider's TLS instructions, and check its data limits and backup policy. Do not store real patient or other sensitive personal data on an unverified free database. Rotate any exposed database password before deployment and never commit credentials to source control.

### 1. Push this project to GitHub

Create a GitHub repository for the `MediStock/MediStock-Full-Project` folder and push the project. Do not commit `.env.production`, database passwords, JWT secrets, or administrator passwords. Render will read the source from GitHub.

### 2. Prepare the MySQL database

Create a MySQL 8 database with your provider. Keep the connection details available: host, port, database name, username, and a newly rotated password. Confirm whether the provider requires TLS and whether it requires an IP allowlist for Render.

### 3. Deploy the backend first

In Render, select **New +** > **Web Service**, connect your GitHub repository, and configure:

- Root Directory: `MediStock-Full-Project/backend`
- Runtime: **Docker**
- Dockerfile Path: `Dockerfile`
- Health Check Path: `/api/actuator/health`

Under the backend service's **Environment** settings, add the following. Enter the host, port, database name, and username from your database provider. Enter the rotated database password directly in Render; never put it in project files or source control.

| Key | Value |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | `mysql` |
| `DB_HOST` | MySQL provider host |
| `DB_PORT` | MySQL provider port, commonly `3306` |
| `DB_NAME` | MySQL database name |
| `DB_USERNAME` | MySQL database username |
| `DB_PASSWORD` | Newly rotated MySQL password |
| `DB_SSL_MODE` | TLS mode required by the provider; use `REQUIRED` only if supported |
| `JWT_SECRET` | A unique secret generated with `openssl rand -base64 48` |
| `CORS_ORIGINS` | `https://medistock-web-management.netlify.app` |
| `ADMIN_EMAIL` | Email for your first administrator |
| `ADMIN_PASSWORD` | A strong initial administrator password |
| `SEED_DEMO_INVENTORY` | `false` |

Deploy the backend and wait for it to report healthy. Copy its Render URL. Check `https://<backend-url>/api/actuator/health`; the response should report `UP`. If the database connection fails, check the provider's remote-access and TLS requirements before changing the SSL mode.

### 4. Deploy the frontend

In Render, select **New +** > **Static Site** and connect the same GitHub repository. Configure:

- Root Directory: `MediStock-Full-Project/frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`

Set the build environment variable `VITE_API_BASE_URL` to `https://medistock-web-management.onrender.com` (the frontend adds the `/api` path automatically). Add a rewrite rule from `/*` to `/index.html`, then deploy. Copy the frontend URL.

### 5. Connect and test the services

Return to the backend's Render **Environment** settings. Set `CORS_ORIGINS=https://medistock-web-management.netlify.app` (the frontend origin exactly, including `https://` and without a trailing slash), then redeploy the backend. Open the frontend URL and sign in using the administrator credentials you configured. Test creating and editing a medicine.

The first administrator is created only when the users table is empty. Back up your database regularly. The browser frontend calls the Spring API; it must not connect directly to MySQL. For Render's service settings, see [Docker web services](https://render.com/docs/docker) and [static sites](https://render.com/docs/static-sites).

## Run Services Individually

### Backend with H2 (no MySQL required)

In PowerShell window 1:

```powershell
cd backend
mvn spring-boot:run '-Dspring-boot.run.profiles=dev'
```

The API listens on port 8080. H2 is in-memory; its data is lost when the process stops.

### Backend with local MySQL

Start MySQL, create/select database `medistock_db`, and configure the connection in the same PowerShell session:

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_NAME = "medistock_db"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your-mysql-password"
```

Hibernate creates/updates tables on startup. Optional SQL files can be loaded from the project root if the MySQL client is installed:

```powershell
Get-Content .\database\schema.sql | mysql -u root -p
Get-Content .\database\seed-data.sql | mysql -u root -p
```

Then run in the backend directory:

```powershell
cd backend
mvn spring-boot:run
```

### Frontend dev server

With the backend running, open PowerShell window 2:

```powershell
cd frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

Open <http://localhost:5173>. The Vite development server proxies `/api` to `http://localhost:8080`. Build the static frontend with `npm run build`; output is in `frontend/dist`.

## Verify the Project

From the project root, run the automated checks:

```powershell
Push-Location .\backend
mvn test
Pop-Location

Push-Location .\frontend
npm ci
npm run build
Pop-Location
```

When using Docker Compose, smoke-test both services:

```powershell
Invoke-WebRequest http://localhost:8080/api/actuator/health -UseBasicParsing
Invoke-WebRequest http://localhost:5174 -UseBasicParsing
```

Both requests should return HTTP 200; the backend health body should report `UP`. The backend test suite currently contains one service test, so passing it is not a substitute for comprehensive integration and browser tests. The frontend build may print a non-blocking large JavaScript chunk warning.

## Implemented Features

- JWT login/refresh and backend role-based authorization for Admin, Pharmacist, and Staff.
- Medicine, category, supplier, purchase order, and user management.
- Stock-in, stock-out, adjustment, purchase-order receipt, and stock movement audit history.
- Expiry status tracking, near-expiry and expired medicine queries, and a configurable 30-day alert window.
- Low-stock and out-of-stock alerts based on each medicine's reorder level.
- In-app notifications from scheduled daily and manual inventory scans. Optional SMTP email is supported; push and SMS providers are not configured.
- Live `/dashboard/summary` inventory analytics. The dashboard reads summary KPIs and builds its seven-day stock movement chart from backend stock logs.
- Inventory CSV and inventory, expiry, low-stock, and supplier PDF reports. Other CSV report views are built in the frontend from currently loaded data.
- Dockerfiles and Compose configuration for a local MySQL + backend + frontend stack.

## Milestones 3 and 4

### Milestone 3: Week 5 and 6 — Expiry Tracking and Notifications

Expiry tracking, low-stock/out-of-stock alerts, scheduled/manual in-app notifications, optional SMTP notifications, dashboard analytics API, and CSV/PDF report generation are implemented. Firebase push and SMS integrations are not configured.

### Milestone 4: Week 7 and 8 — Analytics, Testing, and Deployment

The dashboard charts and report screens use live inventory/stock-log data; Maven tests and frontend production builds are available; Docker Compose runs all three local services. Production cloud deployment is not included or performed by these commands.

Before describing the application as production-deployed, provision AWS, Render, Railway, or another host and a persistent managed database; set strong production-only database credentials and a new Base64 `JWT_SECRET`; set exact production `CORS_ORIGINS`; configure HTTPS/SSL, SMTP if needed, database backups, and authenticated end-to-end tests. No cloud deployment or production SSL configuration is performed by this repository or the local run commands. Email currently targets the configured SMTP username and should be changed to an appropriate administrator distribution list for production.

## Configuration

Spring Boot reads environment variables directly and does not load a `.env` file by itself. Configure variables in the shell or hosting provider:

| Variable | Purpose |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` | MySQL connection |
| `JWT_SECRET` | Base64 JWT signing key; replace the development default in production |
| `JWT_EXPIRATION_MS`, `JWT_REFRESH_EXPIRATION_MS` | Access and refresh token lifetimes |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | Optional SMTP notifications |
| `VITE_API_BASE_URL` | Frontend build-time API base URL; default `/api` uses the included Nginx proxy |

For separate hosted frontend and API services, build the frontend with `VITE_API_BASE_URL=https://<your-api-host>/api`, and set backend `CORS_ORIGINS` to the exact HTTPS frontend origin. In Compose, the frontend build argument can be provided through the `VITE_API_BASE_URL` environment variable before `docker compose up --build`.

## REST API Overview

Base URL: `http://localhost:8080/api`. Except for authentication routes, requests require `Authorization: Bearer <accessToken>`.

| Feature | Routes |
|---|---|
| Authentication | `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh` |
| Users | `/users` (Admin) |
| Categories | `/categories` |
| Suppliers | `/suppliers` |
| Medicines | `/medicines` including `/{id}/stock` and `/alerts/low-stock`, `/out-of-stock`, `/near-expiry`, `/expired` |
| Stock history | `GET /stock-logs?medicineId=&page=&size=` |
| Purchase orders | `/purchase-orders`, including `/{id}/receive` |
| Notifications | `/notifications`, `/notifications/unread-count`, `POST /notifications/scan` |
| Analytics | `GET /dashboard/summary` |
| CSV export | `GET /reports/inventory/export` |
| PDF reports | `GET /reports/inventory/pdf`, `/reports/expiry/pdf`, `/reports/lowstock/pdf`, `/reports/supplier/pdf` |

See Swagger UI at <http://localhost:8080/api/docs/swagger-ui.html> for request schemas and authorization details.

## Troubleshooting

- `mvn` or `java` is not recognized: install Java 17+ and Maven, then restart PowerShell.
- MySQL connection fails: check that MySQL is running and that `DB_*` values match its credentials; H2 dev mode avoids MySQL.
- Frontend cannot reach the API: check that the backend is healthy and use the `/api` base URL; the Vite and Docker Nginx proxies expect the backend on port 8080 or Compose service `backend`.
- A port is already in use: stop the process bound to 3306, 8080, 5173, or 5174, or change the port mapping/configuration.
- Docker database reset: `docker compose down -v` deletes stored local database data.
