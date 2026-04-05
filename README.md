<div align="center">
<img height="180" alt="Poku's Logo" src="https://raw.githubusercontent.com/wellwelwel/poku/main/.github/assets/readme/poku.svg">

# @pokujs/c8

Enjoying **Poku**? [Give him a star to show your support](https://github.com/wellwelwel/poku) ⭐

</div>

---

📚 [**Documentation**](https://poku.io/docs/documentation/helpers/coverage/c8)

</div>

---

☔️ [**@pokujs/c8**](https://github.com/pokujs/c8) is a **Poku** plugin for **V8** code coverage using [**c8**](https://github.com/bcoe/c8).

> [!TIP]
>
> **@pokujs/c8** supports **JSONC** config files (`.c8rc`, `.nycrc`, etc.) out of the box, allowing comments in your configuration. You can also use **JS** and **TS** by setting the options directly in the plugin.

---

## Quickstart

### Install

```bash
npm i -D @pokujs/c8
```

### Usage

#### Enable the Plugin

```js
// poku.config.js
import { coverage } from '@pokujs/c8';
import { defineConfig } from 'poku';

export default defineConfig({
  plugins: [coverage()],
});
```

Run `poku` and a coverage summary will be printed after your test results.

> [!IMPORTANT]
>
> This plugin relies on **Node.js**' built-in `NODE_V8_COVERAGE` environment variable to collect coverage data. **Bun** and **Deno** do not support this mechanism, so coverage data will not be collected when running tests with these runtimes.

---

## Options

```js
coverage({
  // Config file (.c8rc, .c8rc.json, .c8rc.jsonc, .nycrc, .nycrc.json, .nycrc.jsonc)
  config: '.c8rc', // default: auto-discover

  // Activation
  requireFlag: true, // default: false

  // Reporters (clover, cobertura, codecov, console-details, html, html-spa, json, json-summary, lcov, lcovonly, none, teamcity, text, text-lcov, text-summary, v8)
  reporter: ['text', 'lcov'], // default: ['text']

  // File selection
  include: ['src/**'], // default: [] (all files)
  exclude: ['**/*.test.ts'], // default: c8 defaults
  extension: ['.ts', '.js'], // default: c8 defaults

  // Thresholds
  checkCoverage: true, // default: false
  lines: 80, // default: 0
  branches: 80, // default: 0
  functions: 80, // default: 0
  statements: 80, // default: 0
  perFile: false, // default: false

  // Include untested files
  all: true, // default: false
  src: ['src'], // default: [cwd]

  // Experimental
  experimental: ['monocart'], // default: []

  // Output
  reportsDirectory: './coverage', // default: './coverage'
  skipFull: false, // default: false

  // Advanced
  watermarks: { lines: [80, 95], branches: [80, 95] }, // default: c8 defaults
  excludeAfterRemap: false, // default: false
  mergeAsync: false, // default: false
  clean: true, // default: true
});
```

---

## Examples

### Basic text coverage

```js
coverage({
  include: ['src/**'],
});
```

### Generate HTML and LCOV reports

```js
coverage({
  include: ['src/**'],
  reporter: ['text', 'html', 'lcov'],
});
```

### Enforce coverage thresholds

Set a single threshold for all metrics at once by passing a `number`:

```js
coverage({
  include: ['src/**'],
  checkCoverage: 100,
});
```

Or use `true` to set individual thresholds for each metric:

```js
coverage({
  include: ['src/**'],
  checkCoverage: true,
  lines: 95,
  branches: 90,
  functions: 85,
  statements: 95,
});
```

### TypeScript coverage

```js
coverage({
  include: ['src/**'],
  extension: ['.ts'],
  all: true,
});
```

### Require `--coverage` flag

By default, coverage runs whenever the plugin is active. Use `requireFlag` to only collect coverage when `--coverage` is passed to the CLI, keeping watch mode, debugging, and filtered runs fast:

```js
coverage({
  include: ['src/**'],
  requireFlag: true,
});
```

```bash
# No coverage (plugin is a no-op)
poku test/

# With coverage
poku --coverage test/
```

### Using a config file

Reuse your existing `.c8rc`, `.nycrc`, or any JSON/JSONC config file with comments:

```jsonc
// .c8rc
{
  // Only cover source files
  "include": ["src/**"],
  "reporter": ["text", "lcov"],
  "check-coverage": true,
  "lines": 90,
}
```

```js
coverage({
  config: '.c8rc', // or false to disable auto-discovery
});
```

When no `config` is specified, the plugin automatically searches for `.c8rc`, `.c8rc.json`, `.c8rc.jsonc`, `.nycrc`, `.nycrc.json`, or `.nycrc.jsonc` in the working directory. Programmatic options always take precedence over file-based config.

### Extending Monocart reporters

```bash
npm i -D monocart-coverage-reports
```

```js
coverage({
  include: ['src/**'],
  reporter: ['v8', 'console-details', 'codecov'],
  experimental: ['monocart'],
});
```

---

## How It Works

- **`setup`** creates a temp directory and sets `NODE_V8_COVERAGE` — every test process spawned by **Poku** automatically writes **V8** coverage data
- **`teardown`** uses **c8** to generate reports from the collected data, optionally checks thresholds, then cleans up
- No modification to test commands or runner configuration needed

---

## License

**MIT** © [**wellwelwel**](https://github.com/wellwelwel) and [**contributors**](https://github.com/pokujs/c8/graphs/contributors).
