FROM node:lts-slim
COPY . .
RUN npm install pnpm -g
RUN pnpm i
CMD ["pnpm", "dev"]