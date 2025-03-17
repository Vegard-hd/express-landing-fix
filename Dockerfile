FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY bin/ ./bin/          
COPY src/ ./src/        
COPY app.js ./            
COPY . .                  
RUN npm run build
EXPOSE 3001
CMD ["node", "bin/www"]