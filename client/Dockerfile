# /client/Dockerfile
FROM node:14 AS react-build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the built app with Nginx
FROM nginx:alpine

# Remove default index.html if present
# RUN rm /usr/share/nginx/html/*

# Copy custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/nginx.conf

# The React app build files should be copied from the multi-stage build
# Assuming you use multi-stage builds in your React Dockerfile
COPY --from=react-build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
