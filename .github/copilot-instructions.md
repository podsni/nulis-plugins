# GitHub Copilot Instructions for Nulis Plugin

## Project Overview
This is an Obsidian plugin called "Nulis" that provides quick note creation with automatic templates and folder organization.

## Key Features
- Quick note creation via ribbon icon and command palette
- Automatic folder organization (Daily, Knowledge, Ide, Notes)
- Customizable templates for different note types
- Automatic frontmatter with tags and creation date
- Settings panel for configuration
- Modal dialogs for user input

## File Structure
- `main.ts` - Main plugin file with all functionality
- `manifest.json` - Plugin metadata
- `styles.css` - UI styling
- `README.md` - User documentation
- `CHANGELOG.md` - Version history
- `.github/workflows/release.yml` - GitHub Actions release workflow

## Development Guidelines

### Code Style
- Use TypeScript with strict typing
- Follow Obsidian plugin conventions
- Use async/await for asynchronous operations
- Handle errors gracefully with try-catch blocks
- Use descriptive variable and function names

### Plugin Architecture
- Main class: `NulisPlugin` extends `Plugin`
- Settings: `NulisPluginSettings` interface
- Settings tab: `NulisSettingTab` class
- All functionality is contained in `main.ts` for simplicity

### Key Functions
- `createDailyNote()` - Creates daily notes
- `createKnowledgeNote()` - Creates knowledge notes
- `createIdeNote()` - Creates ide notes
- `createNote()` - Creates general notes
- `createNoteWithTemplate()` - Core note creation logic
- `generateFilename()` - Generates file names with date prefix
- `processTemplate()` - Processes templates with variables
- `showQuickMenu()` - Shows ribbon popup menu

### Template System
Templates use `{{variable}}` syntax for variable substitution:
- `{{date}}` - Current date in YYYY-MM-DD format
- `{{title}}` - Note title

### File Naming Convention
- Daily notes: `YYYY-MM-DD.md`
- Other notes: `YYYY-MM-DD note-title.md`

### Settings Structure
```typescript
interface NulisPluginSettings {
  folders: {
    daily: string;
    knowledge: string;
    ide: string;
    notes: string;
  };
  templates: {
    daily: string;
    knowledge: string;
    ide: string;
    notes: string;
  };
  autoCreateFolders: boolean;
  defaultFolder: 'daily' | 'knowledge' | 'ide' | 'notes';
  includeTags: boolean;
  defaultTags: string[];
}
```

## Testing
- Test all note creation types
- Test folder creation functionality
- Test template processing
- Test settings persistence
- Test UI interactions

## Release Process
1. Update version in `manifest.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. GitHub Actions will automatically create release

## Common Patterns
- Use `new Notice()` for user feedback
- Use `this.app.vault.create()` for file creation
- Use `this.app.workspace.getLeaf().openFile()` to open files
- Use `this.addCommand()` for command palette integration
- Use `this.addRibbonIcon()` for ribbon integration