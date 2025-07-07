import * as fs from "fs";
import * as path from "path";

export class FileService {
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

  private isDuplicate<T>(array: T[], obj: T): boolean {
    const objStr = JSON.stringify(obj);
    return array.some((item) => JSON.stringify(item) === objStr);
  }

  public appendToDataJsonFile<T>(
    destinationFolder: string,
    fileName: string,
    obj: T
  ): void {
    const baseDir = path.join(__dirname, "../", destinationFolder);
    try {
      this.ensureDirectory(baseDir);
    } catch {
      console.error(
        `[WARN] Chemin d'accès corrompu ou inexistant : ${baseDir}.`
      );
      return;
    }

    const filePath = path.join(baseDir, `${fileName}.json`);

    if (!this.fileExists(filePath)) {
      this.createJsonFile(filePath);
      console.info(`[INFO] Création : ${fileName}.json`);
    }

    let data: T[] = [];
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

    if (!this.isDuplicate(data, obj)) {
      data.push(obj);
      this.writeFile(filePath, data);
      console.info(`[INFO] Ajout : objet ajouté dans ${fileName}.json`);
    } else {
      console.warn(
        `[WARN] Doublon détecté dans ${fileName}.json — aucun ajout effectué.`
      );
    }
  }
}
