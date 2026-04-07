import type { PokuPlugin } from 'poku/plugins';
import type { CoverageOptions } from './types.js';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { loadConfig } from './config.js';

export type { CoverageOptions } from './types.js';

export const coverage = (
  options: CoverageOptions = Object.create(null)
): PokuPlugin => {
  let enabled = false;
  let tempDir: string;
  let originalEnv: string | undefined;
  let userProvidedTempDir: boolean;

  return {
    name: '@pokujs/c8',

    setup(context) {
      if (options.requireFlag && !process.argv.includes('--coverage')) return;
      if (context.runtime !== 'node')
        console.warn(
          `[@pokujs/c8] V8 coverage is only supported on Node.js (current runtime: ${context.runtime}). Coverage data may not be collected.`
        );

      enabled = true;

      const cliConfig = process.argv
        .find((arg) => arg.startsWith('--coverageConfig'))
        ?.split('=')[1];

      const fileConfig = loadConfig(context.cwd, cliConfig ?? options.config);

      options = { ...fileConfig, ...options };
      originalEnv = process.env.NODE_V8_COVERAGE;
      userProvidedTempDir = typeof options.tempDirectory === 'string';

      tempDir = userProvidedTempDir
        ? options.tempDirectory!
        : mkdtempSync(join(tmpdir(), 'poku-c8-'));

      if (options.clean !== false) {
        try {
          rmSync(tempDir, { recursive: true, force: true });
        } catch {
          // Best-effort cleanup
        }

        mkdirSync(tempDir, { recursive: true });
      }

      process.env.NODE_V8_COVERAGE = tempDir;
    },

    async teardown(context) {
      if (!enabled) return;

      if (originalEnv !== undefined) process.env.NODE_V8_COVERAGE = originalEnv;
      else delete process.env.NODE_V8_COVERAGE;

      const reporter = Array.isArray(options.reporter)
        ? options.reporter
        : [options.reporter ?? 'text'];

      const reportsDirectory = resolve(
        context.cwd,
        options.reportsDirectory ?? './coverage'
      );

      const { default: Report } = await import('c8/lib/report.js');

      const useMonocart = options.experimental?.includes('monocart') ?? false;

      const monocartArgv = useMonocart
        ? {
            reporter,
            reportsDir: reportsDirectory,
            tempDirectory: tempDir,
            all: options.all ?? false,
            src: options.src,
            skipFull: options.skipFull ?? false,
            excludeAfterRemap: options.excludeAfterRemap ?? false,
            clean: options.clean !== false,
          }
        : undefined;

      const report = Report({
        tempDirectory: tempDir,
        reportsDirectory,
        reporter,
        include: options.include ?? [],
        exclude: options.exclude,
        extension: options.extension,
        all: options.all ?? false,
        src: options.src,
        resolve: '',
        omitRelative: true,
        excludeNodeModules: true,
        skipFull: options.skipFull ?? false,
        excludeAfterRemap: options.excludeAfterRemap ?? false,
        watermarks: options.watermarks,
        mergeAsync: options.mergeAsync ?? false,
        monocartArgv,
      });

      await report.run();

      if (options.checkCoverage) {
        const { checkCoverages } =
          await import('c8/lib/commands/check-coverage.js');

        const threshold =
          typeof options.checkCoverage === 'number'
            ? options.checkCoverage
            : undefined;

        await checkCoverages(
          {
            lines: threshold ?? options.lines ?? 0,
            branches: threshold ?? options.branches ?? 0,
            functions: threshold ?? options.functions ?? 0,
            statements: threshold ?? options.statements ?? 0,
            perFile: options.perFile ?? false,
          },
          report
        );

        if (process.exitCode === 1) {
          const coverageFailure = () => {
            process.exitCode = 1;
          };

          process.once('exit', coverageFailure);
        }
      }

      if (!userProvidedTempDir) {
        try {
          rmSync(tempDir, { recursive: true, force: true });
        } catch {
          // Best-effort cleanup
        }
      }
    },
  };
};
