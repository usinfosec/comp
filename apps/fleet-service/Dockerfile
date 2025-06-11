# Use the official Bun image as a base image.
FROM oven/bun:1 as base

# The fleetctl package command requires 'cpio' to be installed.
# This command updates the package list and installs cpio.
RUN apt-get update && apt-get install -y cpio

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy package.json and bun.lockb to leverage Docker cache.
COPY package.json bun.lockb*

# Install application dependencies.
RUN bun install --frozen-lockfile

# Copy the rest of your application's source code.
COPY . .

# Expose the port your application will run on.
EXPOSE 3004

# The command to start your application.
CMD ["bun", "run", "src/index.ts"]
