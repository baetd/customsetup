/**
 * Move a file or directory to a destination.
 *
 * @param {string} source
 * Path of the file or directory to move.
 *
 * @param {string} destination
 * Destination path.
 *
 * @param {object} [options]
 * Move options.
 *
 * @param {boolean} [options.overwrite=true]
 * Whether an existing destination should be replaced.
 *
 * @returns {Promise<{
 *     source: string,
 *     destination: string
 * }>}
 * Information about the moved file or directory.
 */
export default async function move(source, destination, options = {}) {
    if (typeof source !== "string" || !source.trim()) {
        throw new TypeError("Source path must be a non-empty string");
    }

    if (typeof destination !== "string" || !destination.trim()) {
        throw new TypeError("Destination path must be a non-empty string");
    }

    if (typeof options !== "object" || options === null) {
        throw new TypeError("Move options must be an object");
    }

    const overwrite = options.overwrite ?? true;

    if (typeof overwrite !== "boolean") {
        throw new TypeError("Overwrite option must be a boolean");
    }

    const { rename, rm, access } = await import("node:fs/promises");

    if (!overwrite) {
        try {
            await access(destination);
            throw new Error(
                `Destination already exists: ${destination}`
            );
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }
    } else {
        try {
            await rm(destination, {
                recursive: true,
                force: true
            });
        } catch {
        }
    }

    await rename(source, destination);

    return {
        source,
        destination
    };
}