# refrigerator-app

冷蔵庫管理アプリ

## Environment variables

Create `.env` from `.env.example` in the project root.

```bash
cp .env.example .env
```

Default values:

- `DB_USER=postgres`
- `DB_PASSWORD=postgres`
- `DB_NAME=refrigerator`
- `DB_HOST=localhost` (for local `go run .`)
- `DB_PORT=5432` (for local `go run .`)

## Run with Docker Compose

```bash
docker compose up -d --build
```

Check backend logs:

```bash
docker compose logs -f backend
```

## Reset database when credentials changed

If DB credentials were changed after the first startup, existing `postgres_data` may still keep old credentials. Reset the DB volume:

```bash
docker compose down -v
docker compose up -d --build
```

## Run backend locally (without Docker backend container)

When running backend with `go run .`, `.env` must include `DB_HOST`/`DB_PORT`.

```bash
cd backend
go run .
```
