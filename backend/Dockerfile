FROM node:18

# Install required compilers and tools
RUN apt-get update && apt-get install -y \
    g++ \
    python3 \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create temp directory
RUN mkdir -p /app/temp

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"] 