export interface IPlcTelemetryWorker {
  start(intervalMs?: number): void;
  stop(): void;
}
