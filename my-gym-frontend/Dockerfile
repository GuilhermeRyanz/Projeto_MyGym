FROM node:21 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/my-gym-frontend/browser* usr/share/nginx/html
COPY nginx.conf etc/nginx/nginx.conf
COPY mime.types etc/nginx/mime.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
