FROM node:lts-slim
COPY . .
RUN apt-get update -y && apt-get install -y openssl
RUN npm install pnpm -g
RUN pnpm i
CMD ["pnpm", "prod"]