/**
 * Download a file from a URL.
 *
 * @param {string} url
 * URL of the file to download.
 *
 * @param {string} destination
 * Path where the downloaded file will be saved.
 *
 * @returns {Promise<{
 *     url: string,
 *     destination: string
 * }>}
 * Information about the downloaded file.
 */
export default async function download(url, destination) {
    if (typeof url !== "string" || !url.trim()) {
        throw new TypeError("URL must be a non-empty string");
    }

    if (typeof destination !== "string" || !destination.trim()) {
        throw new TypeError("Destination path must be a non-empty string");
    }

    let parsedUrl;

    try {
        parsedUrl = new URL(url);
    } catch {
        throw new TypeError("Invalid URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new TypeError("Only HTTP and HTTPS URLs are supported");
    }

    const { request: httpRequest } = await import("node:http");
    const { request: httpsRequest } = await import("node:https");
    const { createWriteStream } = await import("node:fs");
    const { mkdir } = await import("node:fs/promises");
    const { dirname } = await import("node:path");

    await mkdir(dirname(destination), {
        recursive: true
    });

    await new Promise((resolve, reject) => {
        const request =
            parsedUrl.protocol === "https:"
                ? httpsRequest
                : httpRequest;

        const file = createWriteStream(destination);

        const requestInstance = request(parsedUrl, response => {
            if (
                response.statusCode >= 300 &&
                response.statusCode < 400 &&
                response.headers.location
            ) {
                file.close();
                reject(
                    new Error(
                        `Redirect received: ${response.headers.location}`
                    )
                );
                return;
            }

            if (response.statusCode !== 200) {
                file.close();
                reject(
                    new Error(
                        `Download failed with status code ${response.statusCode}`
                    )
                );
                return;
            }

            response.pipe(file);

            file.on("finish", () => {
                file.close(resolve);
            });
        });

        requestInstance.on("error", error => {
            file.close();
            reject(error);
        });

        file.on("error", error => {
            requestInstance.destroy();
            reject(error);
        });

        requestInstance.end();
    });

    return {
        url,
        destination
    };
}