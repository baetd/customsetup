/**
 * Create a directory.
 *
 * @param {string} path
 * Path of the directory to create.
 *
 * @param {object} [options]
 * Directory creation options.
 *
 * @param {boolean} [options.recursive=true]
 * Whether parent directories should also be created.
 *
 * @param {number} [options.mode]
 * Permission mode for the created directory.
 *
 * @returns {Promise<{
 *     path: string
 * }>}
 * Information about the created directory.
 */
export default async function mkdir(path, options = {}) {
    if (typeof path !== "string" || !path.trim()) {
        throw new TypeError("Directory path must be a non-empty string");
    }

    if (typeof options !== "object" || options === null) {
        throw new TypeError("Directory options must be an object");
    }

    const recursive = options.recursive ?? true;

    if (typeof recursive !== "boolean") {
        throw new TypeError("Recursive option must be a boolean");
    }

    if (
        options.mode !== undefined &&
        (typeof options.mode !== "number" || !Number.isInteger(options.mode))
    ) {
        throw new TypeError("Directory mode must be an integer");
    }

    const { mkdir: createDirectory } = await import("node:fs/promises");

    await createDirectory(path, {
        recursive,
        ...(options.mode !== undefined && {
            mode: options.mode
        })
    });

    return {
        path
    };
}