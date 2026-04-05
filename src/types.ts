type KnownReporter =
  | 'clover'
  | 'cobertura'
  | 'codecov'
  | 'console-details'
  | 'html'
  | 'html-spa'
  | 'json'
  | 'json-summary'
  | 'lcov'
  | 'lcovonly'
  | 'none'
  | 'teamcity'
  | 'text'
  | 'text-lcov'
  | 'text-summary'
  | 'v8';

type Reporter = KnownReporter | (string & NonNullable<unknown>);

type KnownExtension =
  | '.cjs'
  | '.cts'
  | '.js'
  | '.jsx'
  | '.mjs'
  | '.mts'
  | '.ts'
  | '.tsx';

type Extension = KnownExtension | (string & NonNullable<unknown>);

export type CoverageOptions = {
  /**
   * Require the `--coverage` CLI flag to activate coverage collection.
   *
   * When `true`, coverage only runs if `--coverage` is passed to the CLI.
   * When `false`, coverage runs whenever the plugin is active.
   *
   * @default false
   */
  requireFlag?: boolean;

  /** Coverage reporters to use. */
  reporter?: Reporter | Reporter[];

  /** Directory where coverage reports are written. */
  reportsDirectory?: string;

  /**
   * Directory where V8 writes raw coverage JSON files.
   *
   * When provided, the directory is **not** auto-cleaned after report generation.
   */
  tempDirectory?: string;

  /** Glob patterns for source files to include (empty = all). */
  include?: string[];

  /** Glob patterns for source files to exclude. */
  exclude?: string[];

  /** File extensions to consider for coverage. */
  extension?: Extension[];

  /**
   * Include files that were never loaded by any test (reported as 0% coverage).
   *
   * Use `src` to control which directories are scanned.
   */
  all?: boolean;

  /** Directories to scan when `all` is `true`. */
  src?: string[];

  /** Delete previous coverage data before running. */
  clean?: boolean;

  /**
   * Enforce coverage thresholds.
   *
   * - `true` — check using individual `lines`, `branches`, `functions`, and `statements` values.
   * - `number` — set all thresholds to that value (e.g., `100` is equivalent to `--100` in c8 CLI).
   *
   * When a threshold is not met, `process.exitCode` is set to `1`.
   */
  checkCoverage?: boolean | number;

  /** Check thresholds per file instead of globally. */
  perFile?: boolean;

  /** Minimum line coverage percentage. */
  lines?: number;

  /** Minimum branch coverage percentage. */
  branches?: number;

  /** Minimum function coverage percentage. */
  functions?: number;

  /** Minimum statement coverage percentage. */
  statements?: number;

  /** Skip files with 100% coverage in the text report. */
  skipFull?: boolean;

  /** Apply exclude rules after source-map remapping. */
  excludeAfterRemap?: boolean;

  /** Custom watermark thresholds for report coloring. */
  watermarks?: Record<string, [number, number]>;

  /** Use async incremental merge (useful for large test suites). */
  mergeAsync?: boolean;

  /**
   * Enable experimental features.
   *
   * - `'monocart'` — Use monocart-coverage-reports instead of the default
   *   Istanbul pipeline. Requires `monocart-coverage-reports` to be installed
   *   separately.
   */
  experimental?: 'monocart'[];
};
