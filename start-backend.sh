#!/bin/bash
# Equipment Management System - Backend Startup Script

echo "🚀 Starting Equipment Management Backend..."
echo ""

cd backend

# Use Java 17 for Lombok compatibility
export JAVA_HOME=/opt/homebrew/opt/openjdk@17

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "⚠️  PostgreSQL is not running. Starting it now..."
    brew services start postgresql@15
    sleep 2
fi

echo "📦 Building and starting Spring Boot application..."
mvn spring-boot:run
