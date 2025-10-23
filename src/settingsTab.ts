import {
	App,
	DropdownComponent,
	PluginSettingTab,
	Setting,
	TextAreaComponent,
	TextComponent,
	ToggleComponent
} from 'obsidian';
import { getDefaultTemplates } from './settings';
import type { NoteType, SettingsPlugin, TemplateLanguage } from './types';

interface FolderField {
	key: NoteType;
	name: string;
	desc: string;
	placeholder: string;
}

interface TemplateField {
	key: NoteType;
	name: string;
	desc: string;
	placeholder: string;
}

interface SectionConfig<T> {
	title: string;
	items: T[];
}

const FOLDER_SECTIONS: SectionConfig<FolderField>[] = [
	{
		title: '📁 Folder Settings',
		items: [
			{ key: 'daily', name: '📅 Daily folder', desc: 'Folder name for daily notes', placeholder: 'Daily' },
			{ key: 'knowledge', name: '🧠 Knowledge folder', desc: 'Folder name for knowledge notes', placeholder: 'Knowledge' },
			{ key: 'ide', name: '💡 Ide folder', desc: 'Folder name for ide notes', placeholder: 'Ide' },
			{ key: 'notes', name: '📝 Notes folder', desc: 'Folder name for general notes', placeholder: 'Notes' }
		]
	},
	{
		title: '🚀 PARA System Folders',
		items: [
			{
				key: 'projects',
				name: '🚀 Projects folder',
				desc: 'Folder name for active projects (PARA: Projects)',
				placeholder: 'PROJECTS'
			},
			{
				key: 'areas',
				name: '🎯 Areas folder',
				desc: 'Folder name for long-term areas (PARA: Areas)',
				placeholder: 'AREAS'
			},
			{
				key: 'resources',
				name: '📚 Resources folder',
				desc: 'Folder name for references and tools (PARA: Resources)',
				placeholder: 'RESOURCES'
			}
		]
	},
	{
		title: '📖 Journaling System',
		items: [
			{
				key: 'journal',
				name: '📖 Journal folder',
				desc: 'Folder name for personal journal',
				placeholder: 'journal'
			}
		]
	},
	{
		title: '💭 Zettelkasten System',
		items: [
			{
				key: 'ideas',
				name: '💭 Ideas folder',
				desc: 'Folder name for atomic notes (Zettelkasten)',
				placeholder: 'IDEAS'
			}
		]
	}
];

const TEMPLATE_SECTIONS: SectionConfig<TemplateField>[] = [
	{
		title: '📄 Template Settings',
		items: [
			{ key: 'daily', name: '📅 Daily template', desc: 'Template for daily notes', placeholder: 'Enter daily template...' },
			{
				key: 'knowledge',
				name: '🧠 Knowledge template',
				desc: 'Template for knowledge notes',
				placeholder: 'Enter knowledge template...'
			},
			{
				key: 'ide',
				name: '💡 Ide template',
				desc: 'Template for ide notes',
				placeholder: 'Enter ide template...'
			},
			{
				key: 'notes',
				name: '📝 Notes template',
				desc: 'Template for general notes',
				placeholder: 'Enter notes template...'
			}
		]
	},
	{
		title: '🚀 PARA System Templates',
		items: [
			{
				key: 'projects',
				name: '🚀 Projects template',
				desc: 'Template for project notes',
				placeholder: 'Enter projects template...'
			},
			{
				key: 'areas',
				name: '🎯 Areas template',
				desc: 'Template for area notes',
				placeholder: 'Enter areas template...'
			},
			{
				key: 'resources',
				name: '📚 Resources template',
				desc: 'Template for resource notes',
				placeholder: 'Enter resources template...'
			}
		]
	},
	{
		title: '💭 Zettelkasten Templates',
		items: [
			{
				key: 'ideas',
				name: '💭 Ideas template',
				desc: 'Template for atomic idea notes',
				placeholder: 'Enter ideas template...'
			}
		]
	},
	{
		title: '📖 Journaling Templates',
		items: [
			{
				key: 'journal',
				name: '📖 Journal template',
				desc: 'Template for personal journal',
				placeholder: 'Enter journal template...'
			}
		]
	}
];

const DEFAULT_FOLDER_OPTIONS: Array<{ key: NoteType; label: string }> = [
	{ key: 'daily', label: '📅 Daily' },
	{ key: 'journal', label: '📖 Journal' },
	{ key: 'knowledge', label: '🧠 Knowledge' },
	{ key: 'ide', label: '💡 Ide' },
	{ key: 'notes', label: '📝 Notes' },
	{ key: 'projects', label: '🚀 Projects' },
	{ key: 'areas', label: '🎯 Areas' },
	{ key: 'resources', label: '📚 Resources' },
	{ key: 'ideas', label: '💭 Ideas' }
];

const FILENAME_OPTIONS: Array<{ key: 'hyphenated' | 'original' | 'clean'; label: string }> = [
	{ key: 'original', label: '📄 Original (Dunia itu berputar)' },
	{ key: 'clean', label: '✨ Clean (Dunia itu berputar)' },
	{ key: 'hyphenated', label: '🔗 Hyphenated (dunia-itu-berputar)' }
];

const LANGUAGE_OPTIONS: Array<{ key: TemplateLanguage; label: string }> = [
	{ key: 'id', label: 'Bahasa Indonesia' },
	{ key: 'en', label: 'English' }
];

export class NulisajaSettingTab extends PluginSettingTab {
	constructor(app: App, private readonly plugin: SettingsPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const header = containerEl.createDiv();
		header.style.cssText = 'text-align: center; margin-bottom: 30px;';
		header.createEl('h1', { text: '✨ Nulisaja Plugin Settings' });
		header.createEl('p', { text: 'Configure your note creation experience' });

		this.renderFolderSettings(containerEl);
		this.renderTemplateSettings(containerEl);
		this.renderGeneralSettings(containerEl);
	}

	private renderFolderSettings(containerEl: HTMLElement): void {
		FOLDER_SECTIONS.forEach((section) => {
			containerEl.createEl('h2', { text: section.title });
			section.items.forEach((item) => {
				new Setting(containerEl)
					.setName(item.name)
					.setDesc(item.desc)
					.addText((text: TextComponent) =>
						text
							.setPlaceholder(item.placeholder)
							.setValue(this.plugin.settings.folders[item.key])
							.onChange(async (value) => this.updateFolder(item.key, value))
					);
			});
		});
	}

	private renderTemplateSettings(containerEl: HTMLElement): void {
		TEMPLATE_SECTIONS.forEach((section) => {
			containerEl.createEl('h2', { text: section.title });
			section.items.forEach((item) => {
				new Setting(containerEl)
					.setName(item.name)
					.setDesc(item.desc)
					.addTextArea((textArea: TextAreaComponent) => {
						textArea
							.setPlaceholder(item.placeholder)
							.setValue(this.plugin.settings.templates[item.key])
							.onChange(async (value) => this.updateTemplate(item.key, value));
						textArea.inputEl.style.height = '120px';
					});
			});
		});
	}

	private renderGeneralSettings(containerEl: HTMLElement): void {
		containerEl.createEl('h2', { text: '⚙️ General Settings' });

		new Setting(containerEl)
			.setName('🌐 Template language')
			.setDesc('Pilih bahasa default untuk template bawaan')
			.addDropdown((dropdown: DropdownComponent) => {
				LANGUAGE_OPTIONS.forEach((option) => dropdown.addOption(option.key, option.label));
				dropdown
					.setValue(this.plugin.settings.templateLanguage)
					.onChange(async (value: TemplateLanguage) => {
						await this.updateTemplateLanguage(value);
					});
			});

		new Setting(containerEl)
			.setName('📁 Auto create folders')
			.setDesc("Automatically create folders if they don't exist")
			.addToggle((toggle: ToggleComponent) =>
				toggle
					.setValue(this.plugin.settings.autoCreateFolders)
					.onChange(async (value) => {
						this.plugin.settings.autoCreateFolders = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('🎯 Default folder')
			.setDesc('Default folder for new notes')
			.addDropdown((dropdown: DropdownComponent) => {
				DEFAULT_FOLDER_OPTIONS.forEach((option) => {
					dropdown.addOption(option.key, option.label);
				});

				dropdown
					.setValue(this.plugin.settings.defaultFolder)
					.onChange(async (value: NoteType) => {
						this.plugin.settings.defaultFolder = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('🏷️ Include tags')
			.setDesc('Automatically include tags in frontmatter')
			.addToggle((toggle: ToggleComponent) =>
				toggle
					.setValue(this.plugin.settings.includeTags)
					.onChange(async (value) => {
						this.plugin.settings.includeTags = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('✨ Enable animations')
			.setDesc('Enable smooth animations and transitions')
			.addToggle((toggle: ToggleComponent) =>
				toggle
					.setValue(this.plugin.settings.animations)
					.onChange(async (value) => {
						this.plugin.settings.animations = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('📝 Filename format')
			.setDesc('Choose how filenames are formatted')
			.addDropdown((dropdown: DropdownComponent) => {
				FILENAME_OPTIONS.forEach((option) => dropdown.addOption(option.key, option.label));

				dropdown
					.setValue(this.plugin.settings.filenameFormat)
					.onChange(async (value: 'hyphenated' | 'original' | 'clean') => {
						this.plugin.settings.filenameFormat = value;
						await this.plugin.saveSettings();
					});
			});
	}

	private async updateFolder(key: NoteType, value: string): Promise<void> {
		this.plugin.settings.folders[key] = value;
		await this.plugin.saveSettings();
	}

	private async updateTemplate(key: NoteType, value: string): Promise<void> {
		this.plugin.settings.templates[key] = value;
		await this.plugin.saveSettings();
	}

	private async updateTemplateLanguage(language: TemplateLanguage): Promise<void> {
		if (this.plugin.settings.templateLanguage === language) {
			return;
		}
		this.plugin.settings.templateLanguage = language;
		this.plugin.settings.templates = getDefaultTemplates(language);
		await this.plugin.saveSettings();
		this.display();
	}
}
