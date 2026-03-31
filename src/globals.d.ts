declare module 'c8/lib/report.js' {
  interface Report {
    run(): Promise<void>;
    getCoverageMapFromAllCoverageFiles(): Promise<unknown>;
  }

  function createReport(opts: Record<string, unknown>): Report;
  export = createReport;
}

declare module 'c8/lib/commands/check-coverage.js' {
  export function checkCoverages(
    argv: Record<string, unknown>,
    report: unknown
  ): Promise<void>;
}
