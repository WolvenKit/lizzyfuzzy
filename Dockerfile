FROM oven/bun:slim
WORKDIR /app
COPY . .
# RUN apt-get update -y && apt-get install -y openssl
RUN bun install
CMD ["bun", "prod"]