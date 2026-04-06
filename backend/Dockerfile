# ✅ Use correct Node version
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy project files
COPY . .

# ✅ BEST FIX: Use npx (no permission issues)
RUN npx tsc

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "start"]
