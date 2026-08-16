/**
 * Execute a command with arguments.
 *
 * @param {string} command
 * Command or executable to run.
 *
 * @param {string[]} [args]
 * Arguments passed to the command.
 *
 * @returns {Promise<{
 *     stdout: string,
 *     stderr: string,
 *     code: number
 * }>}
 * Result of the executed command.
 */
export default async function run(command, args = []) {
    if (typeof command !== "string" || !command.trim()) {
        throw new TypeError("Command must be a non-empty string");
    }

    if (!Array.isArray(args)) {
        throw new TypeError("Command arguments must be an array");
    }

    if (args.some(arg => typeof arg !== "string")) {
        throw new TypeError("All command arguments must be strings");
    }

    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");

    const execute = promisify(execFile);

    const result = await execute(command, args);

    return {
        stdout: result.stdout,
        stderr: result.stderr,
        code: 0
    };
}