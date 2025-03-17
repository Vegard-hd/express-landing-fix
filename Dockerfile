# Use the official Node.js image based on Alpine
FROM node:22.9.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (including src/ and public/)
COPY . .

# Run the Tailwind build step after copying files
# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node", "/bin/www"]