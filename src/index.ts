import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import createReporter from 'c8/lib/report.js';
import { GLOBAL } from 'poku/lib/configs/poku';

export async function coverageStart(dir: string): Promise<void> {
  const tempDir = join(dir, '.tmp');
  await rm(tempDir, { recursive: true, force: true });
  await mkdir(tempDir, { recursive: true });
  GLOBAL.coverageDir = dir;
  GLOBAL.coverageTempDir = tempDir;
  process.env.NODE_V8_COVERAGE = tempDir;
  GLOBAL.configs.noExit = true;
}

export async function coverageReport(reports: string[]): Promise<void> {
  if (!(GLOBAL.coverageTempDir && GLOBAL.coverageDir)) return;

  const report = createReporter({
    reporter: reports,
    reportsDirectory: GLOBAL.coverageDir,
    tempDirectory: GLOBAL.coverageTempDir,
  });
  await report.run();
}
