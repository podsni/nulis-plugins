import { App, Modal } from 'obsidian';

export async function promptForTitle(app: App, title: string, placeholder: string): Promise<string | null> {
	return new Promise((resolve) => {
		class TitleModal extends Modal {
			private inputEl!: HTMLInputElement;
			private readonly resolver: (value: string | null) => void;
			private isResolved = false;

			constructor(modalApp: App, resolver: (value: string | null) => void) {
				super(modalApp);
				this.resolver = resolver;
				this.containerEl.addClass('nulisaja-modal');
			}

			onOpen(): void {
				const { contentEl } = this;

				const titleEl = contentEl.createEl('h2', { text: title });
				titleEl.className = 'nulisaja-modal-title';

				this.inputEl = contentEl.createEl('input', {
					type: 'text',
					placeholder
				}) as HTMLInputElement;
				this.inputEl.className = 'nulisaja-input';

				this.inputEl.addEventListener('keydown', (event) => {
					if (event.key === 'Enter') {
						this.resolveValue(this.inputEl.value.trim());
					} else if (event.key === 'Escape') {
						this.resolveValue(null);
					}
				});

				const buttonContainer = contentEl.createDiv();
				buttonContainer.className = 'nulisaja-button-group';

				const createBtn = buttonContainer.createEl('button', { text: '✅ Create' });
				createBtn.className = 'nulisaja-button nulisaja-button-primary';
				createBtn.addEventListener('click', () => {
					this.resolveValue(this.inputEl.value.trim());
				});

				const cancelBtn = buttonContainer.createEl('button', { text: '❌ Cancel' });
				cancelBtn.className = 'nulisaja-button nulisaja-button-secondary';
				cancelBtn.addEventListener('click', () => {
					this.resolveValue(null);
				});

				this.inputEl.focus();
			}

			onClose(): void {
				if (!this.isResolved) {
					this.isResolved = true;
					this.resolver(null);
				}
				this.contentEl.empty();
			}

			private resolveValue(value: string | null): void {
				if (this.isResolved) {
					return;
				}
				this.isResolved = true;
				this.resolver(value);
				this.close();
			}
		}

		try {
			new TitleModal(app, resolve).open();
		} catch (error) {
			console.error('Nulisaja Plugin: Error creating title modal:', error);
			resolve(null);
		}
	});
}
