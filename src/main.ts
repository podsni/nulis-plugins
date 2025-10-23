import { Notice, Plugin } from 'obsidian';
import { NOTE_DEFINITIONS } from './commands/noteDefinitions';
import { createQuickMenuActions, runNoteAction } from './commands/noteRunner';
import { registerNoteCommands } from './commands/registerCommands';
import { NoteService } from './services/noteService';
import { loadSettings, saveSettings } from './settings';
import { NulisajaSettingTab } from './settingsTab';
import { injectStyles, removeStyles } from './styles';
import type { NoteCommandDefinition, NulisajaPluginSettings } from './types';
import type { QuickMenuAction } from './ui/quickMenu';
import { showQuickMenu } from './ui/quickMenu';

export default class NulisajaPlugin extends Plugin {
	settings: NulisajaPluginSettings;

	private noteService!: NoteService;
	private quickMenuActions: QuickMenuAction[] = [];

	async onload(): Promise<void> {
		console.log('Nulisaja Plugin: Loading...');

		this.settings = await loadSettings(this);
		this.noteService = new NoteService(this);
		this.quickMenuActions = createQuickMenuActions(this, this.noteService, NOTE_DEFINITIONS);

		injectStyles();

		const ribbonIcon = this.addRibbonIcon('pen-tool', 'Nulisaja - Quick Note Creation', () => {
			this.openQuickMenu();
		});
		ribbonIcon.addClass('nulisaja-ribbon-icon');

		registerNoteCommands(
			this,
			NOTE_DEFINITIONS,
			(definition) => this.executeNoteDefinition(definition),
			() => this.openQuickMenu()
		);

		this.addSettingTab(new NulisajaSettingTab(this.app, this));

		console.log('Nulisaja Plugin: Successfully loaded');
		new Notice('✨ Nulisaja Plugin loaded successfully!');
	}

	onunload(): void {
		removeStyles();
	}

	async saveSettings(): Promise<void> {
		await saveSettings(this, this.settings);
	}

	private openQuickMenu(): void {
		showQuickMenu(this.quickMenuActions, {
			animations: this.settings.animations
		});
	}

	private executeNoteDefinition(definition: NoteCommandDefinition): Promise<void> {
		return runNoteAction(this, this.noteService, definition);
	}
}
