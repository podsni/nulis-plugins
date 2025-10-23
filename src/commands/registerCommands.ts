import type { NoteCommandDefinition, NotePlugin } from '../types';

export function registerNoteCommands(
	plugin: NotePlugin,
	definitions: NoteCommandDefinition[],
	runAction: (definition: NoteCommandDefinition) => Promise<void> | void,
	openQuickMenu: () => void
): void {
	definitions.forEach((definition) => {
		plugin.addCommand({
			id: definition.commandId,
			name: definition.commandName,
			callback: () => {
				try {
					void runAction(definition);
				} catch (error) {
					console.error('Nulisaja Plugin: Error executing command', error);
				}
			}
		});
	});

	plugin.addCommand({
		id: 'show-quick-menu',
		name: '🚀 Tampilkan Menu Cepat',
		callback: () => {
			try {
				openQuickMenu();
			} catch (error) {
				console.error('Nulisaja Plugin: Error opening quick menu command', error);
			}
		}
	});
}
