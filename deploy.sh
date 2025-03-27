#!/bin/bash

# Navigate to the project directory
cd /opt/reelwin-panel

# Stop the current container
docker-compose down

# Rebuild the container with the new configuration
docker-compose up -d --build

# Show container status
echo "Container status:"
docker ps | grep reelwin

echo "Deployment completed"

docker-compose logs -f 