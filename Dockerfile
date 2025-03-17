FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY tailwind.config.js ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "app.js"]