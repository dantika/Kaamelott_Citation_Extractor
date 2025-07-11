import * as fs from "fs";
import * as path from "path";
import { CitationModel } from "../models/citation.model";
import { FILE_EXTENSION } from "./../contants/file-extension.enum";
import { commonService } from "./common.service";
import { logger } from "./logger.service";

export class FileService {
  private baseDir = path.join(__dirname, "../");
  private loggerContext = "FileService";

  private ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`Directory created: ${dirPath}`, this.loggerContext);
    }
  }

  private readJson<T>(filePath: string): T | undefined {
    const raw = commonService.safeExecute(
      () => fs.readFileSync(filePath, "utf-8"),
      `Could not read file: ${filePath}`
    );
    if (typeof raw !== "string") return;
    return commonService.safeExecute(
      () => JSON.parse(raw) as T,
      `Invalid JSON in file: ${filePath}`
    );
  }

  private writeFile(filePath: string, data: any): void {
    commonService.safeExecute(
      () => fs.writeFileSync(filePath, data, "utf-8"),
      `Could not write to file: ${filePath}`
    );
    logger.info(`File updated: ${filePath}`, this.loggerContext);
  }

  fileCreation(
    outputDir: string,
    fileName: string,
    extension: FILE_EXTENSION,
    content: any
  ): string {
    const dir = path.join(this.baseDir, outputDir);
    commonService.safeExecute(
      () => this.ensureDirectory(dir),
      `Invalid or inaccessible path: ${dir}`
    );

    const filePath = path.join(dir, `${fileName}${extension}`);
    this.createFileIfMissing(filePath, () =>
      fs.writeFileSync(filePath, content, { encoding: "utf8" })
    );
    logger.info(`Created: ${fileName}${extension}`, this.loggerContext);

    return filePath;
  }

  private createFileIfMissing(filePath: string, initializer: () => void): void {
    if (!fs.existsSync(filePath)) {
      commonService.safeExecute(
        initializer,
        `Could not create file: ${filePath}`
      );
    }
  }

  appendToDataJson(
    destinationFolder: string,
    fileName: string,
    items: CitationModel[]
  ): void {
    const filePath = this.fileCreation(
      destinationFolder,
      fileName,
      FILE_EXTENSION.JSON,
      JSON.stringify([], null, 2)
    );

    const existing = this.readJson<CitationModel[]>(filePath) ?? [];
    let added = 0;

    for (const item of items) {
      const isDuplicate = existing.some(
        (e) => JSON.stringify(e) === JSON.stringify(item)
      );
      if (isDuplicate) {
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

    this.writeFile(filePath, JSON.stringify(existing, null, 2));
  }
}

export const fileService = new FileService();
