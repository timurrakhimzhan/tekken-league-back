FROM node:16-slim AS development
RUN apt-get -qy update && apt-get -qy install openssl procps
RUN apt-get install -y build-essential python

WORKDIR /node

COPY package*.json ./
COPY prisma ./
RUN npm i && npm cache clean --force
RUN npx prisma generate

COPY . .

