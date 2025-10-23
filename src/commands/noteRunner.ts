import { Notice } from 'obsidian';
import type { NoteCommandDefinition, NotePlugin } from '../types';
import { promptForTitle } from '../ui/titlePrompt';
import type { QuickMenuAction } from '../ui/quickMenu';
import { NoteService } from '../services/noteService';

export async function runNoteAction(
	plugin: NotePlugin,
	noteService: NoteService,
	definition: NoteCommandDefinition
): Promise<void> {
	let loadingNotice: Notice | undefined;

	try {
		const title = await resolveTitle(plugin, definition);
		if (!title) {
			return;
		}

		loadingNotice = new Notice(definition.loadingMessage, 0);
		const { file, alreadyExisted } = await noteService.createNote(definition.type, title);
		await plugin.app.workspace.getLeaf().openFile(file);

		loadingNotice.hide();
		if (alreadyExisted) {
			new Notice(definition.existingMessage ?? '⚠️ Note already exists. Opening existing file.', 3000);
		} else {
			new Notice(definition.successMessage, 3000);
		}

	} catch (error) {
		if (loadingNotice) {
			loadingNotice.hide();
		}

		console.error(`Nulisaja Plugin: Error creating ${definition.type} note`, error);

		const message = error instanceof Error ? error.message : String(error);
		new Notice(definition.errorMessagePrefix + message, 5000);
	}
}

export function createQuickMenuActions(
	plugin: NotePlugin,
	noteService: NoteService,
	definitions: NoteCommandDefinition[]
): QuickMenuAction[] {
	return definitions.map((definition) => ({
		icon: definition.icon,
		label: definition.menuLabel,
		description: definition.menuDescription,
		handler: () => {
			void runNoteAction(plugin, noteService, definition);
		}
	}));
}

async function resolveTitle(plugin: NotePlugin, definition: NoteCommandDefinition): Promise<string | null> {
	if (definition.defaultTitle) {
		return definition.defaultTitle();
	}

	if (!definition.prompt) {
		return null;
	}

	const result = await promptForTitle(plugin.app, definition.prompt.title, definition.prompt.placeholder);
	const trimmed = result?.trim() ?? '';
	if (!trimmed) {
		new Notice(definition.prompt.cancelNotice);
		return null;
	}

	return trimmed;
}
