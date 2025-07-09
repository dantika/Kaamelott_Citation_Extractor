const fs = require('fs');
const path = require('path');

// 1. Fonction récursive pour aplatir un objet
function flatten(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [k,v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(acc, flatten(v, key));
    } else {
      acc[key] = v;
    }
    return acc;
  }, {});
}

// 2. Lire et parser
const raw = fs.readFileSync('citations.json', 'utf-8');
const data = JSON.parse(raw);

// 3. Aplatir chaque item et détecter dynamiquement les champs qu’on veut (tout sauf description)
const flatData = data.map(item => flatten(item));
const allFields = Array.from(
  new Set(flatData.flatMap(item => Object.keys(item)))
).filter(f => f !== 'description');

// 4. Collecter et normaliser toutes les valeurs par champ
const valuesByField = {};
allFields.forEach(f => valuesByField[f] = new Set());

flatData.forEach(item => {
  allFields.forEach(f => {
    if (item[f] != null) {
      let v = String(item[f])
        .replace(/\u00A0/g, ' ')   // NBSP → space
        .replace(/\s+/g, ' ')      // plusieurs espaces → un seul
        .trim();                   // trim en tête/queue
      if (v) valuesByField[f].add(v);
    }
  });
});

// 5. Trier chaque liste (sensible à la casse et accents)
allFields.forEach(f => {
  valuesByField[f] = Array.from(valuesByField[f])
    .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'variant' }));
});

// 6. Générer un TXT
let out = 'VARIATIONS PAR CHAMP\n\n';
allFields.forEach(f => {
  out += `${f}:\n`;
  valuesByField[f].forEach(v => {
    out += `- ${v}\n`;
  });
  out += '\n';
});

// 7. Sauver dans variations.txt
const outPath = path.join(__dirname, 'variations.txt');
fs.writeFileSync(outPath, out, 'utf-8');
console.log(`✅ variations.txt généré : ${outPath}`);