# Base stage for building the React app
FROM node:alpine AS base

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .

# Development stage
FROM base AS development

# Expose port for development server
EXPOSE 3000

# Command for development
CMD ["npm", "start"]

# Production build stage
FROM base AS builder

# Build the React app for production
RUN npm run build

# Final stage for serving the app in production
FROM nginx:alpine AS production

# Copy the built app from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port for the production server
EXPOSE 80

# Command for production
CMD ["nginx", "-g", "daemon off;"]
