import * as fs from "fs";
import * as path from "path";
import { CitationModel } from "../models/citation.model";
import { logger } from "./logger.service";

export class FileService {
  private baseDir = path.join(__dirname, "../");
  private loggerContext = "FileService";

  private safeExecute<T>(fn: () => T, errorMsg: string, fallback?: T): T {
    try {
      return fn();
    } catch (err) {
      logger.error(errorMsg, this.loggerContext);
      return fallback as T;
    }
  }

  private ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`Directory created: ${dirPath}`, this.loggerContext);
    }
  }

  private readJson<T>(filePath: string): T | undefined {
    const raw = this.safeExecute(
      () => fs.readFileSync(filePath, "utf-8"),
      `Could not read file: ${filePath}`
    );
    if (typeof raw !== "string") return;
    return this.safeExecute(
      () => JSON.parse(raw) as T,
      `Invalid JSON in file: ${filePath}`
    );
  }

  private writeJson(filePath: string, data: unknown, space = 2): void {
    this.safeExecute(
      () =>
        fs.writeFileSync(filePath, JSON.stringify(data, null, space), "utf-8"),
      `Could not write to file: ${filePath}`
    );
    logger.info(`File updated: ${filePath}`, this.loggerContext);
  }

  private createFileIfMissing(filePath: string, initializer: () => void): void {
    if (!fs.existsSync(filePath)) {
      this.safeExecute(initializer, `Could not create file: ${filePath}`);
    }
  }

  writeXmlFile(outputDir: string, fileName: string, content: string): void {
    const dir = path.join(this.baseDir, outputDir);
    this.safeExecute(
      () => this.ensureDirectory(dir),
      `Invalid or inaccessible path: ${dir}`
    );

    const xmlPath = path.join(dir, `${fileName}.xml`);
    this.createFileIfMissing(xmlPath, () =>
      fs.writeFileSync(xmlPath, content, { encoding: "utf8" })
    );
    logger.info(`Created: ${fileName}.xml`, this.loggerContext);
  }

  appendToDataJsonFile(
    destinationFolder: string,
    fileName: string,
    items: CitationModel[]
  ): void {
    const dir = path.join(this.baseDir, destinationFolder);
    this.safeExecute(
      () => this.ensureDirectory(dir),
      `Invalid or inaccessible path: ${dir}`
    );

    const jsonPath = path.join(dir, `${fileName}.json`);
    this.createFileIfMissing(jsonPath, () =>
      fs.writeFileSync(jsonPath, JSON.stringify([], null, 2), "utf-8")
    );

    const existing = this.readJson<CitationModel[]>(jsonPath) ?? [];
    let added = 0;

    for (const item of items) {
      const isDup = existing.some(
        (e) => JSON.stringify(e) === JSON.stringify(item)
      );
      if (isDup) {
        logger.warn(
          `Duplicate skipped: ${JSON.stringify(item)}`,
          this.loggerContext
        );
        continue;
      }
      existing.push(item);
      added++;
      logger.info(
        `Added ${added} item(s) to ${fileName}.json`,
        this.loggerContext,
        true
      );
    }

    this.writeJson(jsonPath, existing);
  }
}
