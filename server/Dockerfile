# Use AWS Lambda Node.js 20 base image for the build stage
FROM public.ecr.aws/lambda/nodejs:20 AS build

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install all dependencies, including dev dependencies (needed for building the project)
RUN npm install

# Copy the rest of the application's source code to the working directory
COPY . .

# Compile TypeScript files into JavaScript
RUN npm run build

# Remove dev dependencies to reduce image size and improve security
RUN npm prune --production

# Use a second stage to prepare the final production image
FROM public.ecr.aws/lambda/nodejs:20

# Set the working directory inside the container to AWS Lambda's default task root directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy only the built application code (dist folder) from the build stage
COPY --from=build /app/dist ${LAMBDA_TASK_ROOT}

# Copy the node_modules directory from the build stage to include required dependencies
COPY --from=build /app/node_modules ${LAMBDA_TASK_ROOT}/node_modules

# Copy package.json and package-lock.json for runtime reference
COPY --from=build /app/package*.json ${LAMBDA_TASK_ROOT}

# Set the environment to production for optimized performance
ENV NODE_ENV=production

# Define the command to run the Lambda function
CMD ["index.handler"]
