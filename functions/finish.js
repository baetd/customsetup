/**
 * Finish the current setup process.
 *
 * @param {object} [result]
 * Optional setup result data.
 *
 * @returns {{
 *     success: boolean,
 *     result: object
 * }}
 * Final setup status.
 */
export default function finish(result = {}) {
    if (typeof result !== "object" || result === null) {
        throw new TypeError("Finish result must be an object");
    }

    return {
        success: true,
        result
    };
}