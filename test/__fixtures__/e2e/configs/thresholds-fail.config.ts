import { defineConfig } from 'poku';
import { coverage } from '../../../../src/index.ts';

export default defineConfig({
  include: ['test/'],
  plugins: [
    coverage({
      include: ['src/**'],
      reporter: ['text'],
      checkCoverage: true,
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100,
    }),
  ],
});
