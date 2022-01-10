FROM node:16-slim AS base
RUN apt-get -qy update && apt-get -qy install openssl procps

WORKDIR /node

COPY package*.json ./
COPY prisma ./
RUN npm i && npm cache clean --force
RUN npx prisma generate

COPY . .

FROM base as dev
CMD ["npm", "run", "start:debug"]


FROM base as prod
RUN npm run build
CMD ["npm", "run", "start:prod"]

