import { LogManager } from ".";
import path from "path";
import fs from "fs/promises";

// TODO: auto delete logs
export default class LocalLogManager implements LogManager {
  private dir: string;

  constructor(dir: string) {
    this.dir = dir;
  }

  private getDir(id: string) {
    return path.join(this.dir, id);
  }

  async writeFile(id: string, file: string, contents: string): Promise<void> {
    const dir = await this.getDir(id);
    await fs.writeFile(path.join(dir, file), contents);
  }

  // Silently fail on these in case we requested a log that doesn't exist
  async readFile(id: string, file: string): Promise<string> {
    try {
      const dir = await this.getDir(id);
      return await fs.readFile(path.join(dir, file), "utf-8");
    } catch (e) {
      return "";
    }
  }

  async getFiles(id: string): Promise<string[]> {
    try {
      const dir = await this.getDir(id);
      return await fs.readdir(dir);
    } catch (e) {
      return [];
    }
  }

  async createLog(id: string): Promise<void> {
    const dir = await this.getDir(id);

    const exists = await fs.stat(dir).catch(() => false);
    if (exists) {
      // Hash collision, reuploaded file, whatever - just clean it
      await fs.rm(dir, { recursive: true });
    }

    await fs.mkdir(dir, { recursive: true });
  }

  async deleteLog(id: string): Promise<void> {
    const dir = await this.getDir(id);
    await fs.rm(dir, { recursive: true });
  }
}
