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

export function showQuickMenu(actions: QuickMenuAction[], options: QuickMenuOptions = {}): void {
	const existing = document.querySelector(`.${MENU_CLASS}`);
	if (existing instanceof HTMLElement) {
		closeMenu(existing, options.animations !== false);
	}

	const menu = document.createElement('div');
	menu.className = MENU_CLASS;

	if (options.animations === false) {
		menu.style.animation = 'none';
	}

	const title = document.createElement('h3');
	title.className = 'nulisaja-menu-title';
	title.textContent = options.title ?? '✨ Pembuatan Catatan Cepat';
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
				document.removeEventListener('click', handleOutsideClick);
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
		document.removeEventListener('click', handleOutsideClick);
		closeMenu(menu, options.animations !== false);
	});

	menu.appendChild(closeBtn);
	document.body.appendChild(menu);

	const handleOutsideClick = (event: MouseEvent) => {
		if (!menu.contains(event.target as Node)) {
			closeMenu(menu, options.animations !== false);
			document.removeEventListener('click', handleOutsideClick);
		}
	};

	setTimeout(() => {
		document.addEventListener('click', handleOutsideClick);
	}, 100);
}

function closeMenu(menu: HTMLElement, animate: boolean): void {
	if (!menu.parentElement) {
		return;
	}

	if (!animate) {
		menu.remove();
		return;
	}

	menu.style.animation = 'nulisaja-fade-out 0.2s ease-in forwards';
	window.setTimeout(() => {
		menu.remove();
	}, 200);
}
