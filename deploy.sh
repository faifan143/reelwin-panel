#!/bin/bash

# Navigate to the project directory
cd /opt/reelwin-panel

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