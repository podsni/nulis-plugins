import { TFile } from 'obsidian';
import type { NotePlugin, NoteType } from '../types';

interface TemplateVariables {
	title: string;
	date: string;
}

export class NoteService {
	constructor(private readonly plugin: NotePlugin) {}

	async createNote(noteType: NoteType, title: string, folderPath?: string): Promise<TFile> {
		const trimmedTitle = title?.trim();
		if (!trimmedTitle) {
			throw new Error('Invalid title provided');
		}

		const settings = this.plugin.settings;

		const template = settings.templates[noteType];
		if (!template) {
			throw new Error(`Invalid note type: ${noteType}. Available types: ${Object.keys(settings.templates).join(', ')}`);
		}

		const folderSetting = settings.folders[noteType];
		if (!folderSetting) {
			throw new Error(`Invalid folder setting for note type: ${noteType}. Available folders: ${Object.keys(settings.folders).join(', ')}`);
		}

		const processedTemplate = this.processTemplate(template, {
			title: trimmedTitle,
			date: new Date().toISOString().split('T')[0]
		});

		const filename = this.generateFilename(trimmedTitle, noteType);

		const targetFolder =
			noteType === 'daily'
				? folderPath ?? settings.folders.daily
				: folderPath ?? folderSetting;

		await this.ensureFolderExists(targetFolder);

		const filePath = `${targetFolder}/${filename}`;
		const existingFile = this.plugin.app.vault.getAbstractFileByPath(filePath);
		if (existingFile) {
			throw new Error(`File already exists: ${filePath}`);
		}

		const file = await this.plugin.app.vault.create(filePath, processedTemplate);
		if (!file) {
			throw new Error(`Failed to create file: ${filePath}`);
		}

		return file;
	}

	private processTemplate(template: string, variables: TemplateVariables): string {
		if (!template) {
			return '';
		}

		let processedTemplate = template;

		Object.entries(variables).forEach(([key, value]) => {
			if (key && value !== undefined && value !== null) {
				const regex = new RegExp(`{{${key}}}`, 'g');
				processedTemplate = processedTemplate.replace(regex, String(value));
			}
		});

		const currentDate = new Date().toISOString().split('T')[0];
		processedTemplate = processedTemplate.replace(/{{date}}/g, currentDate);
		processedTemplate = processedTemplate.replace(/{{[^}]+}}/g, '');

		return processedTemplate;
	}

	private generateFilename(title: string, noteType: NoteType): string {
		const currentDate = new Date().toISOString().split('T')[0];

		if (noteType === 'daily') {
			return `${currentDate}.md`;
		}

		const formattedTitle = this.formatTitleForFilename(title);
		return `${currentDate} ${formattedTitle}.md`;
	}

	private formatTitleForFilename(title: string): string {
		const { filenameFormat } = this.plugin.settings;

		let formatted = title.trim().replace(/\s+/g, ' ');

		switch (filenameFormat) {
			case 'original':
				formatted = this.toTitleCase(formatted)
					.replace(/[<>:"/\\|?*]/g, '')
					.replace(/\s+/g, ' ')
					.trim();
				return formatted || 'Untitled';
			case 'clean':
				formatted = this.toTitleCase(formatted)
					.replace(/[^\w\s\-.,!?()]/g, '')
					.replace(/\s+/g, ' ')
					.trim();
				return formatted || 'Untitled';
			case 'hyphenated':
			default:
				formatted = this.toTitleCase(formatted)
					.replace(/[^\w\s\-.,!?()]/g, '')
					.replace(/\s+/g, ' ')
					.trim()
					.toLowerCase()
					.replace(/\s+/g, '-')
					.replace(/-+/g, '-')
					.replace(/^-+|-+$/g, '');
				return formatted || 'untitled';
		}
	}

	private toTitleCase(value: string): string {
		try {
			return value
				.toLowerCase()
				.split(' ')
				.map((word) => {
					if (word.length === 0) {
						return word;
					}
					return word.charAt(0).toUpperCase() + word.slice(1);
				})
				.join(' ');
		} catch (error) {
			console.error('Nulisaja Plugin: Error converting to title case:', error);
			return value;
		}
	}

	private async ensureFolderExists(folderPath: string): Promise<void> {
		try {
			const folder = this.plugin.app.vault.getAbstractFileByPath(folderPath);
			if (!folder) {
				await this.plugin.app.vault.createFolder(folderPath);
			} else if (folder instanceof TFile) {
				throw new Error(`Path ${folderPath} exists but is a file, not a folder`);
			}
		} catch (error) {
			if (error instanceof Error && error.message.includes('already exists')) {
				return;
			}
			throw error instanceof Error ? error : new Error(String(error));
		}
	}
}
