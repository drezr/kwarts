## Setup

Run:

```bash
sh setup.sh
```

On `schema.prisma` updates run:

```bash
sh migrate.sh MIGRATIONNUMBER
```

Create `kwarts/.env` file with:

```
DATABASE_URL="file:PATH_TO_DB"
EMAIL_HOST="YOUR_EMAIL_HOST"
EMAIL_PORT="YOUR_EMAIL_PORT"
EMAIL_USER="YOUR_EMAIL_USER"
EMAIL_PASSWORD="YOUR_EMAIL_PASSWORD"
WEBSITE_HOST="YOUR_WEBSITE_HOST"
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```
