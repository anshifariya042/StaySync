# ✅ Use correct Node version (important)
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# 👉 FIX: Ensure TypeScript runs properly
RUN chmod +x ./node_modules/.bin/tsc

# Copy all files
COPY . .

# 🔥 BUILD your project (this creates dist/)
RUN npm run build

# Expose port
EXPOSE 5000

# Start app
CMD ["npm", "start"]
