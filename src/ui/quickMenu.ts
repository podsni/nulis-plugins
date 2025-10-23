export interface QuickMenuAction {
	icon: string;
	label: string;
	description: string;
	handler: () => void;
}

interface QuickMenuOptions {
	title?: string;
	animations?: boolean;
}

const MENU_CLASS = 'nulisaja-quick-menu';
const OVERLAY_CLASS = 'nulisaja-quick-menu-overlay';

type OverlayElement = HTMLElement & { __nulisajaCleanup?: () => void };

export function showQuickMenu(actions: QuickMenuAction[], options: QuickMenuOptions = {}): void {
	const existingMenu = document.querySelector(`.${MENU_CLASS}`);
	if (existingMenu instanceof HTMLElement) {
		closeMenu(existingMenu, options.animations !== false);
	}

	const overlay = document.createElement('div') as OverlayElement;
	overlay.className = OVERLAY_CLASS;

	const titleText = options.title ?? '✨ Pembuatan Catatan Cepat';

	const menu = document.createElement('div');
	menu.className = MENU_CLASS;
	menu.tabIndex = -1;
	menu.setAttribute('role', 'dialog');
	menu.setAttribute('aria-modal', 'true');
	menu.setAttribute('aria-label', titleText);

	overlay.appendChild(menu);

	const title = document.createElement('h3');
	title.className = 'nulisaja-menu-title';
	title.textContent = titleText;
	menu.appendChild(title);

	const buttonsContainer = document.createElement('div');
	buttonsContainer.className = 'nulisaja-buttons-container';

	actions.forEach((action) => {
		const button = document.createElement('button');
		button.className = 'nulisaja-menu-button';

		const iconSpan = document.createElement('span');
		iconSpan.textContent = action.icon;
		iconSpan.style.fontSize = '1.2em';

		const textSpan = document.createElement('span');
		textSpan.innerHTML = `<div style="font-weight: 600;">${action.label}</div><div style="font-size: 0.8em; opacity: 0.7;">${action.description}</div>`;

		button.appendChild(iconSpan);
		button.appendChild(textSpan);

		button.addEventListener('click', () => {
			try {
				action.handler();
			} finally {
				removeEventListeners();
				closeMenu(menu, options.animations !== false);
			}
		});

		buttonsContainer.appendChild(button);
	});

	menu.appendChild(buttonsContainer);

	const closeBtn = document.createElement('button');
	closeBtn.className = 'nulisaja-close-button';
	closeBtn.textContent = '❌ Close';
	closeBtn.addEventListener('click', () => {
		removeEventListeners();
		closeMenu(menu, options.animations !== false);
	});

	menu.appendChild(closeBtn);
	document.body.appendChild(overlay);
	try {
		menu.focus({ preventScroll: true });
	} catch {
		menu.focus();
	}

	const handleOutsidePointerDown = (event: PointerEvent) => {
		if (!menu.contains(event.target as Node)) {
			removeEventListeners();
			closeMenu(menu, options.animations !== false);
		}
	};

	const handleEscapeKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			removeEventListeners();
			closeMenu(menu, options.animations !== false);
		}
	};

	const removeEventListeners = () => {
		overlay.removeEventListener('pointerdown', handleOutsidePointerDown);
		document.removeEventListener('keydown', handleEscapeKey);
	};
	overlay.__nulisajaCleanup = removeEventListeners;

	if (options.animations === false) {
		menu.style.animation = 'none';
		overlay.style.animation = 'none';
	}

	window.setTimeout(() => {
		overlay.addEventListener('pointerdown', handleOutsidePointerDown);
		document.addEventListener('keydown', handleEscapeKey);
	}, 50);
}

function closeMenu(menu: HTMLElement, animate: boolean): void {
	const overlay = menu.closest(`.${OVERLAY_CLASS}`) as OverlayElement | null;
	overlay?.__nulisajaCleanup?.();
	if (overlay) {
		overlay.__nulisajaCleanup = undefined;
	}

	if (!menu.parentElement) {
		if (overlay) {
			overlay.remove();
		}
		return;
	}

	if (!animate) {
		if (overlay) {
			overlay.remove();
		} else {
			menu.remove();
		}
		return;
	}

	menu.style.animation = 'nulisaja-fade-out 0.2s ease-in forwards';
	if (overlay) {
		overlay.style.animation = 'nulisaja-overlay-fade-out 0.2s ease-in forwards';
	}
	window.setTimeout(() => {
		if (overlay) {
			overlay.remove();
		} else {
			menu.remove();
		}
	}, 200);
}
