#!/bin/bash

# Navigate to the project directory
cd /opt/reelwin-panel

# Stop any Docker containers that might be using port 3003
if command -v docker &> /dev/null; then
    echo "Checking for Docker containers using port 3003..."
    DOCKER_CONTAINER=$(docker ps --format "{{.ID}} {{.Names}}" | grep -E "(3003|reelwin)" | awk '{print $1}' | head -1)
    if [ ! -z "$DOCKER_CONTAINER" ]; then
        echo "Stopping Docker container: $DOCKER_CONTAINER"
        docker stop $DOCKER_CONTAINER
    fi
    
    # Try to stop via docker-compose if it exists
    if [ -f "docker-compose.yaml" ] || [ -f "docker-compose.yml" ]; then
        echo "Stopping docker-compose services..."
        docker-compose down 2>/dev/null || true
    fi
    
    # Check if port 3003 is still in use by Docker proxy
    if lsof -i :3003 2>/dev/null | grep -q docker-proxy; then
        echo "Killing docker-proxy process on port 3003..."
        sudo kill $(lsof -ti :3003) 2>/dev/null || true
        sleep 2
    fi
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci --production=false
fi

# Build the application
echo "Building application..."
npm run build

# Check if PM2 process is running
if pm2 list | grep -q "reelwin-panel"; then
    echo "Restarting existing PM2 process..."
    pm2 restart reelwin-panel
else
    echo "Starting new PM2 process..."
    pm2 start ecosystem.config.cjs
    pm2 save
fi

# Show PM2 status
echo ""
echo "PM2 process status:"
pm2 status

echo ""
echo "Deployment completed successfully!"
echo "Use 'pm2 logs reelwin-panel' to view logs"
echo "Use 'pm2 monit' to monitor the application"