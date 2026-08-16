/**
 * Copy a file or directory to a destination.
 *
 * @param {string} source
 * Path of the file or directory to copy.
 *
 * @param {string} destination
 * Destination path.
 *
 * @param {object} [options]
 * Copy options.
 *
 * @param {boolean} [options.overwrite=true]
 * Whether existing files should be overwritten.
 *
 * @returns {Promise<{
 *     source: string,
 *     destination: string
 * }>}
 * Information about the copied files.
 */
export default async function copy(source, destination, options = {}) {
    if (typeof source !== "string" || !source.trim()) {
        throw new TypeError("Source path must be a non-empty string");
    }

    if (typeof destination !== "string" || !destination.trim()) {
        throw new TypeError("Destination path must be a non-empty string");
    }

    if (typeof options !== "object" || options === null) {
        throw new TypeError("Copy options must be an object");
    }

    const overwrite = options.overwrite ?? true;

    if (typeof overwrite !== "boolean") {
        throw new TypeError("Overwrite option must be a boolean");
    }

    const { cp } = await import("node:fs/promises");
    const { access } = await import("node:fs/promises");

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
    }

    await cp(source, destination, {
        recursive: true,
        force: overwrite
    });

    return {
        source,
        destination
    };
}