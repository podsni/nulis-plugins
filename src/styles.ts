const STYLE_ID = 'nulisaja-plugin-styles';

const STYLES = `
	/* Ribbon Icon Styling */
	.nulisaja-ribbon-icon {
		transition: transform 0.2s ease, color 0.2s ease;
	}
	
	.nulisaja-ribbon-icon:hover {
		transform: scale(1.1);
		color: var(--interactive-accent);
	}

	/* Quick Menu Styling */
	.nulisaja-quick-menu {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		border-radius: 12px;
		padding: 24px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
		z-index: 1000;
		min-width: 320px;
		max-width: 90vw;
		backdrop-filter: blur(10px);
		animation: nulisaja-fade-in 0.3s ease-out;
	}

	@keyframes nulisaja-fade-in {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	@keyframes nulisaja-fade-out {
		from {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		to {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.9);
		}
	}

	.nulisaja-menu-title {
		margin: 0 0 20px 0;
		text-align: center;
		font-size: 1.2em;
		font-weight: 600;
		color: var(--text-normal);
		background: linear-gradient(135deg, var(--interactive-accent), var(--text-accent));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.nulisaja-buttons-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 12px;
		margin-bottom: 16px;
	}

	.nulisaja-menu-button {
		padding: 12px 16px;
	border: 1px solid var(--background-modifier-border);
	border-radius: 8px;
		background: var(--background-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9em;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 44px;
		position: relative;
		overflow: hidden;
	}

	.nulisaja-menu-button:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.nulisaja-close-button {
		width: 100%;
		padding: 10px;
		border: none;
		border-radius: 8px;
		background: var(--background-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9em;
		font-weight: 500;
	}

	.nulisaja-close-button:hover {
		background: var(--background-modifier-error);
		color: var(--text-on-accent);
	}

	/* Modal Styling */
	.nulisaja-modal {
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	}

	.nulisaja-modal-title {
		font-size: 1.3em;
		font-weight: 600;
		margin-bottom: 20px;
		text-align: center;
		color: var(--text-normal);
	}

	.nulisaja-input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid var(--background-modifier-border);
		border-radius: 8px;
		background: var(--background-primary);
		color: var(--text-normal);
		font-size: 1em;
		transition: all 0.2s ease;
		margin-bottom: 16px;
	}

	.nulisaja-input:focus {
		outline: none;
		border-color: var(--interactive-accent);
		box-shadow: 0 0 0 3px rgba(var(--interactive-accent-rgb), 0.1);
	}

	.nulisaja-button-group {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	.nulisaja-button {
		padding: 10px 20px;
		border: 1px solid var(--background-modifier-border);
		border-radius: 8px;
		background: var(--background-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9em;
		font-weight: 500;
		min-width: 80px;
	}

	.nulisaja-button:hover {
		background: var(--background-modifier-hover);
		transform: translateY(-1px);
	}

	.nulisaja-button-primary {
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		border-color: var(--interactive-accent);
	}

	.nulisaja-button-primary:hover {
		background: var(--interactive-accent-hover);
	}

	.nulisaja-button-secondary {
		background: var(--background-secondary);
	}

	.nulisaja-button-secondary:hover {
		background: var(--background-modifier-error);
		color: var(--text-on-accent);
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.nulisaja-quick-menu {
			width: 95vw;
			max-width: 400px;
	padding: 20px;
		}

		.nulisaja-buttons-container {
			grid-template-columns: 1fr;
			gap: 10px;
		}

		.nulisaja-menu-button {
			min-height: 48px;
			font-size: 1em;
		}

		.nulisaja-button-group {
			flex-direction: column;
		}

		.nulisaja-button {
			width: 100%;
			min-height: 44px;
		}
	}

	/* Dark mode adjustments */
	.theme-dark .nulisaja-quick-menu {
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	/* Loading animation */
	.nulisaja-loading {
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 2px solid var(--background-modifier-border);
		border-radius: 50%;
		border-top-color: var(--interactive-accent);
		animation: nulisaja-spin 1s ease-in-out infinite;
	}

	@keyframes nulisaja-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Success/Error states */
	.nulisaja-success {
		color: var(--text-success);
	}

	.nulisaja-error {
		color: var(--text-error);
	}
`;

export function injectStyles(): void {
	if (document.getElementById(STYLE_ID)) {
		return;
	}

	const styleEl = document.createElement('style');
	styleEl.id = STYLE_ID;
	styleEl.textContent = STYLES;
	document.head.appendChild(styleEl);
}

export function removeStyles(): void {
	const existing = document.getElementById(STYLE_ID);
	if (existing) {
		existing.remove();
	}
}
