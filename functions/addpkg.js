/**
 * Install one or more packages using a package source and package manager.
 *
 * @param {Array} customSources
 * Custom package source definitions.
 *
 * Example:
 * [
 *     {
 *         source: "dnf",
 *         managers: [
 *             {
 *                 name: "dnf",
 *                 command: "sudo",
 *                 args: ["dnf", "install", "-y"]
 *             }
 *         ]
 *     }
 * ]
 *
 * @param {string} source
 * Package source to use.
 *
 * Built-in sources:
 * - pacman
 * - aur
 * - flatpak
 *
 * Custom sources can also be provided through `customSources`.
 *
 * @param {string|string[]} packageName
 * Package name or an array of package names to install.
 *
 * Example:
 * "git"
 *
 * Or:
 * ["git", "fish", "kitty"]
 *
 * @param {string} [manager]
 * Package manager to use when multiple managers are available
 * for the selected source.
 *
 * Example:
 * "yay"
 * "paru"
 *
 * If omitted, the default manager for the selected source is used.
 *
 * @returns {{
 *     source: string,
 *     manager: string,
 *     packages: string[]
 * }}
 * Information about the installed packages.
 */
export default async function addpkg(
    source,
    packageName,
    manager,
    customSources = [],
) {
    if (!Array.isArray(customSources)) {
        throw new TypeError("Custom package sources must be an array");
    }

    if (typeof source !== "string" || !source.trim()) {
        throw new TypeError("Package source must be a non-empty string");
    }

    if (
        typeof packageName !== "string" &&
        !Array.isArray(packageName)
    ) {
        throw new TypeError("Package name must be a string or an array");
    }

    const packages = Array.isArray(packageName)
        ? packageName
        : [packageName];

    if (packages.length === 0) {
        throw new TypeError("At least one package is required");
    }

    if (packages.some(pkg => typeof pkg !== "string" || !pkg.trim())) {
        throw new TypeError("All package names must be non-empty strings");
    }

    const managers = {
        pacman: {
            source: "pacman",
            managers: {
                pacman: {
                    command: "sudo",
                    args: ["pacman", "-S", "--needed"]
                }
            }
        },

        aur: {
            source: "aur",
            managers: {
                yay: {
                    command: "yay",
                    args: ["-S", "--needed"]
                },

                paru: {
                    command: "paru",
                    args: ["-S", "--needed"]
                }
            }
        },

        flatpak: {
            source: "flatpak",
            managers: {
                flatpak: {
                    command: "flatpak",
                    args: ["install", "-y"]
                }
            }
        }
    };

    for (const custom of customSources) {
        if (
            typeof custom !== "object" ||
            typeof custom.source !== "string" ||
            !Array.isArray(custom.managers)
        ) {
            throw new TypeError("Invalid custom package source definition");
        }

        if (managers[custom.source]) {
            throw new Error(
                `Package source already exists: ${custom.source}`
            );
        }

        managers[custom.source] = {
            source: custom.source,
            managers: Object.fromEntries(
                custom.managers.map(item => {
                    if (
                        typeof item.name !== "string" ||
                        typeof item.command !== "string" ||
                        !Array.isArray(item.args)
                    ) {
                        throw new TypeError(
                            `Invalid package manager definition in ${custom.source}`
                        );
                    }

                    return [
                        item.name,
                        {
                            command: item.command,
                            args: item.args
                        }
                    ];
                })
            )
        };
    }

    const selectedSource = managers[source];

    if (!selectedSource) {
        throw new Error(`Unsupported package source: ${source}`);
    }

    let selectedManager;

    if (selectedSource.managers) {
        const managerName =
            manager || Object.keys(selectedSource.managers)[0];

        selectedManager = selectedSource.managers[managerName];

        if (!selectedManager) {
            throw new Error(
                `Unsupported package manager "${managerName}" for source "${source}"`
            );
        }

        manager = managerName;
    } else {
        selectedManager = selectedSource;
        manager = manager || source;
    }

    const args = [...selectedManager.args, ...packages];

    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");

    const execute = promisify(execFile);

    await execute(selectedManager.command, args);

    return {
        source,
        manager,
        packages
    };
}