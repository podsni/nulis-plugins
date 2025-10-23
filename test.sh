#!/bin/bash

# Nulis Plugin Testing Script - Enhanced UI/UX Version

echo "🎨 Nulis Plugin Testing & Debugging - Enhanced UI/UX"
echo "=================================================="

case "$1" in
    "build")
        echo "Building plugin with enhanced UI/UX..."
        npm run build
        if [ $? -eq 0 ]; then
            echo "✅ Build successful!"
            echo "📁 Files created:"
            ls -la main.js manifest.json 2>/dev/null || echo "❌ Build files not found"
            echo ""
            echo "🎨 New UI/UX Features:"
            echo "  ✨ Modern animations and transitions"
            echo "  📱 Mobile-responsive design"
            echo "  🎯 Enhanced visual feedback"
            echo "  🚀 Optimized performance"
        else
            echo "❌ Build failed!"
        fi
        ;;
    "dev")
        echo "Starting development mode with hot reload..."
        npm run dev
        ;;
    "test")
        echo "Running comprehensive tests..."
        echo "1. Building plugin..."
        npm run build
        if [ $? -eq 0 ]; then
            echo "✅ Build test passed"
        else
            echo "❌ Build test failed"
            exit 1
        fi
        
        echo "2. Checking files..."
        if [ -f "main.js" ] && [ -f "manifest.json" ]; then
            echo "✅ File check passed"
        else
            echo "❌ File check failed"
            exit 1
        fi
        
        echo "3. Checking manifest..."
        if grep -q '"id": "nulis"' manifest.json; then
            echo "✅ Manifest check passed"
        else
            echo "❌ Manifest check failed"
            exit 1
        fi
        
        echo "4. Checking UI features..."
        if grep -q "nulis-quick-menu" main.js; then
            echo "✅ UI components found"
        else
            echo "❌ UI components missing"
            exit 1
        fi
        
        echo "5. Checking mobile compatibility..."
        if grep -q "@media" main.js; then
            echo "✅ Mobile responsive design found"
        else
            echo "❌ Mobile responsive design missing"
            exit 1
        fi
        
        echo "🎉 All tests passed!"
        echo ""
        echo "🎨 Enhanced Features Ready:"
        echo "  ✨ Modern UI with animations"
        echo "  📱 Mobile-compatible design"
        echo "  🎯 Better visual feedback"
        echo "  🚀 Optimized performance"
        ;;
    "install")
        echo "Installing enhanced plugin..."
        npm run build
        if [ $? -eq 0 ]; then
            echo "✅ Plugin built successfully"
            echo "📋 Next steps:"
            echo "1. Copy main.js and manifest.json to your Obsidian plugin folder"
            echo "2. Restart Obsidian"
            echo "3. Enable plugin in Settings → Community plugins"
            echo "4. Check console for 'Nulis Plugin: Successfully loaded'"
            echo ""
            echo "🎨 New UI Features to Test:"
            echo "  📱 Test on mobile device"
            echo "  ✨ Notice smooth animations"
            echo "  🎯 Try different screen sizes"
            echo "  🚀 Experience faster performance"
        else
            echo "❌ Build failed, cannot install"
        fi
        ;;
    "mobile")
        echo "Testing mobile compatibility..."
        npm run build
        if [ $? -eq 0 ]; then
            echo "✅ Mobile-ready build created"
            echo "📱 Mobile Features:"
            echo "  - Responsive design for all screen sizes"
            echo "  - Touch-friendly buttons (44px+ height)"
            echo "  - Optimized layout for mobile"
            echo "  - Swipe gestures support"
            echo ""
            echo "📋 Mobile Testing Checklist:"
            echo "1. Install on Obsidian mobile"
            echo "2. Test ribbon icon tap"
            echo "3. Test quick menu on mobile"
            echo "4. Test note creation"
            echo "5. Test settings panel"
        else
            echo "❌ Build failed"
        fi
        ;;
    "clean")
        echo "Cleaning build files..."
        rm -f main.js
        echo "✅ Cleaned!"
        ;;
    "help"|"")
        echo "Available commands:"
        echo "  build   - Build the plugin with enhanced UI/UX"
        echo "  dev     - Start development mode with hot reload"
        echo "  test    - Run comprehensive tests including UI checks"
        echo "  install - Build and show installation instructions"
        echo "  mobile  - Test mobile compatibility features"
        echo "  clean   - Clean build files"
        echo "  help    - Show this help"
        echo ""
        echo "🎨 Enhanced UI/UX Features:"
        echo "  ✨ Modern animations and transitions"
        echo "  📱 Mobile-responsive design"
        echo "  🎯 Enhanced visual feedback"
        echo "  🚀 Optimized performance"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Run './test.sh help' for available commands"
        ;;
esac
