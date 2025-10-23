import type { Plugin } from 'obsidian';
import type { NoteType, NulisajaPluginSettings } from './types';

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
	templates: {
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

## 📋 Resource Type
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

## 🌅 Pagi Ini
- **Mood**: 
- **Energi**: 
- **Fokus**: 

## 📝 Refleksi Hari Ini
- **Yang berjalan baik**: 
- **Yang bisa diperbaiki**: 
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
	autoCreateFolders: true,
	defaultFolder: 'notes',
	includeTags: true,
	defaultTags: ['daily'],
	theme: 'auto',
	animations: true,
	filenameFormat: 'original'
};

export async function loadSettings(plugin: Plugin): Promise<NulisajaPluginSettings> {
	const raw = (await plugin.loadData()) as Partial<NulisajaPluginSettings> | null;

	const settings: NulisajaPluginSettings = {
		...DEFAULT_SETTINGS,
		...raw,
		folders: {
			...DEFAULT_SETTINGS.folders,
			...(raw?.folders ?? {})
		},
		templates: {
			...DEFAULT_SETTINGS.templates,
			...(raw?.templates ?? {})
		},
		defaultTags: raw?.defaultTags ?? [...DEFAULT_SETTINGS.defaultTags]
	};

	let updated = false;

	(Object.keys(DEFAULT_SETTINGS.templates) as NoteType[]).forEach((type) => {
		if (!settings.templates[type]) {
			settings.templates[type] = DEFAULT_SETTINGS.templates[type];
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

export async function saveSettings(plugin: Plugin, settings: NulisajaPluginSettings): Promise<void> {
	await plugin.saveData(settings);
}
