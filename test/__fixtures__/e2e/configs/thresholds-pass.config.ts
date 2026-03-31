import { defineConfig } from 'poku';
import { coverage } from '../../../../src/index.ts';

export default defineConfig({
  include: ['test/'],
  plugins: [
    coverage({
      include: ['src/**'],
      reporter: ['text'],
      checkCoverage: true,
      lines: 30,
    }),
  ],
});
