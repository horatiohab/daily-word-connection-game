const GAME_STATE_STORAGE_KEY = 'daily-word-connection-game-state';

function getTodayPuzzleId() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

const initialState = {
    puzzleId: '',
    guesses: 0,
    roundFinished: false,
    won: false,
    wonAttempts: null,
    currentInput: '',
    lastGuess: '',
    feedbackMessage: '',
    feedbackClass: '',
};

class GameStateService {
    constructor() {
        this.state = { ...initialState };
    }

    getTodayPuzzleId() {
        return getTodayPuzzleId();
    }

    loadState() {
        try {
            const raw = localStorage.getItem(GAME_STATE_STORAGE_KEY);
            if (!raw) return null;

            const saved = JSON.parse(raw);
            const todayPuzzleId = this.getTodayPuzzleId();

            if (saved.puzzleId !== todayPuzzleId) {
                return null;
            }

            this.state = { ...initialState, ...saved };
            return { ...this.state };
        } catch {
            return null;
        }
    }

    saveState(partialState) {
        try {
            const todayPuzzleId = this.getTodayPuzzleId();
            this.state = { ...this.state, ...partialState, puzzleId: todayPuzzleId };
            localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(this.state));
        } catch {
            // localStorage may be unavailable; silently fail
        }
    }

    getState() {
        return { ...this.state };
    }

    resetState() {
        try {
            localStorage.removeItem(GAME_STATE_STORAGE_KEY);
        } catch {
            // ignore
        }
        this.state = { ...initialState };
    }
}

export const gameStateService = new GameStateService();
