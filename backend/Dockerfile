FROM node:18-slim

# Install required compilers and tools with minimal dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    python3 \
    default-jdk \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p /app/temp /app/cache

# Set environment variables for better performance
ENV NODE_ENV=production
ENV CXXFLAGS="-O2 -std=c++17"

# Expose the port your app runs on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"] 