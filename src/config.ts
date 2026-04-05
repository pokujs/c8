import type { CoverageOptions } from './types.js';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSONC } from 'jsonc.min';

const kebabMap: Record<string, string> = {
  'reports-dir': 'reportsDirectory',
  'report-dir': 'reportsDirectory',
  'temp-directory': 'tempDirectory',
  'check-coverage': 'checkCoverage',
  'per-file': 'perFile',
  'skip-full': 'skipFull',
  'exclude-after-remap': 'excludeAfterRemap',
  'merge-async': 'mergeAsync',
};

const mapKeys = (raw: Record<string, unknown>): Partial<CoverageOptions> => {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (key === 'experimental-monocart') {
      if (value) result.experimental = ['monocart'];
      continue;
    }
    result[kebabMap[key] ?? key] = value;
  }

  return result as Partial<CoverageOptions>;
};

export const loadConfig = (
  cwd: string,
  customPath?: string | false
): CoverageOptions => {
  if (customPath === false) return Object.create(null);

  const expectedFiles = customPath
    ? [customPath]
    : [
        '.c8rc',
        '.c8rc.json',
        '.c8rc.jsonc',
        '.nycrc',
        '.nycrc.json',
        '.nycrc.jsonc',
      ];

  for (const file of expectedFiles) {
    const filePath = join(cwd, file);

    if (!existsSync(filePath)) continue;

    try {
      const content = readFileSync(filePath, 'utf8');

      return mapKeys(JSONC.parse(content) as Record<string, unknown>);
    } catch {}
  }

  return Object.create(null);
};
