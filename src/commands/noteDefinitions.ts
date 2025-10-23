import type { NoteCommandDefinition } from '../types';

export const NOTE_DEFINITIONS: NoteCommandDefinition[] = [
	{
		type: 'daily',
		commandId: 'create-daily-note',
		commandName: '📅 Buat Catatan Harian',
		icon: '📅',
		menuLabel: 'Catatan Harian',
		menuDescription: 'Buat catatan harian',
		loadingMessage: '⏳ Creating daily note...',
		successMessage: '✅ Daily note created successfully!',
		errorMessagePrefix: '❌ Error creating daily note: ',
		defaultTitle: () => `Daily ${new Date().toLocaleDateString()}`
	},
	{
		type: 'journal',
		commandId: 'create-journal-note',
		commandName: '📖 Buat Jurnal',
		icon: '📖',
		menuLabel: 'Jurnal',
		menuDescription: 'Buat jurnal pribadi',
		loadingMessage: '⏳ Membuat jurnal...',
		successMessage: '✅ Jurnal berhasil dibuat!',
		errorMessagePrefix: '❌ Error membuat jurnal: ',
		prompt: {
			title: 'Jurnal',
			placeholder: 'Apa yang ingin Anda tulis di jurnal hari ini?',
			cancelNotice: '❌ Pembuatan jurnal dibatalkan - tidak ada judul'
		}
	},
	{
		type: 'knowledge',
		commandId: 'create-knowledge-note',
		commandName: '🧠 Buat Catatan Pengetahuan',
		icon: '🧠',
		menuLabel: 'Pengetahuan',
		menuDescription: 'Catatan pembelajaran',
		loadingMessage: '⏳ Creating knowledge note...',
		successMessage: '✅ Knowledge note created successfully!',
		errorMessagePrefix: '❌ Error creating knowledge note: ',
		prompt: {
			title: 'Knowledge Note',
			placeholder: 'Enter the topic you want to learn about...',
			cancelNotice: '❌ Note creation cancelled - no title provided'
		}
	},
	{
		type: 'ide',
		commandId: 'create-brainstorm-note',
		commandName: '💡 Buat Catatan Brainstorm',
		icon: '💡',
		menuLabel: 'Ideas',
		menuDescription: 'Brainstorming',
		loadingMessage: '⏳ Creating brainstorm note...',
		successMessage: '✅ Brainstorm note created successfully!',
		errorMessagePrefix: '❌ Error creating brainstorm note: ',
		prompt: {
			title: 'Brainstorm Note',
			placeholder: 'What idea do you want to explore?',
			cancelNotice: '❌ Brainstorm note creation cancelled - no title provided'
		}
	},
	{
		type: 'notes',
		commandId: 'create-general-note',
		commandName: '📝 Buat Catatan Umum',
		icon: '📝',
		menuLabel: 'Umum',
		menuDescription: 'Catatan cepat',
		loadingMessage: '⏳ Creating general note...',
		successMessage: '✅ General note created successfully!',
		errorMessagePrefix: '❌ Error creating general note: ',
		prompt: {
			title: 'General Note',
			placeholder: 'What do you want to write about?',
			cancelNotice: '❌ Note creation cancelled - no title provided'
		}
	},
	{
		type: 'projects',
		commandId: 'create-project-note',
		commandName: '🚀 Buat Catatan Proyek',
		icon: '🚀',
		menuLabel: 'Proyek',
		menuDescription: 'Proyek aktif',
		loadingMessage: '⏳ Membuat catatan proyek...',
		successMessage: '✅ Catatan proyek berhasil dibuat!',
		errorMessagePrefix: '❌ Error membuat catatan proyek: ',
		prompt: {
			title: 'Project Note',
			placeholder: 'What project are you working on?',
			cancelNotice: '❌ Pembuatan catatan proyek dibatalkan - tidak ada judul'
		}
	},
	{
		type: 'areas',
		commandId: 'create-area-note',
		commandName: '🎯 Buat Catatan Area',
		icon: '🎯',
		menuLabel: 'Area',
		menuDescription: 'Area jangka panjang',
		loadingMessage: '⏳ Membuat catatan area...',
		successMessage: '✅ Catatan area berhasil dibuat!',
		errorMessagePrefix: '❌ Error membuat catatan area: ',
		prompt: {
			title: 'Area Note',
			placeholder: 'What area of responsibility?',
			cancelNotice: '❌ Pembuatan catatan area dibatalkan - tidak ada judul'
		}
	},
	{
		type: 'resources',
		commandId: 'create-resource-note',
		commandName: '📚 Buat Catatan Sumber Daya',
		icon: '📚',
		menuLabel: 'Sumber Daya',
		menuDescription: 'Referensi & tools',
		loadingMessage: '⏳ Membuat catatan sumber daya...',
		successMessage: '✅ Catatan sumber daya berhasil dibuat!',
		errorMessagePrefix: '❌ Error membuat catatan sumber daya: ',
		prompt: {
			title: 'Resource Note',
			placeholder: 'What resource are you documenting?',
			cancelNotice: '❌ Pembuatan catatan sumber daya dibatalkan - tidak ada judul'
		}
	},
	{
		type: 'ideas',
		commandId: 'create-idea-note',
		commandName: '💡 Buat Catatan Ide (Zettelkasten)',
		icon: '💭',
		menuLabel: 'Zettelkasten',
		menuDescription: 'Ide atomic',
		loadingMessage: '⏳ Membuat catatan ide...',
		successMessage: '✅ Catatan ide berhasil dibuat!',
		errorMessagePrefix: '❌ Error membuat catatan ide: ',
		prompt: {
			title: 'Catatan Ide',
			placeholder: 'Ide atomic apa yang ingin Anda tangkap?',
			cancelNotice: '❌ Pembuatan catatan ide dibatalkan - tidak ada judul'
		}
	}
];
