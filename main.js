import './components/components.js';

const keyboard = document.querySelector('keyboard-component');
const guessInput = document.querySelector('guess-input');
const themeToggle = document.querySelector('[data-theme-toggle]');

const THEME_STORAGE_KEY = 'daily-word-connection-theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

function applyTheme(theme) {
	const newTheme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
	document.body.dataset.theme = newTheme;

	if (themeToggle) {
		themeToggle.textContent = newTheme === THEME_DARK ? 'Light mode' : 'Dark mode';
		themeToggle.setAttribute('aria-pressed', String(newTheme === THEME_DARK));
	}
}

function initialiseTheme() {
	const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
	const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT;
	applyTheme(storedTheme || preferredTheme);
}

function toggleTheme() {
	const currentTheme = document.body.dataset.theme;
	const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
	applyTheme(newTheme);
	localStorage.setItem(THEME_STORAGE_KEY, newTheme);
}

if (themeToggle) {
	themeToggle.addEventListener('click', toggleTheme);
}

initialiseTheme();

if (keyboard && guessInput) {
	keyboard.addEventListener('keyboard-drag-key', (event) => {
		const key = event?.detail?.key;
		if (!key || typeof guessInput.applyKeyboardKey !== 'function') return;

		guessInput.applyKeyboardKey(key);
	});
}
