# This Dockerfile and the docker-compose.yaml file are only used for
# development.
# We based this file on the example found at https://hub.docker.com/r/denoland/deno

FROM denoland/deno:alpine-2.3.1

EXPOSE 8000

WORKDIR /app

COPY . .

# Build the application once which also caches the dependencies
RUN deno task build

CMD ["deno", "task", "start"]
