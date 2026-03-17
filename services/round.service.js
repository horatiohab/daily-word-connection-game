import { roundsData } from '/data/rounds.data.js';

const initialState = {
    id: 1,
    clueCards: {
        first: '',
        second: '',
        third: '',
        fourth: '',
    },
    answer: '',
};

const clueOrder = ['first', 'second', 'third', 'fourth'];

class RoundService {
    constructor() {
        this.roundState = { ...initialState }; 
        this.guesses = 0;
    }

    getState() {
        return this.roundState;
    }

    setState(nextState) {
        this.roundState = { ...this.roundState, ...nextState };
    }

    initialiseRound() {
        const roundData = roundsData[this.getRoundIndex()];
        this.roundState = {
            ...this.roundState,
            clueCards: this.getCurrentClues(roundData.clueCards),
            answer: roundData.answer,
            id: roundData.id,
        };
    }

    getNextClue() {
        this.guesses++;
        this.initialiseRound();
    }

    getCurrentClues(clues) {
        const count = Math.max(1, Math.min(this.guesses + 1, clueOrder.length));
        return clueOrder.slice(0, count).reduce((acc, key) => {
            if (typeof clues[key] !== 'undefined') acc[key] = clues[key];
            return acc;
        }, {});
    }

    getRoundIndex() {
        const today = new Date();
        const startDate = new Date('2026-03-16');
        const diffInDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        return diffInDays % roundsData.length;
    }
}

export const roundService = new RoundService();