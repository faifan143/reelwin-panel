# =========================================
# Stage 1: Base image
# =========================================
# Use Node.js LTS as base image - Alpine version for smaller size
FROM node:18-alpine AS base

# =========================================
# Stage 2: Dependencies
# =========================================
# This stage installs and caches the dependencies in a separate layer
# for better layer caching (dependencies don't change as often as code)
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Use npm ci for clean, reproducible builds (respects package-lock.json exactly)
RUN npm ci

# =========================================
# Stage 3: Builder
# =========================================
# This stage builds the application using the dependencies from the previous stage
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry during the build for privacy
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
# Note: We don't need npm install here as we already copied node_modules
RUN npm run build

# =========================================
# Stage 4: Runner (Production)
# =========================================
# This is the final, optimized production image that will be deployed
# It contains only what's necessary to run the application
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set up .next directory with proper permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy only the built application from the builder stage
# Using standalone output format from Next.js for optimized production deployments
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user for better security
USER nextjs

# Expose the port the app will run on
EXPOSE 3003

# Configure the server
ENV PORT 3003
ENV HOSTNAME "0.0.0.0"

# Start the Next.js application
CMD ["node", "server.js"]