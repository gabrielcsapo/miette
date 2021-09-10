import { IError } from "./types";
import { GraphicalReportHandler } from "./renderer";
import { Diagnostic } from "./diagnostic";

export function MietteError(error: IError): void {
  const diagnostic = new Diagnostic(error);
  const reporter = new GraphicalReportHandler(diagnostic);

  reporter.render();
}
