import type { Hotkey } from 'obsidian';
import type { NoteCommandDefinition, NotePlugin } from '../types';

export function registerNoteCommands(
	plugin: NotePlugin,
	definitions: NoteCommandDefinition[],
	runAction: (definition: NoteCommandDefinition) => Promise<void> | void,
	openQuickMenu: () => void
): void {
	definitions.forEach((definition) => {
		const hotkeys = parseHotkeySetting(plugin.settings.hotkeys?.[definition.type]);
		const command = {
			id: definition.commandId,
			name: definition.commandName,
			callback: () => {
				try {
					void runAction(definition);
				} catch (error) {
					console.error('Nulisaja Plugin: Error executing command', error);
				}
			}
		} as Parameters<NotePlugin['addCommand']>[0];
		if (hotkeys) {
			command.hotkeys = hotkeys;
		}
		plugin.addCommand(command);
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

function parseHotkeySetting(value: string | undefined): Hotkey[] | undefined {
	if (!value) {
		return undefined;
	}
	const combos = value
		.split(',')
		.map((combo) => combo.trim())
		.filter((combo) => combo.length > 0);
	const parsed: Hotkey[] = [];
	combos.forEach((combo) => {
		const parts = combo.split('+').map((part) => part.trim()).filter((part) => part.length > 0);
		if (parts.length === 0) {
			return;
		}
		const key = parts.pop();
		if (!key) {
			return;
		}
		const modifiers = parts
			.map((modifier) => normalizeModifier(modifier))
			.filter((modifier): modifier is Hotkey['modifiers'][number] => !!modifier);
		parsed.push({ modifiers, key: key.length === 1 ? key.toLowerCase() : key });
	});
	return parsed.length > 0 ? parsed : undefined;
}

function normalizeModifier(value: string): Hotkey['modifiers'][number] | null {
	switch (value.toLowerCase()) {
		case 'mod':
		case 'cmd':
		case 'command':
			return 'Mod';
		case 'ctrl':
		case 'control':
			return 'Ctrl';
		case 'shift':
			return 'Shift';
		case 'alt':
		case 'option':
			return 'Alt';
		case 'meta':
		case 'win':
		case 'windows':
			return 'Meta';
		default:
			return null;
	}
}
