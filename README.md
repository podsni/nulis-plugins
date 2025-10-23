# Nulisaja - Quick Note Creation Plugin

Plugin Obsidian Nulisaja untuk membuat catatan dengan template otomatis dan pengorganisasian folder yang mudah.

## Fitur

- 🚀 **Pembuatan Catatan Cepat**: Buat catatan dengan satu klik melalui ribbon atau command palette
- 📁 **Pengorganisasian Folder**: Otomatis mengorganisir catatan ke folder Knowledge, Ide, atau Notes
- 📝 **Template Otomatis**: Template yang dapat dikustomisasi untuk setiap jenis catatan
- 🏷️ **Frontmatter Otomatis**: Tags dan metadata otomatis untuk setiap catatan
- ⚙️ **Pengaturan Lengkap**: Konfigurasi folder, template, dan preferensi lainnya

## Cara Menggunakan

### 1. Ribbon Icon
Klik ikon "file-plus" di ribbon kiri untuk membuka menu cepat pembuatan catatan.

### 2. Command Palette
Gunakan Command Palette (Ctrl/Cmd + P) dan cari:
- "Create Daily Note"
- "Create Knowledge Note" 
- "Create Ide Note"
- "Create General Note"
- "Create Note with Folder Selection"

### 3. Menu Cepat
Menu cepat menyediakan opsi:
- 📅 **Daily Note**: Catatan harian dengan template khusus
- 🧠 **Knowledge Note**: Catatan pengetahuan dengan struktur yang terorganisir
- 💡 **Ide Note**: Catatan ide dengan template untuk brainstorming
- 📝 **General Note**: Catatan umum untuk keperluan sehari-hari
- 📁 **Choose Folder**: Pilih folder tujuan secara manual

## Pengaturan

Buka **Settings → Community plugins → Nulisaja** untuk mengkonfigurasi:

### Folder Settings
- **Daily folder**: Nama folder untuk catatan harian
- **Knowledge folder**: Nama folder untuk catatan pengetahuan
- **Ide folder**: Nama folder untuk catatan ide
- **Notes folder**: Nama folder untuk catatan umum

### Template Settings
- **Daily template**: Template untuk catatan harian
- **Knowledge template**: Template untuk catatan pengetahuan
- **Ide template**: Template untuk catatan ide
- **Notes template**: Template untuk catatan umum

### General Settings
- **Auto create folders**: Otomatis membuat folder jika belum ada
- **Default folder**: Folder default untuk catatan baru
- **Include tags**: Otomatis menyertakan tags dalam frontmatter

## Template Default

### Daily Note
```markdown
---
tags:
  - daily
---
## Notes

```

### Knowledge Note
```markdown
---
created: 2025-01-23
tags:
  - note
  - journal
---

```

### Ide Note
```markdown
---
created: 2025-01-23
tags:
  - note
  - journal
---

```

### General Note
```markdown
---
created: 2025-01-23
tags:
  - note
  - journal
---

```

## Format Nama File

Plugin akan otomatis membuat nama file dengan format tanggal di depan:

- **Daily Note**: `2025-01-23.md`
- **Knowledge/Ide/Notes**: `2025-01-23 nama-judul.md`

Contoh: Jika Anda membuat catatan dengan judul "Cinta dan Benci", nama filenya akan menjadi `2025-01-23 cinta-dan-benci.md`

## Instalasi

1. Download file `main.js`, `manifest.json`, dan `styles.css`
2. Copy ke folder plugin: `<Vault>/.obsidian/plugins/nulisaja/`
3. Reload Obsidian dan aktifkan plugin di **Settings → Community plugins**

## Pengembangan

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
```

## Lisensi

MIT License
