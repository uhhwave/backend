FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Prisma generate needs DATABASE_URL at build time (doesn't connect, just needs provider info)
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate

RUN npm run build

# ============================================
# Production stage - minimal runtime image
# ============================================
FROM node:22-alpine

WORKDIR /app

# Install curl for healthchecks (required by Coolify)
RUN apk add --no-cache curl

# Copy built output and runtime dependencies from builder
COPY --from=builder /app/.output .output
COPY --from=builder /app/generated generated
COPY --from=builder /app/prisma prisma
COPY --from=builder /app/prisma.config.ts prisma.config.ts
COPY --from=builder /app/node_modules node_modules

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node .output/server/index.mjs"]
