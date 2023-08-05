import LocalLogManager from "./local";

export interface LogManager {
  writeFile(id: string, file: string, contents: string): Promise<void>;
  readFile(id: string, file: string): Promise<string>;
  getFiles(id: string): Promise<string[]>;
  createLog(id: string): Promise<void>;
  deleteLog(id: string): Promise<void>;
}

export function getLogManager(): LogManager {
  if (global.logManager != undefined) return global.logManager;

  switch (process.env.STORAGE_METHOD) {
    case "local":
      global.logManager = new LocalLogManager(
        process.env.LOCAL_STORAGE_DIRECTORY
      );
      break;

    case "s3":
      // TODO
      break;
  }

  return global.logManager!;
}

export function isValidID(id: string): boolean {
  return /^[a-f0-9]{64}$/.test(id);
}

export function fishForRegex<T>(log: string, regex: RegExp): T | null {
  const matches = Array.from(log.matchAll(regex));

  if (matches.length > 0) {
    const lastEntry = matches[matches.length - 1];
    const buffer = Buffer.from(lastEntry[1], "base64");
    const data: T = JSON.parse(buffer.toString("utf8"));
    return data;
  }

  return null;
}
