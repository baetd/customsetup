/**
 * Create and register a setup step.
 *
 * @param {object} state
 * Current setup state.
 *
 * @param {number} number
 * Step number.
 *
 * @param {string} name
 * Name of the step.
 *
 * @param {Function} callback
 * Function to execute for the step.
 *
 * @returns {object}
 * Updated setup state.
 */
export default function step(state, number, name, callback) {
    if (!state || typeof state !== "object") {
        throw new TypeError("Setup state must be an object");
    }

    if (!Number.isInteger(number) || number < 1) {
        throw new TypeError("Step number must be a positive integer");
    }

    if (typeof name !== "string" || !name.trim()) {
        throw new TypeError("Step name must be a non-empty string");
    }

    if (typeof callback !== "function") {
        throw new TypeError("Step callback must be a function");
    }

    if (state.steps.some(existingStep => existingStep.number === number)) {
        throw new Error(`Step ${number} already exists`);
    }

    const newStep = {
        number,
        name: name.trim(),
        callback,
        status: "pending"
    };

    state.steps.push(newStep);

    state.totalSteps = state.steps.length;

    return state;
}