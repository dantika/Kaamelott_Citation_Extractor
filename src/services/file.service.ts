import * as fs from "fs";
import * as path from "path";
import { CitationModel } from "../models/citation.model";

export class FileService {
  baseDir = path.join(__dirname, "../");

  constructor() {}

  private ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.info(`[INFO] Création directory : ${dirPath}`);
    }
  }

  private fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  private createJsonFile(filePath: string, space: number = 2): void {
    fs.writeFileSync(filePath, JSON.stringify([], null, space), "utf-8");
  }

  private readFile(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8");
  }

  private writeFile(filePath: string, data: unknown, space: number = 2): void {
    fs.writeFileSync(filePath, JSON.stringify(data, null, space), "utf-8");
  }

  private isDuplicate<T>(array: T[], obj: CitationModel): boolean {
    const objStr = JSON.stringify(obj);
    return array.some((item) => JSON.stringify(item) === objStr);
  }

  writeXmlFile(outputDir: string, fileName: string, content: string): void {
    const dir = path.join(this.baseDir, outputDir);

    try {
      this.ensureDirectory(dir);
    } catch {
      console.error(`[WARN] Chemin d'accès corrompu ou inexistant : ${dir}.`);
      return;
    }

    const filePath = `${dir}/${fileName}.xml`;

    if (!this.fileExists(filePath)) {
      fs.writeFileSync(filePath, content, {
        encoding: "utf8",
      });
      console.info(`[INFO] Création : ${fileName}.xml`);
    }
  }

  appendToDataJsonFile(
    destinationFolder: string,
    fileName: string,
    obj: CitationModel[]
  ): void {
    const dir = path.join(this.baseDir, destinationFolder);

    try {
      this.ensureDirectory(dir);
    } catch {
      console.error(`[WARN] Chemin d'accès corrompu ou inexistant : ${dir}.`);
      return;
    }

    const filePath = path.join(dir, `${fileName}.json`);

    if (!this.fileExists(filePath)) {
      this.createJsonFile(filePath);
      console.info(`[INFO] Création : ${fileName}.json`);
    }

    let data: CitationModel[] = [];
    try {
      const raw = this.readFile(filePath);
      const parsed = JSON.parse(raw);
      data = Array.isArray(parsed) ? parsed : [];
    } catch {
      console.warn(
        `[WARN] Fichier corrompu ou format inattendu : ${filePath}. Réinitialisation.`
      );
      data = [];
    }

    obj.forEach((el) => {
      if (!this.isDuplicate(data, el)) {
        data.push(el);
        this.writeFile(filePath, data);
        console.info(`[INFO] Ajout : objet ajouté dans ${fileName}.json`);
      } else {
        console.warn(
          `[WARN] Doublon détecté dans ${fileName}.json — aucun ajout effectué.\n\r${JSON.stringify(
            el
          )}`
        );
      }
    });
  }
}
