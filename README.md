# CustomSetup

CustomSetup is a lightweight JavaScript setup and automation framework designed to make system and project setup tasks easier to organize and execute.

## Features

- Step-based setup execution
- Package installation support
- File and directory management
- File downloading
- Shell command execution
- Copy, move and remove operations
- Setup state management
- Simple JavaScript API
- Lightweight and easy to extend

## Installation

Clone the repository:

```bash
git clone https://github.com/baetd/customsetup.git
cd customsetup
```

Install dependencies:

```bash
npm install
```

## Usage

Import CustomSetup into your project:

```javascript
import custom from "./index.js";
```

Create a setup:

```javascript
custom.new("My Setup");

custom.stepCount(3);

custom.step(1, "Install packages", async () => {
    await custom.addpkg("pacman", "git", "pacman", []);
});

custom.step(2, "Create directory", async () => {
    await custom.mkdir("./example");
});

custom.step(3, "Run command", async () => {
    await custom.run("echo Hello World");
});
```

## Available Functions

### `new(name)`

Creates a new setup.

```javascript
custom.new("My Setup");
```

### `stepCount(count)`

Defines the number of setup steps.

```javascript
custom.stepCount(3);
```

### `step(number, name, callback)`

Creates a setup step.

```javascript
custom.step(1, "Installing packages", async () => {
    // ...
});
```

### `addpkg(...)`

Installs packages using a supported package manager.

```javascript
await custom.addpkg("git", "git", "pacman", []);
```

### `mkdir(path)`

Creates a directory.

```javascript
await custom.mkdir("./config");
```

### `copy(source, destination)`

Copies a file or directory.

```javascript
await custom.copy("./config.json", "./backup/config.json");
```

### `move(source, destination)`

Moves a file or directory.

```javascript
await custom.move("./old", "./new");
```

### `remove(path)`

Removes a file or directory.

```javascript
await custom.remove("./temporary");
```

### `download(url, destination)`

Downloads a file.

```javascript
await custom.download(
    "https://example.com/file.zip",
    "./file.zip"
);
```

### `run(command)`

Runs a command.

```javascript
await custom.run("echo Hello");
```

### `shell(command)`

Executes a shell command.

```javascript
await custom.shell("ls -la");
```

## Project Structure

```text
customsetup/
├── core/
│   ├── setup-state.js
│   └── step-runner.js
│
├── functions/
│   ├── addpkg.js
│   ├── copy.js
│   ├── download.js
│   ├── finish.js
│   ├── mkdir.js
│   ├── move.js
│   ├── new.js
│   ├── remove.js
│   ├── require.js
│   ├── run.js
│   ├── shell.js
│   ├── step.js
│   └── stepCount.js
│
├── index.js
├── jsconfig.json
├── package.json
└── test.js
```

## Development

Run the test file:

```bash
node test.js
```

## Requirements

* Bun/Node.js
* npm
* A supported package manager for package installation features

## Roadmap — v1.1

- [ ] Path Resolver
- [ ] Improved error messages
- [ ] Better step output
- [ ] Setup state improvements
- [ ] Basic environment variable support
- [ ] More tests
- [ ] Small API improvements
- [ ] Bug fixes and stability improvements

## License

GPL v3.0
