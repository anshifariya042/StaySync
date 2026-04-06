FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install (better than npm install)
RUN npm ci

# Copy rest of files
COPY . .

# 🔥 FIX: Run tsc using node directly (bypass permission issue)
RUN node node_modules/typescript/bin/tsc

EXPOSE 5000

CMD ["npm", "start"]
