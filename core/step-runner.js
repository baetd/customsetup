/**
 * Execute all registered setup steps in order.
 *
 * @param {object} state
 * Current setup state.
 *
 * @returns {Promise<object>}
 * Updated setup state.
 */
import { setStatus } from "./setup-state.js";

export default async function runSteps(state) {
    if (!state || typeof state !== "object") {
        throw new TypeError("Setup state must be an object");
    }

    if (!Array.isArray(state.steps)) {
        throw new TypeError("Setup state must contain a steps array");
    }

    const steps = [...state.steps].sort(
        (a, b) => a.number - b.number
    );

    if (
        state.expectedSteps !== undefined &&
        steps.length !== state.expectedSteps
    ) {
        throw new Error(
            `Expected ${state.expectedSteps} steps, but ${steps.length} were registered`
        );
    }

    for (let index = 0; index < steps.length; index++) {
        const expectedNumber = index + 1;

        if (steps[index].number !== expectedNumber) {
            throw new Error(
                `Missing or invalid step number: expected step ${expectedNumber}`
            );
        }
    }

    state.totalSteps = steps.length;
    state.currentStep = 0;
    state.completedSteps = 0;
    state.failedSteps = 0;

    setStatus(state, "running");

    for (const current of steps) {
        state.currentStep = current.number;
        current.status = "running";

        try {
            await current.callback();

            current.status = "completed";
            state.completedSteps++;
        } catch (error) {
            current.status = "failed";
            state.failedSteps++;

            setStatus(state, "failed");

            throw error;
        }
    }

    state.currentStep = state.totalSteps;

    setStatus(state, "completed");

    return state;
}