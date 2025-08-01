# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies first (for caching)
COPY package*.json ./
RUN npm install --production

# Copy the rest of app code (excluding ignored files)
COPY . .

# Ensure the utils directory is explicitly copied (optional if not excluded)
COPY ./utils ./utils

# Expose the port the app runs on
EXPOSE 4000

# Run the app
CMD ["node", "server.js"]
