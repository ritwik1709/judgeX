FROM docker:20.10.16-dind

# Install Node.js and npm
RUN apk add --update nodejs npm

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start Docker daemon and then the application
CMD ["sh", "-c", "dockerd & sleep 10 && npm start"] 