# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.0.4
FROM oven/bun:${BUN_VERSION} as base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

COPY src src
COPY public public

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Install node modules
COPY --link bunfig.toml bun.lockb package.json ./
RUN bun install --ci

# Build application
COPY --link Makefile tailwind.config.js build.js tsconfig.json ./
COPY src src
RUN make bundle-styles && \
    make bundle -s

# Copy application code
COPY --link . .

# Final stage for app image
FROM base

# Copy built application
COPY --link tsconfig.json ./
COPY --from=base /app ./
COPY --from=base /app/public ./public
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "src/index.ts" ]
