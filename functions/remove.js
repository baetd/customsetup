/**
 * Remove a file or directory.
 *
 * @param {string} target
 * Path of the file or directory to remove.
 *
 * @param {object} [options]
 * Remove options.
 *
 * @param {boolean} [options.recursive=true]
 * Whether directories should be removed recursively.
 *
 * @param {boolean} [options.force=true]
 * Whether missing targets should be ignored.
 *
 * @returns {Promise<{
 *     target: string
 * }>}
 * Information about the removed target.
 */
export default async function remove(target, options = {}) {
    if (typeof target !== "string" || !target.trim()) {
        throw new TypeError("Target path must be a non-empty string");
    }

    if (typeof options !== "object" || options === null) {
        throw new TypeError("Remove options must be an object");
    }

    const recursive = options.recursive ?? true;
    const force = options.force ?? true;

    if (typeof recursive !== "boolean") {
        throw new TypeError("Recursive option must be a boolean");
    }

    if (typeof force !== "boolean") {
        throw new TypeError("Force option must be a boolean");
    }

    const { rm } = await import("node:fs/promises");

    await rm(target, {
        recursive,
        force
    });

    return {
        target
    };
}