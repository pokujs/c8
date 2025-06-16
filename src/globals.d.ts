type CreateReporterProps = {
  reporter: string[];
  reportsDirectory: string;
  tempDirectory: string;
};

declare module 'c8/lib/report.js' {
  const createReporter: (props: CreateReporterProps) => {
    run: () => Promise<void>;
  };
  export default createReporter;
}
