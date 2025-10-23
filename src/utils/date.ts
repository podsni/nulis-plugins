import type { TemplateLanguage } from '../types';

const MONTH_NAMES: Record<TemplateLanguage, { short: string[]; long: string[] }> = {
	id: {
		short: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
		long: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
	},
	en: {
		short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	}
};

const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export function formatDate(date: Date, format: string, language: TemplateLanguage): string {
	if (!format || typeof format !== 'string') {
		return formatDate(date, DEFAULT_DATE_FORMAT, language);
	}

	let output = format;
	const year = date.getFullYear();
	const monthIndex = date.getMonth();
	const month = monthIndex + 1;
	const day = date.getDate();

	const tokens: Array<[RegExp, string]> = [
		[/YYYY/g, year.toString()],
		[/YY/g, year.toString().slice(-2).padStart(2, '0')],
		[/MMMM/g, MONTH_NAMES[language]?.long?.[monthIndex] ?? MONTH_NAMES.en.long[monthIndex]],
		[/MMM/g, MONTH_NAMES[language]?.short?.[monthIndex] ?? MONTH_NAMES.en.short[monthIndex]],
		[/MM/g, month.toString().padStart(2, '0')],
		[/M/g, month.toString()],
		[/DD/g, day.toString().padStart(2, '0')],
		[/D/g, day.toString()]
	];

	for (const [pattern, replacement] of tokens) {
		output = output.replace(pattern, replacement);
	}

	return output;
}

export function formatDateForFilename(
	date: Date,
	format: string,
	language: TemplateLanguage
): string {
	const raw = formatDate(date, format, language);
	return raw
		.replace(/[:*?"<>|\\/]/g, '-')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function formatIsoDate(date: Date): string {
	return date.toISOString().split('T')[0];
}
