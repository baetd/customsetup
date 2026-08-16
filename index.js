if (process.platform !== "linux") {
    console.error("Customsetup only works in Linux.");
    console.info("If your running this on WSL, you can bypass it safely.")
    console.info("You can also contribute to bring support for Windows/macOS.")
    console.warn("Note: Even if you bypass this in some operating systems, you will still fail if you dont change the source code.")

    console.log(" ")
    throw TypeError("invalid platform")
}

import create from "./functions/new.js";
import step from "./functions/step.js";
import stepCount from "./functions/stepCount.js";
import addpkg from "./functions/addpkg.js";
import requireCommand from "./functions/require.js";
import run from "./functions/run.js";
import shell from "./functions/shell.js";
import copy from "./functions/copy.js";
import move from "./functions/move.js";
import remove from "./functions/remove.js";
import mkdir from "./functions/mkdir.js";
import download from "./functions/download.js";
import finish from "./functions/finish.js";
import runSteps from "./core/step-runner.js";

let state = null;

const custom = {
    new(name) {
        state = create(name);

        return state;
    },

    step(number, name, callback) {
        if (!state) {
            throw new Error(
                "No setup has been created. Call custom.new() first."
            );
        }

        return step(state, number, name, callback);
    },

    stepCount(count) {
        if (!state) {
            throw new Error(
                "No setup has been created. Call custom.new() first."
            );
        }

        return stepCount(state, count);
    },

    async run() {
        if (!state) {
            throw new Error(
                "No setup has been created. Call custom.new() first."
            );
        }

        return runSteps(state);
    },

    addpkg(...args) {
        return addpkg(...args);
    },

    require(...args) {
        return requireCommand(...args);
    },

    execute(...args) {
        return run(...args);
    },

    shell,

    fs: {
        copy,
        move,
        remove,
        mkdir
    },

    download,

    finish(...args) {
        if (!state) {
            throw new Error(
                "No setup has been created. Call custom.new() first."
            );
        }

        return finish(...args);
    },

    get state() {
        return state;
    }
};

export default custom;