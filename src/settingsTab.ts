import {
	App,
	ButtonComponent,
	DropdownComponent,
	Notice,
	PluginSettingTab,
	Setting,
	TextAreaComponent,
	TextComponent,
	ToggleComponent
} from 'obsidian';
import { NOTE_DEFINITIONS } from './commands/noteDefinitions';
import { createTemplateCollection, getDefaultTemplates } from './settings';
import { formatDate, formatIsoDate } from './utils/date';
import { promptForTitle } from './ui/titlePrompt';
import type { NoteType, SettingsPlugin, TemplateAlias, TemplateLanguage } from './types';

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

const NOTE_TYPE_LIST: NoteType[] = [
	'daily',
	'knowledge',
	'ide',
	'notes',
	'projects',
	'areas',
	'resources',
	'ideas',
	'journal'
];

const NOTE_TYPE_LABEL: Record<NoteType, string> = NOTE_DEFINITIONS.reduce((map, def) => {
	map[def.type] = def.commandName;
	return map;
}, {} as Record<NoteType, string>);

export class NulisajaSettingTab extends PluginSettingTab {
	private templatePreviews = new Map<NoteType, HTMLPreElement>();

	constructor(app: App, private readonly plugin: SettingsPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		this.templatePreviews.clear();

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
				this.renderFolderAliasControls(containerEl, item.key);
			});
		});
	}

	private renderTemplateSettings(containerEl: HTMLElement): void {
		this.renderTemplateCollections(containerEl);
		TEMPLATE_SECTIONS.forEach((section) => {
			containerEl.createEl('h2', { text: section.title });
			section.items.forEach((item) => {
				const templateSetting = new Setting(containerEl)
					.setName(item.name)
					.setDesc(item.desc)
					.addTextArea((textArea: TextAreaComponent) => {
						textArea
							.setPlaceholder(item.placeholder)
							.setValue(this.plugin.settings.templates[item.key])
							.onChange(async (value) => this.updateTemplate(item.key, value));
						textArea.inputEl.style.height = '120px';
					});

				this.renderTemplatePreview(templateSetting.settingEl, item.key);
				this.renderTemplateAliasControls(containerEl, item.key);
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

		this.renderDateFormatSettings(containerEl);
		this.renderHotkeySettings(containerEl);
	}

	private async updateFolder(key: NoteType, value: string): Promise<void> {
		this.plugin.settings.folders[key] = value;
		await this.plugin.saveSettings();
	}

	private async updateTemplate(key: NoteType, value: string): Promise<void> {
		this.plugin.settings.templates[key] = value;
		this.syncActiveCollectionTemplate(key);
		await this.plugin.saveSettings();
		this.updateTemplatePreview(key);
	}

	private async updateTemplateLanguage(language: TemplateLanguage): Promise<void> {
		if (this.plugin.settings.templateLanguage === language) {
			return;
		}
		this.plugin.settings.templateLanguage = language;
		let collections = this.plugin.settings.templateCollections[language];
		if (!collections || collections.length === 0) {
			const fallback = createTemplateCollection(
				language,
				language === 'id' ? 'Default Indonesia' : 'Default English',
				getDefaultTemplates(language),
				true
			);
			collections = [fallback];
			this.plugin.settings.templateCollections[language] = collections;
			this.plugin.settings.activeTemplateCollections[language] = fallback.id;
			this.plugin.settings.templates = { ...fallback.templates };
		} else {
			const activeId =
				this.plugin.settings.activeTemplateCollections[language] ?? collections[0].id;
			const activeCollection =
				collections.find((collection) => collection.id === activeId) ?? collections[0];
			this.plugin.settings.activeTemplateCollections[language] = activeCollection.id;
			this.plugin.settings.templates = { ...activeCollection.templates };
		}
		await this.plugin.saveSettings();
		this.display();
	}

	private get currentLanguage(): TemplateLanguage {
		return this.plugin.settings.templateLanguage;
	}

	private getLanguageLabel(language: TemplateLanguage): string {
		return LANGUAGE_OPTIONS.find((option) => option.key === language)?.label ?? language.toUpperCase();
	}

	private renderTemplateCollections(containerEl: HTMLElement): void {
		const language = this.currentLanguage;
		const collections = this.plugin.settings.templateCollections[language] ?? [];
		const activeId = this.plugin.settings.activeTemplateCollections[language];

		const setting = new Setting(containerEl)
			.setName('🗂 Template collections')
			.setDesc(
				`Kelola kumpulan template untuk bahasa ${this.getLanguageLabel(language)}.`
			);

		setting.addDropdown((dropdown: DropdownComponent) => {
			collections.forEach((collection) => {
				dropdown.addOption(collection.id, collection.name);
			});
			if (!collections.some((collection) => collection.id === activeId) && collections[0]) {
				dropdown.setValue(collections[0].id);
			} else if (activeId) {
				dropdown.setValue(activeId);
			}
			dropdown.onChange(async (value) => {
				await this.applyTemplateCollection(value);
			});
		});

		setting.addButton((button: ButtonComponent) =>
			button
				.setButtonText('New')
				.onClick(async () => {
					await this.createCollectionFromCurrent();
				})
		);

		setting.addButton((button: ButtonComponent) =>
			button
				.setButtonText('Rename')
				.onClick(async () => {
					await this.renameActiveCollection();
				})
		);

		setting.addButton((button: ButtonComponent) =>
			button
				.setButtonText('Duplicate')
				.onClick(async () => {
					await this.duplicateActiveCollection();
				})
		);

		setting.addButton((button: ButtonComponent) =>
			button
				.setButtonText('Delete')
				.setWarning()
				.onClick(async () => {
					await this.deleteActiveCollection();
				})
		);

		setting.addButton((button: ButtonComponent) =>
			button
				.setButtonText('Save current')
				.onClick(async () => {
					this.syncActiveCollection();
					await this.plugin.saveSettings();
					new Notice('Template collection updated.');
				})
		);
	}

	private async applyTemplateCollection(collectionId: string): Promise<void> {
		const language = this.currentLanguage;
		const collections = this.plugin.settings.templateCollections[language] ?? [];
		const target = collections.find((collection) => collection.id === collectionId);
		if (!target) {
			new Notice('Template collection not found.');
			return;
		}
		this.plugin.settings.activeTemplateCollections[language] = target.id;
		this.plugin.settings.templates = { ...target.templates };
		this.syncActiveCollection();
		await this.plugin.saveSettings();
		this.display();
	}

	private async createCollectionFromCurrent(): Promise<void> {
		const language = this.currentLanguage;
		const name = await this.promptForText(
			language === 'id' ? 'Nama koleksi baru' : 'New collection name',
			language === 'id' ? 'Masukkan nama koleksi' : 'Enter collection name'
		);
		if (!name) {
			return;
		}
		const list =
			this.plugin.settings.templateCollections[language] ?? (this.plugin.settings.templateCollections[language] = []);
		const collection = createTemplateCollection(language, name.trim(), this.plugin.settings.templates);
		list.push(collection);
		this.plugin.settings.activeTemplateCollections[language] = collection.id;
		await this.plugin.saveSettings();
		new Notice('Template collection created.');
		this.display();
	}

	private async renameActiveCollection(): Promise<void> {
		const language = this.currentLanguage;
		const activeId = this.plugin.settings.activeTemplateCollections[language];
		const collections = this.plugin.settings.templateCollections[language] ?? [];
		const collection = collections.find((item) => item.id === activeId);
		if (!collection) {
			new Notice('No collection selected.');
			return;
		}
		if (collection.builtin) {
			new Notice('Built-in collections cannot be renamed.');
			return;
		}
		const name = await this.promptForText(
			language === 'id' ? 'Ganti nama koleksi' : 'Rename collection',
			language === 'id'
				? `Nama baru (sekarang: ${collection.name})`
				: `New name (current: ${collection.name})`
		);
		if (!name) {
			return;
		}
		collection.name = name.trim();
		await this.plugin.saveSettings();
		this.display();
	}

	private async duplicateActiveCollection(): Promise<void> {
		const language = this.currentLanguage;
		const activeId = this.plugin.settings.activeTemplateCollections[language];
		const collections = this.plugin.settings.templateCollections[language] ?? [];
		const collection = collections.find((item) => item.id === activeId);
		if (!collection) {
			new Notice('No collection selected.');
			return;
		}
		const copy = createTemplateCollection(
			language,
			`${collection.name} Copy`,
			collection.templates
		);
		collections.push(copy);
		this.plugin.settings.activeTemplateCollections[language] = copy.id;
		await this.plugin.saveSettings();
		new Notice('Template collection duplicated.');
		this.display();
	}

	private async deleteActiveCollection(): Promise<void> {
		const language = this.currentLanguage;
		const collections = this.plugin.settings.templateCollections[language] ?? [];
		if (collections.length <= 1) {
			new Notice('Cannot delete the last collection.');
			return;
		}
		const activeId = this.plugin.settings.activeTemplateCollections[language];
		const index = collections.findIndex((collection) => collection.id === activeId);
		if (index === -1) {
			new Notice('No collection selected.');
			return;
		}
		if (collections[index].builtin) {
			new Notice('Built-in collections cannot be deleted.');
			return;
		}
		collections.splice(index, 1);
		const fallback = collections[0];
		this.plugin.settings.activeTemplateCollections[language] = fallback.id;
		this.plugin.settings.templates = { ...fallback.templates };
		await this.plugin.saveSettings();
		new Notice('Template collection deleted.');
		this.display();
	}

	private syncActiveCollectionTemplate(noteType: NoteType): void {
		const language = this.currentLanguage;
		const activeId = this.plugin.settings.activeTemplateCollections[language];
		const collections = this.plugin.settings.templateCollections[language] ?? [];
		const index = collections.findIndex((collection) => collection.id === activeId);
		if (index === -1) {
			return;
		}
		collections[index] = {
			...collections[index],
			templates: {
				...collections[index].templates,
				[noteType]: this.plugin.settings.templates[noteType]
			}
		};
	}

	private syncActiveCollection(): void {
		const language = this.currentLanguage;
		const activeId = this.plugin.settings.activeTemplateCollections[language];
		const collections = this.plugin.settings.templateCollections[language] ?? [];
		const index = collections.findIndex((collection) => collection.id === activeId);
		if (index === -1) {
			return;
		}
		collections[index] = {
			...collections[index],
			templates: { ...this.plugin.settings.templates }
		};
	}

	private renderTemplatePreview(parentEl: HTMLElement, noteType: NoteType): void {
		const wrapper = parentEl.createDiv({ cls: 'nulisaja-template-preview-wrapper' });
		wrapper.createEl('div', {
			text:
				this.currentLanguage === 'id'
					? 'Pratinjau (contoh hasil)'
					: 'Preview (sample output)',
			cls: 'nulisaja-template-preview-title'
		});
		const pre = wrapper.createEl('pre', {
			cls: 'nulisaja-template-preview'
		});
		this.templatePreviews.set(noteType, pre);
		this.updateTemplatePreview(noteType);
	}

	private updateTemplatePreview(noteType: NoteType): void {
		const preview = this.templatePreviews.get(noteType);
		if (!preview) {
			return;
		}
		const language = this.currentLanguage;
		const dateFormat = this.plugin.settings.dateFormats[language] ?? 'YYYY-MM-DD';
		const now = new Date();
		const variables: Record<string, string> = {
			title: this.getSampleTitle(noteType, language),
			date: formatDate(now, dateFormat, language),
			date_iso: formatIsoDate(now),
			language
		};
		preview.textContent = this.applyTemplatePreview(this.plugin.settings.templates[noteType] ?? '', variables).trim();
	}

	private getSampleTitle(noteType: NoteType, language: TemplateLanguage): string {
		const samples: Record<TemplateLanguage, Record<NoteType, string>> = {
			id: {
				daily: 'Catatan Harian',
				knowledge: 'Catatan Pembelajaran',
				ide: 'Ide Baru',
				notes: 'Catatan Umum',
				projects: 'Proyek Prioritas',
				areas: 'Area Tanggung Jawab',
				resources: 'Referensi Favorit',
				ideas: 'Ide Zettelkasten',
				journal: 'Jurnal Malam'
			},
			en: {
				daily: 'Daily Note',
				knowledge: 'Learning Summary',
				ide: 'Brainstorm Idea',
				notes: 'General Note',
				projects: 'Priority Project',
				areas: 'Responsibility Area',
				resources: 'Resource Highlight',
				ideas: 'Zettelkasten Idea',
				journal: 'Evening Journal'
			}
		};
		return samples[language]?.[noteType] ?? 'Sample Title';
	}

	private applyTemplatePreview(template: string, variables: Record<string, string>): string {
		if (!template) {
			return '';
		}
		let rendered = template;
		Object.entries(variables).forEach(([key, value]) => {
			rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
		});
		return rendered.replace(/{{[^}]+}}/g, '');
	}

	private renderTemplateAliasControls(containerEl: HTMLElement, noteType: NoteType): void {
		const aliases = this.plugin.settings.templateAliases[noteType] ?? [];
		const language = this.currentLanguage;
		const setting = new Setting(containerEl)
			.setName(language === 'id' ? '🔖 Template aliases' : '🔖 Template aliases')
			.setDesc(
				language === 'id'
					? 'Simpan variasi template dan terapkan dengan satu klik.'
					: 'Store alternate templates and apply them in one click.'
			);

		setting.addButton((button) =>
			button.setButtonText(language === 'id' ? 'Tambah alias' : 'Add alias').onClick(async () => {
				await this.createTemplateAlias(noteType);
			})
		);

		aliases.forEach((alias) => {
			const aliasSetting = new Setting(containerEl)
				.setName(`• ${alias.name}`)
				.setDesc(
					language === 'id'
						? 'Klik untuk menerapkan atau ubah alias ini.'
						: 'Apply or edit this alias.'
				);
			aliasSetting.addButton((button) =>
				button.setButtonText(language === 'id' ? 'Gunakan' : 'Apply').onClick(async () => {
					this.plugin.settings.templates[noteType] = alias.content;
					this.syncActiveCollectionTemplate(noteType);
					await this.plugin.saveSettings();
					this.updateTemplatePreview(noteType);
					this.display();
				})
			);
			aliasSetting.addButton((button) =>
				button.setButtonText(language === 'id' ? 'Ubah' : 'Rename').onClick(async () => {
					const name = await this.promptForText(
						language === 'id' ? 'Ganti nama alias' : 'Rename alias',
						language === 'id'
							? `Nama baru (sekarang: ${alias.name})`
							: `New name (current: ${alias.name})`
					);
					if (!name) {
						return;
					}
					alias.name = name.trim();
					await this.plugin.saveSettings();
					this.display();
				})
			);
			aliasSetting.addButton((button) =>
				button.setIcon('trash').setTooltip('Delete').onClick(async () => {
					await this.deleteTemplateAlias(noteType, alias.id);
				})
			);
		});
	}

	private async createTemplateAlias(noteType: NoteType): Promise<void> {
		const language = this.currentLanguage;
		const name = await this.promptForText(
			language === 'id' ? 'Nama alias template' : 'Alias name',
			language === 'id' ? 'Masukkan nama alias' : 'Enter alias name'
		);
		if (!name) {
			return;
		}
		const alias: TemplateAlias = {
			id: `${noteType}-${Math.random().toString(36).slice(2, 10)}`,
			name: name.trim(),
			content: this.plugin.settings.templates[noteType]
		};
		this.plugin.settings.templateAliases[noteType] = [
			...(this.plugin.settings.templateAliases[noteType] ?? []),
			alias
		];
		await this.plugin.saveSettings();
		this.display();
	}

	private async deleteTemplateAlias(noteType: NoteType, aliasId: string): Promise<void> {
		this.plugin.settings.templateAliases[noteType] = this.plugin.settings.templateAliases[noteType]?.filter(
			(alias) => alias.id !== aliasId
		) ?? [];
		await this.plugin.saveSettings();
		this.display();
	}

	private renderFolderAliasControls(containerEl: HTMLElement, noteType: NoteType): void {
		const language = this.currentLanguage;
		const aliases = this.plugin.settings.folderAliases[noteType] ?? [];
		let pendingAlias = '';
		const setting = new Setting(containerEl)
			.setName(language === 'id' ? 'Folder aliases' : 'Folder aliases')
			.setDesc(
				language === 'id'
					? 'Tambahkan nama folder alternatif untuk berpindah cepat.'
					: 'Add alternate folder paths for quick switching.'
			);

		setting.addText((text) =>
			text
				.setPlaceholder(language === 'id' ? 'contoh: Kerja/Work' : 'e.g. Work/Projects')
				.onChange((value) => {
					pendingAlias = value;
				})
		);
		setting.addButton((button) =>
			button.setButtonText(language === 'id' ? 'Tambah' : 'Add').onClick(async () => {
				const alias = pendingAlias.trim();
				if (!alias) {
					return;
				}
				await this.addFolderAlias(noteType, alias);
				pendingAlias = '';
				this.display();
			})
		);

		aliases.forEach((alias) => {
			const aliasSetting = new Setting(containerEl)
				.setName(alias)
				.setDesc(language === 'id' ? 'Klik untuk menggunakan alias ini.' : 'Click to use this alias.');
			aliasSetting.addButton((button) =>
				button.setButtonText(language === 'id' ? 'Gunakan' : 'Use').onClick(async () => {
					await this.useFolderAlias(noteType, alias);
				})
			);
			aliasSetting.addButton((button) =>
				button.setIcon('trash').setTooltip('Delete').onClick(async () => {
					await this.removeFolderAlias(noteType, alias);
				})
			);
		});
	}

	private async addFolderAlias(noteType: NoteType, alias: string): Promise<void> {
		const list = this.plugin.settings.folderAliases[noteType] ?? [];
		if (!list.includes(alias)) {
			list.push(alias);
			this.plugin.settings.folderAliases[noteType] = list;
			await this.plugin.saveSettings();
			new Notice('Alias ditambahkan.');
		}
	}

	private async removeFolderAlias(noteType: NoteType, alias: string): Promise<void> {
		this.plugin.settings.folderAliases[noteType] = (this.plugin.settings.folderAliases[noteType] ?? []).filter(
			(value) => value !== alias
		);
		await this.plugin.saveSettings();
		this.display();
	}

	private async useFolderAlias(noteType: NoteType, alias: string): Promise<void> {
		this.plugin.settings.folders[noteType] = alias;
		await this.plugin.saveSettings();
		this.display();
	}

	private renderDateFormatSettings(containerEl: HTMLElement): void {
		containerEl.createEl('h3', {
			text: this.currentLanguage === 'id' ? '📅 Format tanggal' : '📅 Date formats'
		});

		LANGUAGE_OPTIONS.forEach((option) => {
			const formatSetting = new Setting(containerEl)
				.setName(`${option.label}`)
				.setDesc('Gunakan token: YYYY, YY, MMMM, MMM, MM, M, DD, D');
			formatSetting.addText((text) => {
				text
					.setPlaceholder(option.key === 'id' ? 'DD MMM YYYY' : 'YYYY-MM-DD')
					.setValue(this.plugin.settings.dateFormats[option.key] ?? '')
					.onChange(async (value) => {
						this.plugin.settings.dateFormats[option.key] = value.trim() || (option.key === 'id' ? 'DD MMM YYYY' : 'YYYY-MM-DD');
						await this.plugin.saveSettings();
						this.templatePreviews.forEach((_, noteType) => this.updateTemplatePreview(noteType));
					});
			});
		});
	}

	private renderHotkeySettings(containerEl: HTMLElement): void {
		containerEl.createEl('h3', {
			text: '⌨️ Hotkey configurator'
		});

		new Setting(containerEl)
			.setName(this.currentLanguage === 'id' ? 'Catatan' : 'Notes')
			.setDesc(
				'Hotkey yang diatur di sini menjadi default command. Untuk menerapkan perubahan secara penuh, reload plugin atau Obsidian.'
			);

		NOTE_TYPE_LIST.forEach((noteType) => {
			const setting = new Setting(containerEl)
				.setName(NOTE_TYPE_LABEL[noteType] ?? noteType)
				.setDesc('Gunakan format: Ctrl+Shift+X atau Mod+Alt+N');
			let pending = this.plugin.settings.hotkeys[noteType] ?? '';
			setting.addText((text) => {
				text
					.setPlaceholder('Ctrl+Shift+D')
					.setValue(pending)
					.onChange(async (value) => {
						pending = value.trim();
						if (pending) {
							this.plugin.settings.hotkeys[noteType] = pending;
						} else {
							delete this.plugin.settings.hotkeys[noteType];
						}
						await this.plugin.saveSettings();
					});
			});
		});
	}

	private async promptForText(title: string, placeholder: string): Promise<string | null> {
		const result = await promptForTitle(this.app, title, placeholder);
		return result?.trim().length ? result : null;
	}
}
