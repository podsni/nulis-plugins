import type { Plugin } from 'obsidian';

export type NoteType =
	| 'daily'
	| 'knowledge'
	| 'ide'
	| 'notes'
	| 'projects'
	| 'areas'
	| 'resources'
	| 'ideas'
	| 'journal';

export type TemplateLanguage = 'id' | 'en';

export interface TemplateCollection {
	readonly id: string;
	name: string;
	templates: Record<NoteType, string>;
	builtin?: boolean;
}

export interface TemplateAlias {
	readonly id: string;
	name: string;
	content: string;
}

export interface NulisajaPluginSettings {
	folders: Record<NoteType, string>;
	templates: Record<NoteType, string>;
	autoCreateFolders: boolean;
	defaultFolder: NoteType;
	includeTags: boolean;
	defaultTags: string[];
	theme: 'light' | 'dark' | 'auto';
	animations: boolean;
	filenameFormat: 'hyphenated' | 'original' | 'clean';
	templateLanguage: TemplateLanguage;
	templateCollections: Record<TemplateLanguage, TemplateCollection[]>;
	activeTemplateCollections: Record<TemplateLanguage, string>;
	folderAliases: Record<NoteType, string[]>;
	templateAliases: Record<NoteType, TemplateAlias[]>;
	dateFormats: Record<TemplateLanguage, string>;
	hotkeys: Partial<Record<NoteType, string>>;
}

export interface NotePlugin extends Plugin {
	settings: NulisajaPluginSettings;
}

export interface SettingsPlugin extends NotePlugin {
	saveSettings(): Promise<void>;
}

export interface NoteCommandDefinition {
	type: NoteType;
	commandId: string;
	commandName: string;
	icon: string;
	menuLabel: string;
	menuDescription: string;
	loadingMessage: string;
	successMessage: string;
	errorMessagePrefix: string;
	prompt?: {
		title: string;
		placeholder: string;
		cancelNotice: string;
	};
	defaultTitle?: () => string;
}
