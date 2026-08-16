/**
 * Create a new setup.
 *
 * @param {string} name
 * Name of the setup.
 *
 * @returns {object}
 * Newly created setup state.
 */
import { createSetupState } from "../core/setup-state.js";

export default function create(name) {
    return createSetupState(name);
}