
# Use the official Node.js image
FROM node:20.13.1

# Set working directory
WORKDIR /app

# Copy all code into the container
COPY . .

# Install dependencies
RUN npm install

# Install yalc globally
RUN npm install yalc -g

# Lint and build db-models
RUN npx nx run db-models:lint
RUN npx nx run db-models:build

# Build admin-user-ms for production
RUN npx nx run admin-user-ms:build --configuration=production

# Go to /dist/shared/db-models/
WORKDIR /app/dist/shared/db-models/
RUN yalc publish --private

# Go to /dist/apps/admin-user-ms
WORKDIR /app/dist/apps/admin-user-ms/
RUN yalc add @condo-server/db-models@0.0.1

# Install dependencies
RUN npm install

# Copy environment variables
COPY .env /app/dist/apps/admin-user-ms/

# Command to run the application
CMD ["node", "main.js"]
