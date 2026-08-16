import custom from "./index.js";

async function main() {
    custom.new("CustomSetup V1 Test");

    custom.stepCount(3);

    custom.step(1, "Test package installation", async () => {
        await custom.addpkg("pacman", "git", "pacman", []);
    });

    custom.step(2, "Test command execution", async () => {
        const result = await custom.execute("echo", [
            "Hello from CustomSetup V1"
        ]);

        console.log(result.stdout);
    });

    custom.step(3, "Test filesystem", async () => {
        await custom.fs.mkdir("./test-output");

        await custom.fs.copy(
            "./test.js",
            "./test-output/test.js"
        );

        await custom.fs.move(
            "./test-output/test.js",
            "./test-output/moved-test.js"
        );

        await custom.fs.remove(
            "./test-output/moved-test.js"
        );
    });

    const state = await custom.run();

    console.log("\nSetup finished.");
    console.log(`Name: ${state.name}`);
    console.log(`Status: ${state.status}`);
    console.log(`Steps: ${state.completedSteps}/${state.totalSteps}`);

    const result = custom.finish();

    console.log("\nFinish result:");
    console.log(result);
}

main().catch(error => {
    console.error("\nSetup failed:");
    console.error(error);
    process.exitCode = 1;
});