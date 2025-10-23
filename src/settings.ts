import type { Plugin } from 'obsidian';
import type { NoteType, NulisajaPluginSettings, TemplateLanguage } from './types';

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

function cloneTemplates(language: TemplateLanguage): TemplateMap {
	return { ...TEMPLATE_SETS[language] };
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
	templateLanguage: 'id'
};

export async function loadSettings(plugin: Plugin): Promise<NulisajaPluginSettings> {
	const raw = (await plugin.loadData()) as Partial<NulisajaPluginSettings> | null;
	const templateLanguage = raw?.templateLanguage ?? DEFAULT_SETTINGS.templateLanguage;
	const languageDefaults = cloneTemplates(templateLanguage);

	const settings: NulisajaPluginSettings = {
		...DEFAULT_SETTINGS,
		...raw,
		templateLanguage,
		folders: {
			...DEFAULT_SETTINGS.folders,
			...(raw?.folders ?? {})
		},
		templates: {
			...languageDefaults,
			...(raw?.templates ?? {})
		},
		defaultTags: raw?.defaultTags ?? [...DEFAULT_SETTINGS.defaultTags]
	};

	let updated = false;

	(Object.keys(languageDefaults) as NoteType[]).forEach((type) => {
		if (!settings.templates[type]) {
			settings.templates[type] = languageDefaults[type];
			updated = true;
		}
	});

	(Object.keys(DEFAULT_SETTINGS.folders) as NoteType[]).forEach((type) => {
		if (!settings.folders[type]) {
			settings.folders[type] = DEFAULT_SETTINGS.folders[type];
			updated = true;
		}
	});

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
