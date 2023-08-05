import { LogManager } from "@/logs";

declare global {
  var logManager: LogManager | undefined;

  namespace NodeJS {
    interface ProcessEnv {
      STORAGE_METHOD: "local" | "s3";
      LOCAL_STORAGE_DIRECTORY: string;
    }
  }
}

export {};
