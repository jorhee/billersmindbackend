# Use Node.js base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app will run on (Cloud Run expects this to be 8080)
EXPOSE 8080

# Set environment variables from Cloud Run
ENV MONGO_URI=${MONGO_URI}
ENV JWT_SECRET=${JWT_SECRET}
ENV PORT=${PORT}

# Start the app
CMD ["npm", "start"]
