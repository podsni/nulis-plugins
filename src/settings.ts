import type { Plugin } from 'obsidian';
import type {
	NoteType,
	NulisajaPluginSettings,
	TemplateAlias,
	TemplateCollection,
	TemplateLanguage
} from './types';

type TemplateMap = Record<NoteType, string>;

const TEMPLATE_SETS: Record<TemplateLanguage, TemplateMap> = {
	id: {
		daily: `---
tags:
  - daily
---
## Catatan

![[Daily.base]]

`,
		knowledge: `---
created: {{date}}
tags:
  - knowledge
  - learning
---
# 🧠 {{title}}

## 📚 Ringkasan


## 🔗 Poin Penting
- 

## 💡 Wawasan
- 

## 📖 Referensi
- 

`,
		ide: `---
created: {{date}}
tags:
  - idea
  - brainstorming
---
# 💡 {{title}}

## 🎯 Masalah Utama


## 💭 Ide
- 

## ✅ Solusi
- 

## 🚀 Langkah Selanjutnya
- 

`,
		notes: `---
created: {{date}}
tags:
  - note
---
# 📝 {{title}}

## 📋 Konten


## 🔗 Terkait
- 

## 📌 Tindak Lanjut
- 

`,
		projects: `---
created: {{date}}
tags:
  - project
  - active
---
# 🚀 {{title}}

## 📋 Ringkasan Proyek


## 🎯 Tujuan
- 

## 📅 Garis Waktu
- **Mulai**: 
- **Batas Waktu**: 
- **Status**: 

## 📝 Tugas
- [ ] 
- [ ] 
- [ ] 

## 🔗 Sumber Daya
- 

## 📊 Perkembangan
- 

`,
		areas: `---
created: {{date}}
tags:
  - area
  - responsibility
---
# 🎯 {{title}}

## 📋 Deskripsi Area


## 🎯 Tujuan
- 

## 📊 Metrik
- 

## 📝 Fokus Saat Ini
- 

## 🔗 Proyek Terkait
- 

## 📚 Sumber Daya
- 

`,
		resources: `---
created: {{date}}
tags:
  - resource
  - reference
---
# 📚 {{title}}

## 📋 Jenis Sumber
- **Tipe**: 
- **Kategori**: 
- **Sumber**: 

## 📝 Ringkasan


## 🔗 Poin Penting
- 

## 💡 Cara Menggunakan
- 

## 🔗 Sumber Terkait
- 

## 📌 Tindak Lanjut
- 

`,
		ideas: `---
created: {{date}}
tags:
  - idea
  - atomic
  - zettelkasten
---
# 💡 {{title}}

## 🎯 Konsep Utama


## 🔗 Koneksi
- **Terkait dengan**: 
- **Membangun dari**: 
- **Mengarah ke**: 

## 📝 Pengembangan
- 

## 💭 Catatan
- 

## 🔗 Referensi
- 

`,
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
- **Yang dapat ditingkatkan**: 
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
	en: {
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

## 📋 Resource Details
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
		journal: `---
created: {{date}}
tags:
  - journal
  - personal
---
# 📖 {{title}}

## 🌅 Morning Check-in
- **Mood**: 
- **Energy**: 
- **Focus**: 

## 📝 Daily Reflection
- **Went well**: 
- **Could improve**: 
- **Lesson learned**: 

## 💭 Thoughts & Feelings
- 

## 🎯 Tomorrow
- **Goals**: 
- **Priorities**: 

## 🙏 Gratitude
- 

`
	}
};

const NOTE_TYPES = Object.keys(TEMPLATE_SETS.id) as NoteType[];

function cloneTemplates(language: TemplateLanguage): TemplateMap {
	return { ...TEMPLATE_SETS[language] };
}

const DEFAULT_COLLECTION_IDS: Record<TemplateLanguage, string> = {
	id: 'default-id',
	en: 'default-en'
};

function generateCollectionId(language: TemplateLanguage): string {
	return `${language}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneCollection(collection: TemplateCollection): TemplateCollection {
	return {
		...collection,
		templates: { ...collection.templates }
	};
}

export function createTemplateCollection(
	language: TemplateLanguage,
	name: string,
	templates: TemplateMap,
	builtin = false,
	id?: string
): TemplateCollection {
	return {
		id: builtin ? DEFAULT_COLLECTION_IDS[language] : id ?? generateCollectionId(language),
		name,
		templates: { ...templates },
		builtin
	};
}

function createDefaultCollection(language: TemplateLanguage): TemplateCollection {
	return createTemplateCollection(
		language,
		language === 'id' ? 'Default Indonesia' : 'Default English',
		cloneTemplates(language),
		true,
		DEFAULT_COLLECTION_IDS[language]
	);
}

function ensureTemplateValues(templates: TemplateMap, language: TemplateLanguage): TemplateMap {
	const ensured = { ...templates } as TemplateMap;
	const defaults = TEMPLATE_SETS[language];
	NOTE_TYPES.forEach((type) => {
		if (!ensured[type]) {
			ensured[type] = defaults[type];
		}
	});
	return ensured;
}

function ensureCollections(
	language: TemplateLanguage,
	collections: TemplateCollection[] | undefined
): TemplateCollection[] {
	const source = Array.isArray(collections) && collections.length > 0 ? collections : [createDefaultCollection(language)];
	const normalized = source.map((collection) => {
		const normalizedId = collection.id || generateCollectionId(language);
		return {
			...collection,
			id: collection.builtin ? DEFAULT_COLLECTION_IDS[language] : normalizedId,
			templates: ensureTemplateValues(collection.templates ?? cloneTemplates(language), language),
			builtin: collection.builtin ?? collection.id === DEFAULT_COLLECTION_IDS[language]
		} as TemplateCollection;
	});

	if (!normalized.some((collection) => collection.builtin)) {
		normalized.unshift(createDefaultCollection(language));
	}

	return normalized.map(cloneCollection);
}

function createEmptyFolderAliases(): Record<NoteType, string[]> {
	const map = {} as Record<NoteType, string[]>;
	NOTE_TYPES.forEach((type) => {
		map[type] = [];
	});
	return map;
}

function createEmptyTemplateAliases(): Record<NoteType, TemplateAlias[]> {
	const map = {} as Record<NoteType, TemplateAlias[]>;
	NOTE_TYPES.forEach((type) => {
		map[type] = [];
	});
	return map;
}

function generateAliasId(noteType: NoteType): string {
	return `${noteType}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeFolderAliases(
	aliases: Record<NoteType, string[]> | undefined
): Record<NoteType, string[]> {
	const normalized = createEmptyFolderAliases();
	if (!aliases) {
		return normalized;
	}
	NOTE_TYPES.forEach((type) => {
		const items = aliases[type];
		if (Array.isArray(items)) {
			normalized[type] = items.filter((alias) => typeof alias === 'string' && alias.trim().length > 0);
		}
	});
	return normalized;
}

function normalizeTemplateAliases(
	aliasMap: Record<NoteType, TemplateAlias[]> | undefined,
	language: TemplateLanguage
): Record<NoteType, TemplateAlias[]> {
	const normalized = createEmptyTemplateAliases();
	if (!aliasMap) {
		return normalized;
	}
	NOTE_TYPES.forEach((type) => {
		const list = aliasMap[type];
		if (Array.isArray(list)) {
			normalized[type] = list
				.filter((alias) => alias && typeof alias.content === 'string')
				.map((alias) => ({
					id: alias.id ?? generateAliasId(type),
					name:
						alias.name?.trim() ||
						(language === 'id' ? 'Template Alternatif' : 'Alternate Template'),
					content: alias.content
				}));
		}
	});
	return normalized;
}

const DEFAULT_TEMPLATE_COLLECTIONS: Record<TemplateLanguage, TemplateCollection[]> = {
	id: [createDefaultCollection('id')],
	en: [createDefaultCollection('en')]
};

function cloneDefaultCollections(): Record<TemplateLanguage, TemplateCollection[]> {
	return {
		id: DEFAULT_TEMPLATE_COLLECTIONS.id.map(cloneCollection),
		en: DEFAULT_TEMPLATE_COLLECTIONS.en.map(cloneCollection)
	};
}

export const DEFAULT_SETTINGS: NulisajaPluginSettings = {
	folders: {
		daily: 'Daily',
		knowledge: 'Knowledge',
		ide: 'Ide',
		notes: 'Notes',
		projects: 'PROJECTS',
		areas: 'AREAS',
		resources: 'RESOURCES',
		ideas: 'IDEAS',
		journal: 'journal'
	},
	templates: cloneTemplates('id'),
	autoCreateFolders: true,
	defaultFolder: 'notes',
	includeTags: true,
	defaultTags: ['daily'],
	theme: 'auto',
	animations: true,
	filenameFormat: 'original',
	templateLanguage: 'id',
	templateCollections: cloneDefaultCollections(),
	activeTemplateCollections: {
		id: DEFAULT_TEMPLATE_COLLECTIONS.id[0].id,
		en: DEFAULT_TEMPLATE_COLLECTIONS.en[0].id
	},
	folderAliases: createEmptyFolderAliases(),
	templateAliases: createEmptyTemplateAliases(),
	dateFormats: {
		id: 'DD MMM YYYY',
		en: 'YYYY-MM-DD'
	},
	hotkeys: {}
};

export async function loadSettings(plugin: Plugin): Promise<NulisajaPluginSettings> {
	const raw = (await plugin.loadData()) as Partial<NulisajaPluginSettings> | null;
	const templateLanguage = raw?.templateLanguage ?? DEFAULT_SETTINGS.templateLanguage;

	const templateCollections = {
		id: ensureCollections('id', raw?.templateCollections?.id ?? DEFAULT_SETTINGS.templateCollections.id),
		en: ensureCollections('en', raw?.templateCollections?.en ?? DEFAULT_SETTINGS.templateCollections.en)
	};

	const activeTemplateCollections = {
		id: raw?.activeTemplateCollections?.id ?? templateCollections.id[0].id,
		en: raw?.activeTemplateCollections?.en ?? templateCollections.en[0].id
	};

	const activeCollectionList = templateCollections[templateLanguage];
	const activeCollection =
		activeCollectionList.find((collection) => collection.id === activeTemplateCollections[templateLanguage]) ??
		activeCollectionList[0];

	const activeTemplates = {
		...activeCollection.templates,
		...(raw?.templates ?? {})
	};

	const folders = {
		...DEFAULT_SETTINGS.folders,
		...(raw?.folders ?? {})
	};

	const defaultTags = raw?.defaultTags ?? [...DEFAULT_SETTINGS.defaultTags];
	const dateFormats = {
		...DEFAULT_SETTINGS.dateFormats,
		...(raw?.dateFormats ?? {})
	};
	const folderAliases = normalizeFolderAliases(raw?.folderAliases);
	const templateAliases = normalizeTemplateAliases(raw?.templateAliases, templateLanguage);

	const settings: NulisajaPluginSettings = {
		...DEFAULT_SETTINGS,
		...raw,
		templateLanguage,
		templates: activeTemplates,
		folders,
		defaultTags,
		templateCollections,
		activeTemplateCollections,
		folderAliases,
		templateAliases,
		dateFormats,
		hotkeys: { ...(raw?.hotkeys ?? {}) }
	};

	const activeIndex = activeCollectionList.findIndex((collection) => collection.id === activeCollection.id);
	if (activeIndex >= 0) {
		activeCollectionList[activeIndex] = {
			...activeCollectionList[activeIndex],
			templates: { ...activeTemplates }
		};
	}

	let updated = false;

	NOTE_TYPES.forEach((type) => {
		if (!settings.templates[type]) {
			settings.templates[type] = TEMPLATE_SETS[templateLanguage][type];
			updated = true;
		}
		if (!settings.folders[type]) {
			settings.folders[type] = DEFAULT_SETTINGS.folders[type];
			updated = true;
		}
	});

	if (!settings.dateFormats.id) {
		settings.dateFormats.id = DEFAULT_SETTINGS.dateFormats.id;
		updated = true;
	}
	if (!settings.dateFormats.en) {
		settings.dateFormats.en = DEFAULT_SETTINGS.dateFormats.en;
		updated = true;
	}

	if (updated) {
		await saveSettings(plugin, settings);
	}

	return settings;
}

export function getDefaultTemplates(language: TemplateLanguage): TemplateMap {
	return cloneTemplates(language);
}

export async function saveSettings(plugin: Plugin, settings: NulisajaPluginSettings): Promise<void> {
	await plugin.saveData(settings);
}
