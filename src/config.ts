import type { CoverageOptions } from './types.js';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSONC } from 'jsonc.min';
import { parse as tomlParse } from 'toml.min';
import { parse as yamlParse } from 'yaml.min';

const scriptExtensions = new Set([
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.mts',
  '.cts',
]);

const isScript = (path: string): boolean =>
  scriptExtensions.has(getExtension(path));

const isToml = (path: string): boolean => getExtension(path) === '.toml';

const isYaml = (path: string): boolean => {
  const ext = getExtension(path);
  return ext === '.yml' || ext === '.yaml';
};

const getExtension = (filePath: string): string => {
  const dotIndex = filePath.lastIndexOf('.');
  if (dotIndex === -1) return '';
  return filePath.slice(dotIndex);
};

const parseConfig = (
  content: string,
  filePath: string
): Record<string, unknown> => {
  if (isToml(filePath)) return tomlParse(content) as Record<string, unknown>;
  if (isYaml(filePath)) return yamlParse(content) as Record<string, unknown>;
  return JSONC.parse(content) as Record<string, unknown>;
};

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
        '.c8rc.toml',
        '.c8rc.yaml',
        '.c8rc.yml',
        '.nycrc',
        '.nycrc.json',
        '.nycrc.jsonc',
        '.nycrc.toml',
        '.nycrc.yaml',
        '.nycrc.yml',
      ];

  for (const file of expectedFiles) {
    if (isScript(file)) continue;

    const filePath = join(cwd, file);

    if (!existsSync(filePath)) continue;

    try {
      const content = readFileSync(filePath, 'utf8');

      return mapKeys(parseConfig(content, file));
    } catch {}
  }

  return Object.create(null);
};
