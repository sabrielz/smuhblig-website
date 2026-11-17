import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(cmd, desc) {
    console.log(`\n=== [verify] ${desc} ===`);
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (err) {
        console.error(`\n❌ [verify] Gagal: ${desc}`);
        process.exit(1);
    }
}

// 1. Kumpulkan file yang berubah/baru terhadap HEAD
let changedFiles = [];
try {
    const diff = execSync('git diff --name-only HEAD', { encoding: 'utf-8' }).trim();
    const untracked = execSync('git ls-files --others --exclude-standard', { encoding: 'utf-8' }).trim();
    const rawList = [...diff.split('\n'), ...untracked.split('\n')]
        .map(f => f.trim())
        .filter(f => f.length > 0);

    changedFiles = [...new Set(rawList)].filter(f => fs.existsSync(f));
} catch (e) {
    console.error('Error saat membaca git status:', e);
}

const phpFiles = changedFiles.filter(f => f.endsWith('.php'));
const appPhpFiles = phpFiles.filter(f => f.startsWith('app/') || f.startsWith('app\\'));
const jsTsFiles = changedFiles.filter(f => (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) && f.startsWith('resources/js'));

// PHP Pint
if (phpFiles.length > 0) {
    const quoted = phpFiles.map(f => `"${f}"`).join(' ');
    run(`php vendor/bin/pint ${quoted}`, 'Pint (Format PHP)');
}

// PHPStan
if (appPhpFiles.length > 0) {
    const quoted = appPhpFiles.map(f => `"${f}"`).join(' ');
    run(`php vendor/bin/phpstan analyse --no-progress --memory-limit=1G ${quoted}`, 'PHPStan (Analisis Statis PHP)');
}

// ESLint
if (jsTsFiles.length > 0) {
    const quoted = jsTsFiles.map(f => `"${f}"`).join(' ');
    run(`npx eslint --quiet ${quoted}`, 'ESLint (Lint JS/TS)');
}

// Selalu jalankan cek i18n
run('node scripts/check-i18n.mjs', 'i18n Key Consistency Check');

// Selalu type-check & test frontend
run('npx tsc --noEmit', 'TypeScript Check');
run('npx vitest run --passWithNoTests', 'Vitest (Frontend Tests)');

console.log('\n✅ [verify] Seluruh pemeriksaan berhasil!\n');
