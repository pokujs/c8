# @pokujs/c8

@pokujs/c8 is a [Poku](https://github.com/wellwelwel/poku) plugin for V8 code coverage using [c8](https://github.com/bcoe/c8).

## Commands

```sh
npm ci          # install dependencies
npm run build   # compile TypeScript → lib/
npm test        # build then run e2e tests via poku
npm run lint    # check formatting with prettier
npm run lint:fix  # auto-fix formatting
```

To run a single test file:

```sh
npx tsx <path-to-test-file>
```

## Architecture

**Source files (`src/`):**

- `index.ts` — exports the `coverage()` factory. `setup()` creates a temp dir, sets `NODE_V8_COVERAGE`, and merges config. `teardown()` calls c8's `Report` and optionally `checkCoverages`, then cleans up the temp dir.
- `config.ts` — `loadConfig()` auto-discovers `.c8rc`/`.nycrc` config files (JSON, JSONC, TOML, YAML). Kebab-case keys from config files are mapped to camelCase `CoverageOptions` fields.
- `types.ts` — `CoverageOptions` type defining all plugin options.

**Build output:** TypeScript compiles to `lib/` (Node16 module format, declarations included). Only `lib/` is published.

**Tests (`test/`):**

- All tests are e2e, run via `npm test`. Each test uses `inspectPoku()` to spawn a full poku process against a fixture project in `test/__fixtures__/`.
- Fixtures live in `test/__fixtures__/` with their own configs under `configs/` and source under `src/`.

**Config priority (highest to lowest):** `--coverageConfig` CLI flag → `config` plugin option → auto-discovery → c8 defaults. Plugin options always override file config values.

**Monocart support** is a c8 experimental feature and requires the `monocart-coverage-reports` optional peer dependency.
