import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const idPath = path.join(rootDir, 'resources', 'js', 'locales', 'id.json');
const enPath = path.join(rootDir, 'resources', 'js', 'locales', 'en.json');

if (!fs.existsSync(idPath) || !fs.existsSync(enPath)) {
    console.error('❌ Berkas id.json atau en.json tidak ditemukan di resources/js/locales/');
    process.exit(1);
}

const idJson = JSON.parse(fs.readFileSync(idPath, 'utf8'));
const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));

/**
 * Mengambil semua flattened dot-notated key beserta nilainya
 */
function getFlattenedKeys(obj, prefix = '') {
    const keys = new Map();
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            const nested = getFlattenedKeys(value, fullKey);
            for (const [nKey, nVal] of nested.entries()) {
                keys.set(nKey, nVal);
            }
        } else {
            keys.set(fullKey, value);
        }
    }
    return keys;
}

const idKeys = getFlattenedKeys(idJson);
const enKeys = getFlattenedKeys(enJson);

let hasError = false;

// 1. Periksa kunci di id.json yang tidak ada di en.json
for (const [key, val] of idKeys.entries()) {
    if (!enKeys.has(key)) {
        console.error(`❌ Kunci "${key}" ada di id.json tetapi hilang di en.json`);
        hasError = true;
    } else {
        const enVal = enKeys.get(key);
        if (typeof val === 'string' && val.trim() === '') {
            console.error(`❌ Nilai kunci "${key}" di id.json kosong`);
            hasError = true;
        }
        if (typeof enVal === 'string' && enVal.trim() === '') {
            console.error(`❌ Nilai kunci "${key}" di en.json kosong`);
            hasError = true;
        }
    }
}

// 2. Periksa kunci di en.json yang tidak ada di id.json
for (const [key] of enKeys.entries()) {
    if (!idKeys.has(key)) {
        console.error(`❌ Kunci "${key}" ada di en.json tetapi hilang di id.json`);
        hasError = true;
    }
}

if (hasError) {
    console.error('❌ Pemeriksaan kelengkapan i18n gagal.');
    process.exit(1);
} else {
    console.log(`✅ Pemeriksaan kelengkapan i18n lulus (${idKeys.size} kunci terverifikasi identik).`);
}
