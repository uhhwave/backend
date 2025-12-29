# BackendV2
follow me on [GitHub](https://github.com/FifthWit)

BackendV2 is a from scratch rewrite of movie-web's backend using [Nitro](https://nitro.build), and [Prisma](https://prisma.io). 

---

## what's new from this fork? 
PS: These changes were made with AI (Claude), incase you're weary of AI, you can use just the original repo, and I don't really plan on updating this fork

### Docker Compose (Recommended)
The easiest way to get up and running is using our pre-built image.

1. Create a `docker-compose.yml` file:
```yaml
services:
  postgres:
    image: postgres:18-alpine
    restart: unless-stopped
    healthcheck:
      test: [ 'CMD-SHELL', 'pg_isready -U $$PG_USER -d $$PG_DB' ]
      interval: 5s
      retries: 10
      timeout: 2s
    environment:
      - POSTGRES_USER=${PG_USER:-pstream_user}
      - POSTGRES_PASSWORD=${PG_PASSWORD:-password}
      - POSTGRES_DB=${PG_DB:-pstream_backend}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  p-stream:
    image: ghcr.io/uhhwave/backend:latest
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://${PG_USER:-pstream_user}:${PG_PASSWORD:-password}@postgres:5432/${PG_DB:-pstream_backend}?schema=public
      CRYPTO_SECRET: ${CRYPTO_SECRET:?required}
      TMDB_API_KEY: ${TMDB_API_KEY:?required}
      TRAKT_CLIENT_ID: ${TRAKT_CLIENT_ID:?required}
      TRAKT_SECRET_ID: ${TRAKT_SECRET_ID:?required}
      # Optional
      META_NAME: ${META_NAME:-}
      META_DESCRIPTION: ${META_DESCRIPTION:-}
      CAPTCHA: ${CAPTCHA:-false}
      CAPTCHA_CLIENT_KEY: ${CAPTCHA_CLIENT_KEY:-}
      CORS_ALLOWED_ORIGIN: ${CORS_ALLOWED_ORIGIN:-*}
      METRICS_SECRET: ${METRICS_SECRET:-}
    ports:
      - '3001:3000'
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres-data:
```

2. Create a `.env` file with your secrets:
```env
CRYPTO_SECRET=...
TMDB_API_KEY=...
TRAKT_CLIENT_ID=...
TRAKT_SECRET_ID=...
```

3. Run it:
```sh
docker compose up -d
```


### CORS Configuration
All origins are allowed by default. To restrict to specific domains, add to your `.env`:
```env
CORS_ALLOWED_ORIGIN='https://yourdomain.com'
```
For multiple domains:
```env
CORS_ALLOWED_ORIGIN='https://a.com,https://b.com'
```

### Metrics Protection
The `/metrics` endpoint exposes Prometheus metrics, so to protect it from scrapers and random people, add to your `.env`:
```env
METRICS_SECRET=your_secret_token
```
Then access metrics at: `/metrics?token=your_secret_token`

Without `METRICS_SECRET`, the endpoint stays open, no token required.

For Prometheus scraping, add to your `prometheus.yml`:
```yaml
scrape_configs:
  - job_name: 'pstream'
    static_configs:
      - targets: ['p-stream:3000']
    params:
      token: ['your_secret_token']
```
(If you don't use a metrics secret, you can just remove the `params` line)

### Grafana Dashboard
I didn't see any Grafana dashboards for this project so I made one, the pre-built Grafana dashboard is included at `grafana-dashboard.json`. 
Import it into Grafana to see:
- Request rates and latency percentiles
- Provider status and hostname stats
- Top watched media
- User counts by namespace
- Captcha success rates
---
---
## Deployment
There are multiple supported ways to deploy BackendV2 based on your needs:
### NixPacks
1. Install NixPacks with
```sh
# Mac
brew install nixpacks
# POSIX (mac, linux)
curl -sSL https://nixpacks.com/install.sh | bash
# Windows
irm https://nixpacks.com/install.ps1 | iex
```
2. Build the backend
```sh
nixpacks build ./path/to/app --name my-app # my-app will be the container name aswell
```
3. Run the container
```sh
docker run my-app
```
> [!TIP]
If you use a tool like Dokploy or Coolify, NixPacks support is out of the box
### Railpack
Railpack is the successor to NixPacks, to run the backend via Railpack:

1. Install [Railpack](https://railpack.com/installation)

2. Run BuildKit and set BuildKit host
```sh
docker run --rm --privileged -d --name buildkit moby/buildki

export BUILDKIT_HOST='docker-container://buildkit'
```

3. Build Backend
```sh
cd ./path/to/backend
railpack build .
```

4. Run Backend container
```sh
# Run manually
docker run -it backend
# Run in the background
docker run -d -it backend
```

5. Verify it's running
```sh
docker ps
# You should see backend, and buildkit running
```

### Manually
1. Git clone the environment
```sh
git clone https://github.com/p-stream/backend.git
cd backend
```
2. Build the backend
```sh
npm install && npm run build
```
3. Run the backend
```sh
node .nitro/index.mjs
```

## Setup your environment variables:
To run the backend you need environment variables setup
1. Create .env file
```sh
cp .env.example .env
```

2. Fill in the values in the .env file

> [!NOTE]
> for postgres you may want to use a service like [Neon](https://neon.tech) or host your own with docker, to do that just look it up

## Contributing
We love contributors, it helps the community so much, if you are interested in contributing here are some steps:

1. Clone the repo
```sh
git clone https://github.com/p-stream/backend.git
cd backend
```

2. Install Deps/Run the backend
```sh
npm install && npm run dev
```

3. Set your Environment variables: check above as there is a guide for it!

4. Make your changes! Go crazy, so long as you think it is helpful we'd love to see a Pull Request, have fun, this project is FOSS and done in my our maintainers free time, no pressure, just enjoy yourself

### Philosophy/Habits for devs
Here is a general rule of thumb for what your changes and developments should look like if you plan on getting it merged to the main branch:

- Use Prettier & ESLint: We aren't going to be crazy if it's not well formatted but by using the extensions it keeps our code consistent, which makes it a lot easier for maintainers to help merge your code
- Keep it minimal, things like Email are out of the question, we want to keep it small, if you think that it's **really** needed, make an issue on our GitHub to express your interest in it, and a maintainer will confirm or deny whether we would merge it
- Understand our tech stack, this is a generic piece of advice but if you haven't use NitroJS for example, read their docs and make sure you're familiar with the framework, it makes your code quality much better, and makes reviewing much easier

Star this repo and please follow me on [GitHub](https://github.com/FifthWit)!