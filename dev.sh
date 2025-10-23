#!/bin/bash

# Development helper script for Nulis Plugin

echo "🚀 Nulis Plugin Development Helper"
echo "=================================="

case "$1" in
    "dev")
        echo "Starting development mode with watch..."
        npm run dev
        ;;
    "build")
        echo "Building for production..."
        npm run build
        ;;
    "clean")
        echo "Cleaning build artifacts..."
        rm -f main.js
        echo "✅ Cleaned!"
        ;;
    "install")
        echo "Installing dependencies..."
        npm install
        ;;
    "lint")
        echo "Running linter..."
        npx eslint src/ main.ts
        ;;
    "help"|"")
        echo "Available commands:"
        echo "  dev     - Start development mode with watch"
        echo "  build   - Build for production"
        echo "  clean   - Clean build artifacts"
        echo "  install - Install dependencies"
        echo "  lint    - Run linter"
        echo "  help    - Show this help"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Run './dev.sh help' for available commands"
        ;;
esac
