# Use the official Node.js image based on Alpine
FROM node:alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node", "app.js"]