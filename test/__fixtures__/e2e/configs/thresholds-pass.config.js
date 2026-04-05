const { coverage } = require('../../../../lib/index.js');

/** @type {import('poku').PokuConfig} */
module.exports = {
  include: ['test/'],
  plugins: [
    coverage({
      include: ['src/**'],
      reporter: ['text'],
      checkCoverage: true,
      lines: 30,
    }),
  ],
};
