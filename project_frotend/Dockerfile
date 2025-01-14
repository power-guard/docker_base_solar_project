# frontend/Dockerfile
FROM node:16

WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy project files and build
COPY . .
RUN npm run build

# Serve built files
EXPOSE 3000
CMD ["npm", "start"]
