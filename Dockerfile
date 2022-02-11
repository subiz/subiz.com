FROM node:alpine

RUN mkdir /app
WORKDIR /app

COPY blog ./blog
COPY docs ./docs
COPY docusaurus.config.js ./
COPY dropboxapi.js ./
COPY package.json ./
COPY sidebars.js ./
COPY static/ ./static
COPY src/ ./src
COPY data/ ./data

RUN npm i
RUN npm run build

EXPOSE 80
CMD npm run serve -- --port 80 --host 0.0.0.0
