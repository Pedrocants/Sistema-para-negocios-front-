# Etapa 1: Build
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN sed -i 's/listen       80;/listen 3000;/' /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
