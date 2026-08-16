/**
 * Check whether a required command or package is available.
 *
 * @param {string} command
 * Command or executable name to check.
 *
 * @param {Function} [onMissing]
 * Optional callback that runs when the required command is missing.
 *
 * @returns {Promise<boolean>}
 * Returns true if the command is available.
 */
export default async function requireCommand(command, onMissing) {
    if (typeof command !== "string" || !command.trim()) {
        throw new TypeError("Required command must be a non-empty string");
    }

    if (onMissing !== undefined && typeof onMissing !== "function") {
        throw new TypeError("onMissing must be a function");
    }

    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");

    const execute = promisify(execFile);

    try {
        await execute("which", [command]);
        return true;
    } catch {
        if (onMissing) {
            await onMissing();
        }

        return false;
    }
}