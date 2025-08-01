import * as fs from "fs";
import * as path from "path";
import { FILE_EXTENSION } from "./../constants/file-extension.enum";
import {
  CITATIONS,
  GLOBAL,
  PARSED_EXTRACT,
  VARIATIONS,
} from "./../constants/filenames.constant";
import { logger } from "./../services/logger.service";

// Types
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];
type FlatObject = { [key: string]: JsonValue };

const loggerContext = "CitationVariationExtractor";

// 1. Fonction récursive pour aplatir un objet
function flatten(obj: JsonObject, prefix: string = ""): FlatObject {
  return Object.entries(obj).reduce<FlatObject>((acc, [k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(acc, flatten(v as JsonObject, key));
    } else {
      acc[key] = v;
    }
    return acc;
  }, {});
}

// Fonction pour convertir un nom de champ en nom d'enum
function fieldToEnumName(field: string): string {
  // Remplacer les points par des underscores et mettre en majuscules
  return field.replace(/\./g, "_").toUpperCase();
}

// Fonction pour convertir une valeur en nom de membre d'enum
function valueToEnumMember(value: string): string {
  // Remplacer les caractères accentués
  let result =
    value
      .normalize("NFD") // Décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/[^a-zA-Z0-9]/g, "_") // Remplace les caractères spéciaux
      .replace(/_+/g, "_") // Remplace les underscores multiples
      .replace(/^_|_$/g, "") // Supprime les underscores au début/fin
      .toUpperCase() || "EMPTY";

  // Préfixer si commence par un chiffre
  if (/^\d/.test(result)) {
    result = "_" + result;
  }

  return result;
}
// Vérifier l'existence du fichier citations.json
const citationsPath = path.join(
  process.cwd(),
  "dist",
  PARSED_EXTRACT,
  GLOBAL,
  `${CITATIONS}${FILE_EXTENSION.JSON}`
);

if (!fs.existsSync(citationsPath)) {
  logger.error("❌ Erreur : citations.json introuvable", loggerContext);
  logger.error(
    `Veuillez d'abord lancer un build prod/local pour générer le fichier.`,
    loggerContext
  );
  logger.error(`Chemins vérifiés :`, loggerContext);
  logger.error(`- ${citationsPath}`, loggerContext);
  process.exit(1);
}

// 2. Lire et parser
const raw = fs.readFileSync(citationsPath, "utf-8");
const data: JsonObject[] = JSON.parse(raw);

// 3. Aplatir chaque item et détecter dynamiquement les champs qu'on veut (tout sauf description)
const flatData = data.map((item) => flatten(item));
const allFields = Array.from(
  new Set(flatData.flatMap((item) => Object.keys(item)))
);

// 4. Collecter et normaliser toutes les valeurs par champ
const valuesByField: Record<string, Set<string>> = {};
allFields.forEach((f) => (valuesByField[f] = new Set<string>()));

function cleanValue(
  item: string | number | boolean | null | JsonObject | JsonArray
) {
  return String(item)
    .replace(/\u00A0/g, " ") // NBSP → space
    .replace(/\s+/g, " ") // plusieurs espaces → un seul
    .trim(); // trim en tête/queue
}

flatData.forEach((item, i) => {
  allFields.forEach((f) => {
    if (Array.isArray(item[f]) && item[f].length > 1) {
      item[f].forEach((item) => {
        if (item != null) {
          let v = cleanValue(item);
          if (v) valuesByField[f].add(v);
        }
      });
    } else {
      if (item[f] != null) {
        let v = cleanValue(item[f]);
        if (v) valuesByField[f].add(v);
      }
    }
  });
});

// 5. Trier chaque liste (sensible à la casse et accents)
const sortedValuesByField: Record<string, string[]> = {};
allFields.forEach((f) => {
  sortedValuesByField[f] = Array.from(valuesByField[f]).sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "variant" })
  );
});

// 6. Générer les enums TypeScript
let enumsContent = "// Auto-generated file - Do not edit manually\n\n";

// Créer une map pour gérer les valeurs dupliquées
const enumValueMaps: Record<string, Record<string, string>> = {};

allFields.forEach((field) => {
  const enumName = fieldToEnumName(field);
  enumValueMaps[field] = {};

  enumsContent += `export enum ${enumName} {\n`;

  sortedValuesByField[field].forEach((value, index) => {
    let enumMember = valueToEnumMember(value);

    // Gérer les doublons en ajoutant un suffixe numérique
    let finalEnumMember = enumMember;
    let counter = 1;
    while (Object.values(enumValueMaps[field]).includes(finalEnumMember)) {
      finalEnumMember = `${enumMember}_${counter}`;
      counter++;
    }

    enumValueMaps[field][value] = finalEnumMember;
    enumsContent += `  ${finalEnumMember} = '${value.replace(/'/g, "\\'")}',\n`;
  });

  enumsContent += "}\n\n";
});

// 7. Sauver dans citations.variations.enum.ts
const outPath = path.join(process.cwd(), "dist", PARSED_EXTRACT, VARIATIONS);
const outFilePath = path.join(outPath, `${CITATIONS}.${VARIATIONS}.enum.ts`);

if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}
fs.writeFileSync(outFilePath, enumsContent, "utf-8");
logger.info(
  `✅ citations.variations.enum.ts généré : ${outFilePath}`,
  loggerContext
);
