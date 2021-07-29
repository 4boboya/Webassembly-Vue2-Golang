FROM node:10
RUN rm -rf .env
COPY ./ /app

WORKDIR /app
RUN npm install && npm run build
FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
RUN apt-get update && apt-get install -y \
    zip
RUN zip /app/images /app/img/* -r
RUN zip /app/javascript /app/js/* -r
RUN zip /app/style /app/css/* -r
COPY docker-config/nginx.conf /etc/nginx/nginx.conf
