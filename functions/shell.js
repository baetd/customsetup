/**
 * Provides shell-related functions.
 *
 * @namespace shell
 */

/**
 * Execute a command through the system shell.
 *
 * @param {string} command
 * Shell command to execute.
 *
 * @returns {Promise<{
 *     stdout: string,
 *     stderr: string,
 *     code: number
 * }>}
 * Result of the executed shell command.
 */
async function run(command) {
    if (typeof command !== "string" || !command.trim()) {
        throw new TypeError("Shell command must be a non-empty string");
    }

    const { exec } = await import("node:child_process");
    const { promisify } = await import("node:util");

    const execute = promisify(exec);

    const result = await execute(command);

    return {
        stdout: result.stdout,
        stderr: result.stderr,
        code: 0
    };
}

const shell = {
    run
};

export default shell;