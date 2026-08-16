/**
 * Create and manage the state of a setup process.
 */

/**
 * Create a new setup state.
 *
 * @param {string} name
 * Name of the setup.
 *
 * @returns {object}
 * New setup state.
 */
export function createSetupState(name) {
    if (typeof name !== "string" || !name.trim()) {
        throw new TypeError("Setup name must be a non-empty string");
    }

    return {
        name: name.trim(),
        steps: [],
        expectedSteps: undefined,
        totalSteps: 0,
        currentStep: 0,
        completedSteps: 0,
        failedSteps: 0,
        status: "created"
    };
}

/**
 * Add a step to the setup state.
 *
 * @param {object} state
 * Current setup state.
 *
 * @param {object} step
 * Step to add.
 *
 * @returns {object}
 * Updated setup state.
 */
export function addStep(state, step) {
    if (!state || typeof state !== "object") {
        throw new TypeError("Setup state must be an object");
    }

    if (!step || typeof step !== "object") {
        throw new TypeError("Step must be an object");
    }

    if (state.status !== "created") {
        throw new Error("Steps can only be added before setup starts");
    }

    if (
        !Number.isInteger(step.number) ||
        step.number < 1
    ) {
        throw new TypeError("Step number must be a positive integer");
    }

    if (state.steps.some(item => item.number === step.number)) {
        throw new Error(`Step ${step.number} already exists`);
    }

    state.steps.push(step);
    state.totalSteps = state.steps.length;

    return state;
}

/**
 * Set the expected number of setup steps.
 *
 * @param {object} state
 * Current setup state.
 *
 * @param {number} count
 * Expected number of steps.
 *
 * @returns {object}
 * Updated setup state.
 */
export function setExpectedSteps(state, count) {
    if (!state || typeof state !== "object") {
        throw new TypeError("Setup state must be an object");
    }

    if (!Number.isInteger(count) || count < 1) {
        throw new TypeError("Step count must be a positive integer");
    }

    if (state.status !== "created") {
        throw new Error(
            "Step count can only be set before setup starts"
        );
    }

    state.expectedSteps = count;

    return state;
}

/**
 * Update the current setup status.
 *
 * @param {object} state
 * Current setup state.
 *
 * @param {string} status
 * New setup status.
 *
 * @returns {object}
 * Updated setup state.
 */
export function setStatus(state, status) {
    const allowedStatuses = [
        "created",
        "running",
        "completed",
        "failed"
    ];

    if (!state || typeof state !== "object") {
        throw new TypeError("Setup state must be an object");
    }

    if (!allowedStatuses.includes(status)) {
        throw new TypeError(
            `Invalid setup status: ${status}`
        );
    }

    state.status = status;

    return state;
}