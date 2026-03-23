import { stateManager } from "../state/queueStateManager.js";

export const analytics = {

    calculateSpeed() {
        const history = stateManager.getState().history;

        if (history.length < 2) return 0;

        const first = history[0];
        const last = history[history.length - 1];

        const diff = first.position - last.position;
        const time = (last.time - first.time) / 60000;

        if (time === 0) return 0;

        return Math.floor(diff / time);
    },

    calculateETA() {
        const speed = this.calculateSpeed();

        if (speed === 0) return "Calculating...";

        const remaining = stateManager.getLastPosition();

        return `${Math.ceil(remaining / speed)} min`;
    }

};