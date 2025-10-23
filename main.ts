import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

// Settings interface
interface NulisPluginSettings {
	folders: {
		daily: string;
		knowledge: string;
		ide: string;
		notes: string;
		// PARA System
		projects: string;
		areas: string;
		resources: string;
		// Zettelkasten System
		ideas: string;
		// Journaling System
		journal: string;
	};
	templates: {
		daily: string;
		knowledge: string;
		ide: string;
		notes: string;
		// PARA System Templates
		projects: string;
		areas: string;
		resources: string;
		// Zettelkasten Templates
		ideas: string;
		// Journaling Templates
		journal: string;
	};
	autoCreateFolders: boolean;
	defaultFolder: 'daily' | 'knowledge' | 'ide' | 'notes' | 'projects' | 'areas' | 'resources' | 'ideas' | 'journal';
	includeTags: boolean;
	defaultTags: string[];
	theme: 'light' | 'dark' | 'auto';
	animations: boolean;
	filenameFormat: 'hyphenated' | 'original' | 'clean';
}

const DEFAULT_SETTINGS: NulisPluginSettings = {
	folders: {
		daily: 'Daily',
		knowledge: 'Knowledge',
		ide: 'Ide',
		notes: 'Notes',
		// PARA System
		projects: 'PROJECTS',
		areas: 'AREAS',
		resources: 'RESOURCES',
		// Zettelkasten System
		ideas: 'IDEAS',
		// Journaling System
		journal: 'journal'
	},
	templates: {
		daily: `---
tags:
  - daily
---
## Notes

![[Daily.base]]

`,
		knowledge: `---
created: {{date}}
tags:
  - knowledge
  - learning
---
# 🧠 {{title}}

## 📚 Summary


## 🔗 Key Points
- 

## 💡 Insights
- 

## 📖 References
- 

`,
		ide: `---
created: {{date}}
tags:
  - idea
  - brainstorming
---
# 💡 {{title}}

## 🎯 Problem Statement


## 💭 Ideas
- 

## ✅ Solutions
- 

## 🚀 Next Steps
- 

`,
		notes: `---
created: {{date}}
tags:
  - note
---
# 📝 {{title}}

## 📋 Content


## 🔗 Related
- 

## 📌 Action Items
- 

`,
		// PARA System Templates
		projects: `---
created: {{date}}
tags:
  - project
  - active
---
# 🚀 {{title}}

## 📋 Project Overview


## 🎯 Goals
- 

## 📅 Timeline
- **Start**: 
- **Deadline**: 
- **Status**: 

## 📝 Tasks
- [ ] 
- [ ] 
- [ ] 

## 🔗 Resources
- 

## 📊 Progress
- 

`,
		areas: `---
created: {{date}}
tags:
  - area
  - responsibility
---
# 🎯 {{title}}

## 📋 Area Description


## 🎯 Goals
- 

## 📊 Metrics
- 

## 📝 Current Focus
- 

## 🔗 Related Projects
- 

## 📚 Resources
- 

`,
		resources: `---
created: {{date}}
tags:
  - resource
  - reference
---
# 📚 {{title}}

## 📋 Resource Type
- **Type**: 
- **Category**: 
- **Source**: 

## 📝 Summary


## 🔗 Key Points
- 

## 💡 How to Use
- 

## 🔗 Related Resources
- 

## 📌 Action Items
- 

`,
		// Zettelkasten Templates
		ideas: `---
created: {{date}}
tags:
  - idea
  - atomic
  - zettelkasten
---
# 💡 {{title}}

## 🎯 Core Concept


## 🔗 Connections
- **Links to**: 
- **Related to**: 
- **Builds on**: 

## 📝 Development
- 

## 💭 Thoughts
- 

## 🔗 References
- 

`,
		// Journaling Templates
		journal: `---
created: {{date}}
tags:
  - journal
  - personal
---
# 📖 {{title}}

## 🌅 Pagi Ini
- **Mood**: 
- **Energi**: 
- **Fokus**: 

## 📝 Refleksi Hari Ini
- **Yang berjalan baik**: 
- **Yang bisa diperbaiki**: 
- **Pelajaran hari ini**: 

## 💭 Pikiran & Perasaan
- 

## 🎯 Besok
- **Yang ingin dicapai**: 
- **Prioritas**: 

## 🙏 Rasa Syukur
- 

`
	},
	autoCreateFolders: true,
	defaultFolder: 'notes',
	includeTags: true,
	defaultTags: ['daily'],
	theme: 'auto',
	animations: true,
	filenameFormat: 'original'
};

export default class NulisPlugin extends Plugin {
	settings: NulisPluginSettings;

	async onload() {
		console.log('Nulis Plugin: Loading...');
		
		try {
		await this.loadSettings();
			console.log('Nulis Plugin: Settings loaded');

			// Add CSS styles
			this.addStyles();

			// Add ribbon icon with better styling
			this.addRibbonIcon('pen-tool', 'Nulis - Quick Note Creation', (_evt: MouseEvent) => {
				console.log('Nulis Plugin: Ribbon clicked');
			this.showQuickMenu();
			}).addClass('nulis-ribbon-icon');

			// Add commands with better descriptions
		this.addCommand({
			id: 'create-daily-note',
				name: '📅 Buat Catatan Harian',
			callback: () => {
					console.log('Nulis Plugin: Creating daily note');
				this.createDailyNote();
			}
		});

		this.addCommand({
			id: 'create-knowledge-note',
				name: '🧠 Buat Catatan Pengetahuan',
			callback: () => {
					console.log('Nulis Plugin: Creating knowledge note');
				this.createKnowledgeNote();
			}
		});

		this.addCommand({
			id: 'create-brainstorm-note',
				name: '💡 Buat Catatan Brainstorm',
			callback: () => {
					console.log('Nulis Plugin: Creating brainstorm note');
				this.createBrainstormNote();
			}
		});

		this.addCommand({
			id: 'create-general-note',
				name: '📝 Buat Catatan Umum',
			callback: () => {
					console.log('Nulis Plugin: Creating general note');
				this.createNote();
			}
		});

			// PARA System Commands
		this.addCommand({
				id: 'create-project-note',
				name: '🚀 Buat Catatan Proyek',
			callback: () => {
					console.log('Nulis Plugin: Creating project note');
					this.createProjectNote();
				}
			});

			this.addCommand({
				id: 'create-area-note',
				name: '🎯 Buat Catatan Area',
				callback: () => {
					console.log('Nulis Plugin: Creating area note');
					this.createAreaNote();
				}
			});

			this.addCommand({
				id: 'create-resource-note',
				name: '📚 Buat Catatan Sumber Daya',
				callback: () => {
					console.log('Nulis Plugin: Creating resource note');
					this.createResourceNote();
				}
			});

			// Zettelkasten Commands
			this.addCommand({
				id: 'create-idea-note',
				name: '💡 Buat Catatan Ide (Zettelkasten)',
				callback: () => {
					console.log('Nulis Plugin: Creating idea note');
					this.createIdeaNote();
				}
			});

			// Journaling Commands
			this.addCommand({
				id: 'create-journal-note',
				name: '📖 Buat Jurnal',
				callback: () => {
					console.log('Nulis Plugin: Creating journal note');
					this.createJournalNote();
				}
			});

			this.addCommand({
				id: 'show-quick-menu',
				name: '🚀 Tampilkan Menu Cepat',
				callback: () => {
					this.showQuickMenu();
				}
			});

			// Add settings tab
		this.addSettingTab(new NulisSettingTab(this.app, this));
			
			console.log('Nulis Plugin: Successfully loaded');
			new Notice('✨ Nulis Plugin loaded successfully!');
		} catch (error) {
			console.error('Nulis Plugin: Error during load:', error);
			new Notice('❌ Error loading Nulis Plugin: ' + error.message);
		}
	}

	onunload() {
		console.log('Nulis Plugin: Unloading...');
		// Remove any added styles
		const styleEl = document.getElementById('nulis-plugin-styles');
		if (styleEl) {
			styleEl.remove();
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		
		console.log('Nulis Plugin: Available templates:', Object.keys(this.settings.templates));
		console.log('Nulis Plugin: Available folders:', Object.keys(this.settings.folders));
		
		// Ensure all templates exist (migration for existing users)
		if (!this.settings.templates.ideas) {
			console.log('Nulis Plugin: Adding missing ideas template');
			this.settings.templates.ideas = DEFAULT_SETTINGS.templates.ideas;
		}
		if (!this.settings.templates.projects) {
			console.log('Nulis Plugin: Adding missing projects template');
			this.settings.templates.projects = DEFAULT_SETTINGS.templates.projects;
		}
		if (!this.settings.templates.areas) {
			console.log('Nulis Plugin: Adding missing areas template');
			this.settings.templates.areas = DEFAULT_SETTINGS.templates.areas;
		}
		if (!this.settings.templates.resources) {
			console.log('Nulis Plugin: Adding missing resources template');
			this.settings.templates.resources = DEFAULT_SETTINGS.templates.resources;
		}
		
		// Ensure all folders exist (migration for existing users)
		if (!this.settings.folders.ideas) {
			console.log('Nulis Plugin: Adding missing ideas folder');
			this.settings.folders.ideas = DEFAULT_SETTINGS.folders.ideas;
		}
		if (!this.settings.folders.projects) {
			console.log('Nulis Plugin: Adding missing projects folder');
			this.settings.folders.projects = DEFAULT_SETTINGS.folders.projects;
		}
		if (!this.settings.folders.areas) {
			console.log('Nulis Plugin: Adding missing areas folder');
			this.settings.folders.areas = DEFAULT_SETTINGS.folders.areas;
		}
		if (!this.settings.folders.resources) {
			console.log('Nulis Plugin: Adding missing resources folder');
			this.settings.folders.resources = DEFAULT_SETTINGS.folders.resources;
		}
		
		// Save updated settings
		await this.saveSettings();
		console.log('Nulis Plugin: Settings migration completed');
		console.log('Nulis Plugin: Final templates:', Object.keys(this.settings.templates));
		console.log('Nulis Plugin: Final folders:', Object.keys(this.settings.folders));
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * Add CSS styles for better UI/UX
	 */
	private addStyles(): void {
		const styleEl = document.createElement('style');
		styleEl.id = 'nulis-plugin-styles';
		styleEl.textContent = `
			/* Ribbon Icon Styling */
			.nulis-ribbon-icon {
				transition: transform 0.2s ease, color 0.2s ease;
			}
			
			.nulis-ribbon-icon:hover {
				transform: scale(1.1);
				color: var(--interactive-accent);
			}

			/* Quick Menu Styling */
			.nulis-quick-menu {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: var(--background-primary);
				border: 1px solid var(--background-modifier-border);
				border-radius: 12px;
				padding: 24px;
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
				z-index: 1000;
				min-width: 320px;
				max-width: 90vw;
				backdrop-filter: blur(10px);
				animation: nulis-fade-in 0.3s ease-out;
			}

			@keyframes nulis-fade-in {
				from {
					opacity: 0;
					transform: translate(-50%, -50%) scale(0.9);
				}
				to {
					opacity: 1;
					transform: translate(-50%, -50%) scale(1);
				}
			}

			@keyframes nulis-fade-out {
				from {
					opacity: 1;
					transform: translate(-50%, -50%) scale(1);
				}
				to {
					opacity: 0;
					transform: translate(-50%, -50%) scale(0.9);
				}
			}

			.nulis-menu-title {
				margin: 0 0 20px 0;
				text-align: center;
				font-size: 1.2em;
				font-weight: 600;
				color: var(--text-normal);
				background: linear-gradient(135deg, var(--interactive-accent), var(--text-accent));
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}

			.nulis-buttons-container {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
				gap: 12px;
				margin-bottom: 16px;
			}

			.nulis-menu-button {
				padding: 12px 16px;
			border: 1px solid var(--background-modifier-border);
			border-radius: 8px;
				background: var(--background-primary);
				cursor: pointer;
				transition: all 0.2s ease;
				font-size: 0.9em;
				font-weight: 500;
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				min-height: 44px;
				position: relative;
				overflow: hidden;
			}

			.nulis-menu-button:hover {
				background: var(--background-modifier-hover);
				border-color: var(--interactive-accent);
				transform: translateY(-2px);
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
			}

			.nulis-menu-button:active {
				transform: translateY(0);
			}

			.nulis-menu-button::before {
				content: '';
				position: absolute;
				top: 0;
				left: -100%;
				width: 100%;
				height: 100%;
				background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
				transition: left 0.5s ease;
			}

			.nulis-menu-button:hover::before {
				left: 100%;
			}

			.nulis-close-button {
				width: 100%;
				padding: 10px;
				border: 1px solid var(--background-modifier-border);
				border-radius: 8px;
				background: var(--background-secondary);
				cursor: pointer;
				transition: all 0.2s ease;
				font-size: 0.9em;
				font-weight: 500;
			}

			.nulis-close-button:hover {
				background: var(--background-modifier-error);
				color: var(--text-on-accent);
			}

			/* Modal Styling */
			.nulis-modal {
				border-radius: 12px;
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
			}

			.nulis-modal-title {
				font-size: 1.3em;
				font-weight: 600;
				margin-bottom: 20px;
				text-align: center;
				color: var(--text-normal);
			}

			.nulis-input {
				width: 100%;
				padding: 12px 16px;
				border: 2px solid var(--background-modifier-border);
				border-radius: 8px;
				background: var(--background-primary);
				color: var(--text-normal);
				font-size: 1em;
				transition: all 0.2s ease;
				margin-bottom: 16px;
			}

			.nulis-input:focus {
				outline: none;
				border-color: var(--interactive-accent);
				box-shadow: 0 0 0 3px rgba(var(--interactive-accent-rgb), 0.1);
			}

			.nulis-button-group {
				display: flex;
				gap: 12px;
				justify-content: center;
			}

			.nulis-button {
				padding: 10px 20px;
				border: 1px solid var(--background-modifier-border);
				border-radius: 8px;
				background: var(--background-primary);
				cursor: pointer;
				transition: all 0.2s ease;
				font-size: 0.9em;
				font-weight: 500;
				min-width: 80px;
			}

			.nulis-button:hover {
				background: var(--background-modifier-hover);
				transform: translateY(-1px);
			}

			.nulis-button-primary {
				background: var(--interactive-accent);
				color: var(--text-on-accent);
				border-color: var(--interactive-accent);
			}

			.nulis-button-primary:hover {
				background: var(--interactive-accent-hover);
			}

			.nulis-button-secondary {
				background: var(--background-secondary);
			}

			.nulis-button-secondary:hover {
				background: var(--background-modifier-error);
				color: var(--text-on-accent);
			}

			/* Mobile Responsive */
			@media (max-width: 768px) {
				.nulis-quick-menu {
					width: 95vw;
					max-width: 400px;
			padding: 20px;
				}

				.nulis-buttons-container {
					grid-template-columns: 1fr;
					gap: 10px;
				}

				.nulis-menu-button {
					min-height: 48px;
					font-size: 1em;
				}

				.nulis-button-group {
					flex-direction: column;
				}

				.nulis-button {
					width: 100%;
					min-height: 44px;
				}
			}

			/* Dark mode adjustments */
			.theme-dark .nulis-quick-menu {
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
			}

			/* Loading animation */
			.nulis-loading {
				display: inline-block;
				width: 20px;
				height: 20px;
				border: 2px solid var(--background-modifier-border);
				border-radius: 50%;
				border-top-color: var(--interactive-accent);
				animation: nulis-spin 1s ease-in-out infinite;
			}

			@keyframes nulis-spin {
				to {
					transform: rotate(360deg);
				}
			}

			/* Success/Error states */
			.nulis-success {
				color: var(--text-success);
			}

			.nulis-error {
				color: var(--text-error);
			}
		`;
		document.head.appendChild(styleEl);
	}

	/**
	 * Show quick menu for note creation with improved UI
	 */
	private showQuickMenu(): void {
		try {
			console.log('Nulis Plugin: Showing quick menu');
			
			const menu = document.createElement('div');
			menu.className = 'nulis-quick-menu';

		// Title
		const title = document.createElement('h3');
			title.className = 'nulis-menu-title';
			title.textContent = '✨ Pembuatan Catatan Cepat';
		menu.appendChild(title);

		// Buttons container
		const buttonsContainer = document.createElement('div');
			buttonsContainer.className = 'nulis-buttons-container';

			// Create buttons with better icons and descriptions
			const buttons = [
				{ 
					icon: '📅', 
					text: 'Catatan Harian', 
					desc: 'Buat catatan harian',
					action: () => this.createDailyNote() 
				},
				{ 
					icon: '📖', 
					text: 'Jurnal', 
					desc: 'Buat jurnal pribadi',
					action: () => this.createJournalNote() 
				},
				{ 
					icon: '🧠', 
					text: 'Pengetahuan', 
					desc: 'Catatan pembelajaran',
					action: () => this.createKnowledgeNote() 
				},
				{ 
					icon: '💡', 
					text: 'Ideas', 
					desc: 'Brainstorming',
					action: () => this.createBrainstormNote() 
				},
				{ 
					icon: '📝', 
					text: 'Umum', 
					desc: 'Catatan cepat',
					action: () => this.createNote() 
				},
				{ 
					icon: '🚀', 
					text: 'Proyek', 
					desc: 'Proyek aktif',
					action: () => this.createProjectNote() 
				},
				{ 
					icon: '🎯', 
					text: 'Area', 
					desc: 'Area jangka panjang',
					action: () => this.createAreaNote() 
				},
				{ 
					icon: '📚', 
					text: 'Sumber Daya', 
					desc: 'Referensi & tools',
					action: () => this.createResourceNote() 
				},
				{ 
					icon: '💭', 
					text: 'Zettelkasten', 
					desc: 'Ide atomic',
					action: () => this.createIdeaNote() 
				}
			];

			buttons.forEach(btnData => {
				const button = document.createElement('button');
				button.className = 'nulis-menu-button';
				
				const iconSpan = document.createElement('span');
				iconSpan.textContent = btnData.icon;
				iconSpan.style.fontSize = '1.2em';
				
				const textSpan = document.createElement('span');
				textSpan.innerHTML = `<div style="font-weight: 600;">${btnData.text}</div><div style="font-size: 0.8em; opacity: 0.7;">${btnData.desc}</div>`;
				
				button.appendChild(iconSpan);
				button.appendChild(textSpan);
				
				button.addEventListener('click', () => {
					btnData.action();
			this.closeMenu(menu);
		});

				buttonsContainer.appendChild(button);
			});

			menu.appendChild(buttonsContainer);

		// Close button
		const closeBtn = document.createElement('button');
			closeBtn.className = 'nulis-close-button';
		closeBtn.textContent = '❌ Close';
		closeBtn.addEventListener('click', () => {
			this.closeMenu(menu);
		});

			menu.appendChild(closeBtn);
		document.body.appendChild(menu);

		// Close on outside click
		const handleOutsideClick = (e: MouseEvent) => {
			if (!menu.contains(e.target as Node)) {
				this.closeMenu(menu);
				document.removeEventListener('click', handleOutsideClick);
			}
		};

		setTimeout(() => {
			document.addEventListener('click', handleOutsideClick);
		}, 100);

		} catch (error) {
			console.error('Nulis Plugin: Error showing quick menu:', error);
			new Notice('❌ Error showing quick menu: ' + error.message);
		}
	}

	/**
	 * Close the quick menu with animation
	 */
	private closeMenu(menu: HTMLElement): void {
		try {
		if (menu && menu.parentNode) {
				menu.style.animation = 'nulis-fade-out 0.2s ease-in forwards';
				setTimeout(() => {
					if (menu.parentNode) {
			menu.parentNode.removeChild(menu);
					}
				}, 200);
			}
		} catch (error) {
			console.error('Nulis Plugin: Error closing menu:', error);
		}
	}

	/**
	 * Create daily note with improved feedback
	 */
	async createDailyNote(): Promise<void> {
		try {
			console.log('Nulis Plugin: Creating daily note');
			const title = `Daily ${new Date().toLocaleDateString()}`;
			
			// Show loading state
			const loadingNotice = new Notice('⏳ Creating daily note...', 0);
			
			const file = await this.createNoteWithTemplate(title, 'daily');
			
			await this.app.workspace.getLeaf().openFile(file);
			
			loadingNotice.hide();
			new Notice('✅ Daily note created successfully!', 3000);
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating daily note:', error);
			new Notice('❌ Error creating daily note: ' + error.message, 5000);
		}
	}

	/**
	 * Create knowledge note with improved modal
	 */
	async createKnowledgeNote(): Promise<void> {
		try {
			console.log('Nulis Plugin: Creating knowledge note');
			const title = await this.promptForTitle('Knowledge Note', 'Enter the topic you want to learn about...');
			if (!title || title.trim() === '') {
				new Notice('❌ Note creation cancelled - no title provided');
				return;
			}

			const loadingNotice = new Notice('⏳ Creating knowledge note...', 0);
			const file = await this.createNoteWithTemplate(title.trim(), 'knowledge');
			
			await this.app.workspace.getLeaf().openFile(file);
			
			loadingNotice.hide();
			new Notice('✅ Knowledge note created successfully!', 3000);
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating knowledge note:', error);
			new Notice('❌ Error creating knowledge note: ' + error.message, 5000);
		}
	}

	/**
	 * Create brainstorm note with improved modal
	 */
	async createBrainstormNote(): Promise<void> {
		try {
			console.log('Nulis Plugin: Creating brainstorm note');
			const title = await this.promptForTitle('Brainstorm Note', 'What idea do you want to explore?');
			if (!title || title.trim() === '') {
				new Notice('❌ Note creation cancelled - no title provided');
				return;
			}

			const loadingNotice = new Notice('⏳ Creating brainstorm note...', 0);
			const file = await this.createNoteWithTemplate(title.trim(), 'ide');
			
			await this.app.workspace.getLeaf().openFile(file);
			
			loadingNotice.hide();
			new Notice('✅ Brainstorm note created successfully!', 3000);
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating brainstorm note:', error);
			new Notice('❌ Error creating brainstorm note: ' + error.message, 5000);
		}
	}

	/**
	 * Create general note with improved modal
	 */
	async createNote(): Promise<void> {
		try {
			console.log('Nulis Plugin: Creating general note');
			const title = await this.promptForTitle('General Note', 'What do you want to write about?');
			if (!title || title.trim() === '') {
				new Notice('❌ Note creation cancelled - no title provided');
				return;
			}

			const loadingNotice = new Notice('⏳ Creating note...', 0);
			const file = await this.createNoteWithTemplate(title.trim(), 'notes');
			
			await this.app.workspace.getLeaf().openFile(file);
			
			loadingNotice.hide();
			new Notice('✅ Note created successfully!', 3000);
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating note:', error);
			new Notice('❌ Error creating note: ' + error.message, 5000);
		}
	}

	/**
	 * Create project note
	 */
	async createProjectNote(): Promise<void> {
		try {
			console.log('Nulis Plugin: Creating project note');
			const title = await this.promptForTitle('Project Note', 'What project are you working on?');
			if (!title || title.trim() === '') {
				new Notice('❌ Note creation cancelled - no title provided');
				return;
			}

			const loadingNotice = new Notice('⏳ Creating project note...', 0);
			const file = await this.createNoteWithTemplate(title.trim(), 'projects');
			
			await this.app.workspace.getLeaf().openFile(file);
			
			loadingNotice.hide();
			new Notice('✅ Project note created successfully!', 3000);
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating project note:', error);
			new Notice('❌ Error creating project note: ' + error.message, 5000);
		}
	}

	/**
	 * Create area note
	 */
	async createAreaNote(): Promise<void> {
		try {
			console.log('Nulis Plugin: Creating area note');
			const title = await this.promptForTitle('Area Note', 'What area of responsibility?');
			if (!title || title.trim() === '') {
				new Notice('❌ Note creation cancelled - no title provided');
				return;
			}

			const loadingNotice = new Notice('⏳ Creating area note...', 0);
			const file = await this.createNoteWithTemplate(title.trim(), 'areas');
			
			await this.app.workspace.getLeaf().openFile(file);
			
			loadingNotice.hide();
			new Notice('✅ Area note created successfully!', 3000);
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating area note:', error);
			new Notice('❌ Error creating area note: ' + error.message, 5000);
		}
	}

	/**
	 * Create resource note
	 */
	async createResourceNote(): Promise<void> {
		try {
			console.log('Nulis Plugin: Creating resource note');
			const title = await this.promptForTitle('Resource Note', 'What resource are you documenting?');
			if (!title || title.trim() === '') {
				new Notice('❌ Note creation cancelled - no title provided');
				return;
			}

			const loadingNotice = new Notice('⏳ Creating resource note...', 0);
			const file = await this.createNoteWithTemplate(title.trim(), 'resources');
			
			await this.app.workspace.getLeaf().openFile(file);
			
			loadingNotice.hide();
			new Notice('✅ Resource note created successfully!', 3000);
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating resource note:', error);
			new Notice('❌ Error creating resource note: ' + error.message, 5000);
		}
	}

	/**
	 * Create idea note (Zettelkasten)
	 */
	async createIdeaNote(): Promise<void> {
		try {
			console.log('Nulis Plugin: Creating idea note');
			const title = await this.promptForTitle('Catatan Ide', 'Ide atomic apa yang ingin Anda tangkap?');
			if (!title || title.trim() === '') {
				new Notice('❌ Pembuatan catatan dibatalkan - tidak ada judul');
				return;
			}

			const loadingNotice = new Notice('⏳ Membuat catatan ide...', 0);
			const file = await this.createNoteWithTemplate(title.trim(), 'ideas');
			
			await this.app.workspace.getLeaf().openFile(file);
			
			loadingNotice.hide();
			new Notice('✅ Catatan ide berhasil dibuat!', 3000);
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating idea note:', error);
			new Notice('❌ Error membuat catatan ide: ' + error.message, 5000);
		}
	}

	/**
	 * Create journal note
	 */
	async createJournalNote(): Promise<void> {
		try {
			console.log('Nulis Plugin: Creating journal note');
			const title = await this.promptForTitle('Jurnal', 'Apa yang ingin Anda tulis di jurnal hari ini?');
			if (!title || title.trim() === '') {
				new Notice('❌ Pembuatan jurnal dibatalkan - tidak ada judul');
				return;
			}

			const loadingNotice = new Notice('⏳ Membuat jurnal...', 0);
			const file = await this.createNoteWithTemplate(title.trim(), 'journal');
			
			await this.app.workspace.getLeaf().openFile(file);
			
			loadingNotice.hide();
			new Notice('✅ Jurnal berhasil dibuat!', 3000);
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating journal note:', error);
			new Notice('❌ Error membuat jurnal: ' + error.message, 5000);
		}
	}
	async createNoteWithTemplate(
		title: string, 
		noteType: 'daily' | 'knowledge' | 'ide' | 'notes' | 'projects' | 'areas' | 'resources' | 'ideas' | 'journal',
		folderPath?: string
	): Promise<TFile> {
		try {
			console.log(`Nulis Plugin: Creating ${noteType} note with title: ${title}`);
			
			// Validate inputs
			if (!title || typeof title !== 'string') {
				throw new Error('Invalid title provided');
			}

			// Check if noteType exists in templates
			if (!noteType || !this.settings.templates[noteType]) {
				console.error(`Nulis Plugin: Invalid note type: ${noteType}`);
				console.error(`Nulis Plugin: Available note types:`, Object.keys(this.settings.templates));
				throw new Error(`Invalid note type: ${noteType}. Available types: ${Object.keys(this.settings.templates).join(', ')}`);
			}

			// Check if folder setting exists
			if (!this.settings.folders[noteType]) {
				console.error(`Nulis Plugin: Invalid folder setting for note type: ${noteType}`);
				console.error(`Nulis Plugin: Available folders:`, Object.keys(this.settings.folders));
				throw new Error(`Invalid folder setting for note type: ${noteType}. Available folders: ${Object.keys(this.settings.folders).join(', ')}`);
			}

		const template = this.settings.templates[noteType];
		console.log(`Nulis Plugin: Using template for ${noteType}:`, template ? 'Found' : 'Not found');
		
		const processedTemplate = this.processTemplate(template, {
			title: title,
			date: new Date().toISOString().split('T')[0]
		});

		const filename = this.generateFilename(title, noteType);
		console.log(`Nulis Plugin: Generated filename: ${filename}`);
		
			// Determine target folder
		let targetFolder: string;
		if (noteType === 'daily') {
			targetFolder = folderPath || this.settings.folders.daily;
		} else {
			targetFolder = folderPath || this.settings.folders[noteType];
		}
		console.log(`Nulis Plugin: Target folder: ${targetFolder}`);
		
			// Ensure folder exists
		console.log(`Nulis Plugin: Ensuring folder exists: ${targetFolder}`);
		await this.ensureFolderExists(targetFolder);
		
		const filePath = `${targetFolder}/${filename}`;
		console.log(`Nulis Plugin: Full file path: ${filePath}`);
			
			// Check if file already exists
			const existingFile = this.app.vault.getAbstractFileByPath(filePath);
			if (existingFile) {
				console.log(`Nulis Plugin: File already exists: ${filePath}`);
				throw new Error(`File already exists: ${filePath}`);
			}
			
		console.log(`Nulis Plugin: Creating file: ${filePath}`);
		const file = await this.app.vault.create(filePath, processedTemplate);
		
			if (!file) {
				console.error(`Nulis Plugin: Failed to create file: ${filePath}`);
				throw new Error('Failed to create file');
			}
			
		console.log(`Nulis Plugin: Successfully created file: ${filePath}`);
		return file;
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating note with template:', error);
			throw new Error(`Failed to create note: ${error.message}`);
		}
	}

	/**
	 * Process template with variables - optimized
	 */
	private processTemplate(template: string, variables: Record<string, string> = {}): string {
		try {
			if (!template || typeof template !== 'string') {
				return '';
			}

		let processedTemplate = template;
		
			// Replace variables efficiently
			Object.entries(variables).forEach(([key, value]) => {
				if (key && value !== undefined && value !== null) {
			const regex = new RegExp(`{{${key}}}`, 'g');
					processedTemplate = processedTemplate.replace(regex, String(value));
		}
			});

			// Always replace {{date}} with current date
			const currentDate = new Date().toISOString().split('T')[0];
			processedTemplate = processedTemplate.replace(/{{date}}/g, currentDate);

			// Replace any remaining undefined variables with empty string
			processedTemplate = processedTemplate.replace(/{{[^}]+}}/g, '');

		return processedTemplate;
		} catch (error) {
			console.error('Nulis Plugin: Error processing template:', error);
			return template; // Return original template if processing fails
		}
	}

	/**
	 * Generate filename for new note - improved for better readability
	 */
	private generateFilename(title: string, noteType: 'daily' | 'knowledge' | 'ide' | 'notes' | 'projects' | 'areas' | 'resources' | 'ideas' | 'journal'): string {
		try {
			if (!title || typeof title !== 'string') {
				title = 'untitled';
			}

			const currentDate = new Date().toISOString().split('T')[0];
			
			if (noteType === 'daily') {
				return `${currentDate}.md`;
			}

			// Clean title for filename - improved version
			const cleanTitle = this.formatTitleForFilename(title);
			const finalTitle = cleanTitle || 'untitled';

			// Format: YYYY-MM-DD Title Name.md (more readable)
			return `${currentDate} ${finalTitle}.md`;
		} catch (error) {
			console.error('Nulis Plugin: Error generating filename:', error);
			return `${new Date().toISOString().split('T')[0]} untitled.md`;
		}
	}

	/**
	 * Format title for filename - smart formatting with multiple options
	 */
	private formatTitleForFilename(title: string): string {
		try {
			// Remove extra spaces and normalize
			let formatted = title.trim().replace(/\s+/g, ' ');
			
			switch (this.settings.filenameFormat) {
				case 'original':
					// Keep original title with proper capitalization
					formatted = this.toTitleCase(formatted);
					formatted = formatted
						.replace(/[<>:"/\\|?*]/g, '') // Remove filesystem invalid chars
						.replace(/\s+/g, ' ') // Normalize spaces
						.trim();
					return formatted || 'Untitled';
					
				case 'clean':
					// Clean version - remove special chars but keep readable with proper capitalization
					formatted = this.toTitleCase(formatted);
					formatted = formatted
						.replace(/[^\w\s\-.,!?()]/g, '') // Remove special chars but keep basic punctuation
						.replace(/\s+/g, ' ') // Normalize spaces
			.trim();
					return formatted || 'Untitled';
					
				case 'hyphenated':
				default:
					// Hyphenated version (default) - but still use proper capitalization
					formatted = this.toTitleCase(formatted);
					formatted = formatted
						.replace(/[^\w\s\-.,!?()]/g, '') // Remove special chars but keep basic punctuation
						.replace(/\s+/g, ' ') // Normalize spaces
						.trim();
					
					// Convert to lowercase for hyphenation
					formatted = formatted.toLowerCase();
					
					// Replace spaces with hyphens
					formatted = formatted.replace(/\s+/g, '-');
					
					// Clean up multiple hyphens
					formatted = formatted.replace(/-+/g, '-');
					
					// Remove leading/trailing hyphens
					formatted = formatted.replace(/^-+|-+$/g, '');
					
					return formatted || 'untitled';
			}
		} catch (error) {
			console.error('Nulis Plugin: Error formatting title:', error);
			return 'Untitled';
		}
	}

	/**
	 * Convert text to proper title case
	 */
	private toTitleCase(text: string): string {
		try {
			// Split into words
			const words = text.toLowerCase().split(' ');
			
			// Capitalize each word
			const titleCaseWords = words.map(word => {
				if (word.length === 0) return word;
				
				// Handle Indonesian words and common words
				const firstChar = word.charAt(0).toUpperCase();
				const restChars = word.slice(1);
				
				return firstChar + restChars;
			});
			
			return titleCaseWords.join(' ');
		} catch (error) {
			console.error('Nulis Plugin: Error converting to title case:', error);
			return text;
		}
	}

	/**
	 * Ensure folder exists - always create if missing, handle existing folders gracefully
	 */
	private async ensureFolderExists(folderPath: string): Promise<void> {
		try {
			console.log(`Nulis Plugin: Checking folder: ${folderPath}`);
			
			const folder = this.app.vault.getAbstractFileByPath(folderPath);
			if (!folder) {
				console.log(`Nulis Plugin: Creating folder: ${folderPath}`);
				await this.app.vault.createFolder(folderPath);
				console.log(`Nulis Plugin: Successfully created folder: ${folderPath}`);
			} else {
				console.log(`Nulis Plugin: Folder already exists: ${folderPath}`);
				// Check if it's actually a folder
				if (folder instanceof TFile) {
					console.log(`Nulis Plugin: Warning: ${folderPath} exists but is a file, not a folder`);
					throw new Error(`Path ${folderPath} exists but is a file, not a folder`);
				}
			}
		} catch (error: any) {
			console.error('Nulis Plugin: Error creating folder:', error);
			// If folder already exists, that's actually fine - don't throw error
			if (error.message && error.message.includes('already exists')) {
				console.log(`Nulis Plugin: Folder ${folderPath} already exists - continuing`);
				return;
			}
			throw new Error(`Failed to create folder: ${error.message}`);
		}
	}

	/**
	 * Prompt user for note title with improved UI
	 */
	private async promptForTitle(title: string, placeholder: string): Promise<string | null> {
		return new Promise((resolve) => {
			try {
			class TitleModal extends Modal {
				private inputEl: HTMLInputElement;
				private resolve: (value: string | null) => void;
					private isResolved: boolean = false;

				constructor(app: App, resolve: (value: string | null) => void) {
					super(app);
					this.resolve = resolve;
						this.containerEl.addClass('nulis-modal');
				}

				onOpen() {
					const { contentEl } = this;
						
						const titleEl = contentEl.createEl('h2', { text: title });
						titleEl.className = 'nulis-modal-title';
					
					this.inputEl = contentEl.createEl('input', {
						type: 'text',
						placeholder: placeholder
					}) as HTMLInputElement;
						this.inputEl.className = 'nulis-input';
					
					this.inputEl.addEventListener('keydown', (e) => {
						if (e.key === 'Enter') {
								this.resolveValue(this.inputEl.value.trim());
							} else if (e.key === 'Escape') {
								this.resolveValue(null);
							}
						});

						const buttonContainer = contentEl.createDiv();
						buttonContainer.className = 'nulis-button-group';

						const createBtn = buttonContainer.createEl('button', { text: '✅ Create' });
						createBtn.className = 'nulis-button nulis-button-primary';
						createBtn.addEventListener('click', () => {
							this.resolveValue(this.inputEl.value.trim());
						});

						const cancelBtn = buttonContainer.createEl('button', { text: '❌ Cancel' });
						cancelBtn.className = 'nulis-button nulis-button-secondary';
						cancelBtn.addEventListener('click', () => {
							this.resolveValue(null);
						});

						this.inputEl.focus();
					}

					private resolveValue(value: string | null): void {
						if (!this.isResolved) {
							this.isResolved = true;
							this.resolve(value);
						this.close();
						}
				}

				onClose() {
						if (!this.isResolved) {
							this.isResolved = true;
							this.resolve(null);
						}
					const { contentEl } = this;
					contentEl.empty();
				}
			}

				const modal = new TitleModal(this.app, resolve);
			modal.open();
			} catch (error) {
				console.error('Nulis Plugin: Error creating title modal:', error);
				resolve(null);
			}
		});
	}
}

class NulisSettingTab extends PluginSettingTab {
	plugin: NulisPlugin;

	constructor(app: App, plugin: NulisPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// Header
		const header = containerEl.createDiv();
		header.style.cssText = 'text-align: center; margin-bottom: 30px;';
		header.createEl('h1', { text: '✨ Nulis Plugin Settings' });
		header.createEl('p', { text: 'Configure your note creation experience' });

		// Folder Settings
		containerEl.createEl('h2', { text: '📁 Folder Settings' });

		// Daily folder setting
		new Setting(containerEl)
			.setName('📅 Daily folder')
			.setDesc('Folder name for daily notes')
			.addText((text: any) => text
				.setPlaceholder('Daily')
				.setValue(this.plugin.settings.folders.daily)
				.onChange(async (value: string) => {
					this.plugin.settings.folders.daily = value;
					await this.plugin.saveSettings();
				}));

		// Knowledge folder setting
		new Setting(containerEl)
			.setName('🧠 Knowledge folder')
			.setDesc('Folder name for knowledge notes')
			.addText((text: any) => text
				.setPlaceholder('Knowledge')
				.setValue(this.plugin.settings.folders.knowledge)
				.onChange(async (value: string) => {
					this.plugin.settings.folders.knowledge = value;
					await this.plugin.saveSettings();
				}));

		// Ide folder setting
		new Setting(containerEl)
			.setName('💡 Ide folder')
			.setDesc('Folder name for ide notes')
			.addText((text: any) => text
				.setPlaceholder('Ide')
				.setValue(this.plugin.settings.folders.ide)
				.onChange(async (value: string) => {
					this.plugin.settings.folders.ide = value;
					await this.plugin.saveSettings();
				}));

		// Notes folder setting
		new Setting(containerEl)
			.setName('📝 Notes folder')
			.setDesc('Folder name for general notes')
			.addText((text: any) => text
				.setPlaceholder('Notes')
				.setValue(this.plugin.settings.folders.notes)
				.onChange(async (value: string) => {
					this.plugin.settings.folders.notes = value;
					await this.plugin.saveSettings();
				}));

		// PARA System Folders
		containerEl.createEl('h2', { text: '🚀 PARA System Folders' });

		// Projects folder setting
		new Setting(containerEl)
			.setName('🚀 Projects folder')
			.setDesc('Folder name for active projects (PARA: Projects)')
			.addText((text: any) => text
				.setPlaceholder('PROJECTS')
				.setValue(this.plugin.settings.folders.projects)
				.onChange(async (value: string) => {
					this.plugin.settings.folders.projects = value;
					await this.plugin.saveSettings();
				}));

		// Areas folder setting
		new Setting(containerEl)
			.setName('🎯 Areas folder')
			.setDesc('Folder name for long-term areas (PARA: Areas)')
			.addText((text: any) => text
				.setPlaceholder('AREAS')
				.setValue(this.plugin.settings.folders.areas)
				.onChange(async (value: string) => {
					this.plugin.settings.folders.areas = value;
					await this.plugin.saveSettings();
				}));

		// Resources folder setting
		new Setting(containerEl)
			.setName('📚 Resources folder')
			.setDesc('Folder name for references and tools (PARA: Resources)')
			.addText((text: any) => text
				.setPlaceholder('RESOURCES')
				.setValue(this.plugin.settings.folders.resources)
				.onChange(async (value: string) => {
					this.plugin.settings.folders.resources = value;
					await this.plugin.saveSettings();
				}));

		// Journaling System
		containerEl.createEl('h2', { text: '📖 Journaling System' });

		// Journal folder setting
		new Setting(containerEl)
			.setName('📖 Journal folder')
			.setDesc('Folder name for personal journal')
			.addText((text: any) => text
				.setPlaceholder('journal')
				.setValue(this.plugin.settings.folders.journal)
				.onChange(async (value: string) => {
					this.plugin.settings.folders.journal = value;
					await this.plugin.saveSettings();
				}));

		// Zettelkasten System
		containerEl.createEl('h2', { text: '💭 Zettelkasten System' });

		// Ideas folder setting
		new Setting(containerEl)
			.setName('💭 Ideas folder')
			.setDesc('Folder name for atomic notes (Zettelkasten)')
			.addText((text: any) => text
				.setPlaceholder('IDEAS')
				.setValue(this.plugin.settings.folders.ideas)
				.onChange(async (value: string) => {
					this.plugin.settings.folders.ideas = value;
					await this.plugin.saveSettings();
				}));

		// Template Settings
		containerEl.createEl('h2', { text: '📄 Template Settings' });

		// Daily template
		new Setting(containerEl)
			.setName('📅 Daily template')
			.setDesc('Template for daily notes')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter daily template...')
				.setValue(this.plugin.settings.templates.daily)
				.onChange(async (value: string) => {
					this.plugin.settings.templates.daily = value;
					await this.plugin.saveSettings();
				})
				.inputEl.style.height = '120px');

		// Knowledge template
		new Setting(containerEl)
			.setName('🧠 Knowledge template')
			.setDesc('Template for knowledge notes')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter knowledge template...')
				.setValue(this.plugin.settings.templates.knowledge)
				.onChange(async (value: string) => {
					this.plugin.settings.templates.knowledge = value;
					await this.plugin.saveSettings();
				})
				.inputEl.style.height = '120px');

		// Ide template
		new Setting(containerEl)
			.setName('💡 Ide template')
			.setDesc('Template for ide notes')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter ide template...')
				.setValue(this.plugin.settings.templates.ide)
				.onChange(async (value: string) => {
					this.plugin.settings.templates.ide = value;
					await this.plugin.saveSettings();
				})
				.inputEl.style.height = '120px');

		// Notes template
		new Setting(containerEl)
			.setName('📝 Notes template')
			.setDesc('Template for general notes')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter notes template...')
				.setValue(this.plugin.settings.templates.notes)
				.onChange(async (value: string) => {
					this.plugin.settings.templates.notes = value;
					await this.plugin.saveSettings();
				})
				.inputEl.style.height = '120px');

		// PARA System Templates
		containerEl.createEl('h2', { text: '🚀 PARA System Templates' });

		// Projects template
		new Setting(containerEl)
			.setName('🚀 Projects template')
			.setDesc('Template for project notes')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter projects template...')
				.setValue(this.plugin.settings.templates.projects)
				.onChange(async (value: string) => {
					this.plugin.settings.templates.projects = value;
					await this.plugin.saveSettings();
				})
				.inputEl.style.height = '120px');

		// Areas template
		new Setting(containerEl)
			.setName('🎯 Areas template')
			.setDesc('Template for area notes')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter areas template...')
				.setValue(this.plugin.settings.templates.areas)
				.onChange(async (value: string) => {
					this.plugin.settings.templates.areas = value;
					await this.plugin.saveSettings();
				})
				.inputEl.style.height = '120px');

		// Resources template
		new Setting(containerEl)
			.setName('📚 Resources template')
			.setDesc('Template for resource notes')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter resources template...')
				.setValue(this.plugin.settings.templates.resources)
				.onChange(async (value: string) => {
					this.plugin.settings.templates.resources = value;
					await this.plugin.saveSettings();
				})
				.inputEl.style.height = '120px');

		// Zettelkasten Templates
		containerEl.createEl('h2', { text: '💭 Zettelkasten Templates' });

		// Ideas template
		new Setting(containerEl)
			.setName('💭 Ideas template')
			.setDesc('Template for atomic idea notes')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter ideas template...')
				.setValue(this.plugin.settings.templates.ideas)
				.onChange(async (value: string) => {
					this.plugin.settings.templates.ideas = value;
					await this.plugin.saveSettings();
				})
				.inputEl.style.height = '120px');

		// Journaling Templates
		containerEl.createEl('h2', { text: '📖 Journaling Templates' });

		// Journal template
		new Setting(containerEl)
			.setName('📖 Journal template')
			.setDesc('Template for personal journal')
			.addTextArea((text: any) => text
				.setPlaceholder('Enter journal template...')
				.setValue(this.plugin.settings.templates.journal)
				.onChange(async (value: string) => {
					this.plugin.settings.templates.journal = value;
					await this.plugin.saveSettings();
				})
				.inputEl.style.height = '120px');

		// General Settings
		containerEl.createEl('h2', { text: '⚙️ General Settings' });

		// Auto create folders
		new Setting(containerEl)
			.setName('📁 Auto create folders')
			.setDesc('Automatically create folders if they don\'t exist')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.autoCreateFolders)
				.onChange(async (value: boolean) => {
					this.plugin.settings.autoCreateFolders = value;
					await this.plugin.saveSettings();
				}));

		// Default folder
		new Setting(containerEl)
			.setName('🎯 Default folder')
			.setDesc('Default folder for new notes')
			.addDropdown((dropdown: any) => dropdown
				.addOption('daily', '📅 Daily')
				.addOption('journal', '📖 Journal')
				.addOption('knowledge', '🧠 Knowledge')
				.addOption('ide', '💡 Ide')
				.addOption('notes', '📝 Notes')
				.addOption('projects', '🚀 Projects')
				.addOption('areas', '🎯 Areas')
				.addOption('resources', '📚 Resources')
				.addOption('ideas', '💭 Ideas')
				.setValue(this.plugin.settings.defaultFolder)
				.onChange(async (value: 'daily' | 'journal' | 'knowledge' | 'ide' | 'notes' | 'projects' | 'areas' | 'resources' | 'ideas') => {
					this.plugin.settings.defaultFolder = value;
					await this.plugin.saveSettings();
				}));

		// Include tags
		new Setting(containerEl)
			.setName('🏷️ Include tags')
			.setDesc('Automatically include tags in frontmatter')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.includeTags)
				.onChange(async (value: boolean) => {
					this.plugin.settings.includeTags = value;
					await this.plugin.saveSettings();
				}));

		// Animations
		new Setting(containerEl)
			.setName('✨ Enable animations')
			.setDesc('Enable smooth animations and transitions')
			.addToggle((toggle: any) => toggle
				.setValue(this.plugin.settings.animations)
				.onChange(async (value: boolean) => {
					this.plugin.settings.animations = value;
					await this.plugin.saveSettings();
				}));

		// Filename Format
		new Setting(containerEl)
			.setName('📝 Filename format')
			.setDesc('Choose how filenames are formatted')
			.addDropdown((dropdown: any) => dropdown
				.addOption('original', '📄 Original (Dunia itu berputar)')
				.addOption('clean', '✨ Clean (Dunia itu berputar)')
				.addOption('hyphenated', '🔗 Hyphenated (dunia-itu-berputar)')
				.setValue(this.plugin.settings.filenameFormat)
				.onChange(async (value: 'hyphenated' | 'original' | 'clean') => {
					this.plugin.settings.filenameFormat = value;
					await this.plugin.saveSettings();
				}));
	}
}