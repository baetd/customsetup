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
import { setExpectedSteps } from "../core/setup-state.js";

export default function stepCount(state, count) {
    return setExpectedSteps(state, count);
}