/* eslint-disable import/no-extraneous-dependencies */
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import path from 'path';
import copy from 'rollup-plugin-copy';

// Read package.json synchronously and parse it. This is 100% reliable.
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const external = (id) => {
    if (id === 'react' || id.startsWith('react/')) return true;
    if (id === 'react-dom' || id.startsWith('react-dom/')) return true;
    const deps = [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.peerDependencies || {})
    ];
    return deps.some((dep) => id === dep || id.startsWith(`${dep}/`));
};

function bundleCssPlugin() {
    return {
        name: 'bundle-elementa-css',
        buildStart() {
            this.addWatchFile('src/styles/styles.css');
            this.addWatchFile('src/styles/lenis.css');
            this.addWatchFile('src/styles/animations.css');
            this.addWatchFile('src/styles/theme.css');
            this.addWatchFile('src/styles/utilities.css');
        },
        generateBundle() {
            const parts = [];

            // 1. Font Imports (Rowan, Satoshi, JetBrains Mono)
            parts.push(`/* Fontshare CDN - Rowan (Serif / Headings) */
@import url('https://api.fontshare.com/v2/css?f[]=rowan@400,500,700&display=swap');

/* Fontshare CDN - Satoshi (Sans / Body) */
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap');

/* Google Fonts - JetBrains Mono (Monospace / Code) */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300..800;1,300..800&display=swap');`);

            // 2. tw-animate-css
            if (fs.existsSync('node_modules/tw-animate-css/dist/tw-animate.css')) {
                parts.push(
                    '/* === tw-animate-css === */\n' +
                        fs.readFileSync('node_modules/tw-animate-css/dist/tw-animate.css', 'utf8')
                );
            }

            // 3. shadcn/tailwind.css
            if (fs.existsSync('node_modules/shadcn/dist/tailwind.css')) {
                parts.push(
                    '/* === shadcn === */\n' +
                        fs.readFileSync('node_modules/shadcn/dist/tailwind.css', 'utf8')
                );
            }

            // 4. lenis.css
            if (fs.existsSync('src/styles/lenis.css')) {
                parts.push(
                    '/* === Lenis Smooth Scroll === */\n' +
                        fs.readFileSync('src/styles/lenis.css', 'utf8')
                );
            }

            // 5. animations.css
            if (fs.existsSync('src/styles/animations.css')) {
                parts.push(
                    '/* === Elementa Animations === */\n' +
                        fs.readFileSync('src/styles/animations.css', 'utf8')
                );
            }

            // 6. theme.css (strip @import "./energies/index.css"; since energies are inlined below)
            if (fs.existsSync('src/styles/theme.css')) {
                let theme = fs.readFileSync('src/styles/theme.css', 'utf8');
                theme = theme.replace(
                    /@import\s+["\x27]\.\/energies\/index\.css["\x27];?\s*/g,
                    ''
                );
                parts.push('/* === Elementa Theme & Tokens === */\n' + theme);
            }

            // 7. All energies
            const energyDir = 'src/styles/energies';
            if (fs.existsSync(energyDir)) {
                const energyFiles = fs
                    .readdirSync(energyDir)
                    .filter((f) => f.endsWith('.css') && f !== 'index.css');
                parts.push('/* === Elementa Energies === */');
                for (const f of energyFiles) {
                    const eContent = fs.readFileSync(path.join(energyDir, f), 'utf8');
                    parts.push(`/* Energy: ${f} */\n` + eContent);
                }
            }

            // 8. utilities.css
            if (fs.existsSync('src/styles/utilities.css')) {
                parts.push(
                    '/* === Elementa Utilities === */\n' +
                        fs.readFileSync('src/styles/utilities.css', 'utf8')
                );
            }

            // 9. Custom variant
            parts.push(
                '/* === Dark Mode Variant === */\n@custom-variant dark (&:where(.dark, .dark *));\n'
            );

            this.emitFile({
                type: 'asset',
                fileName: 'styles.css',
                source: parts.join('\n\n')
            });
        }
    };
}

export default [
    // --- JavaScript and TypeScript Bundle ---
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
                banner: "'use client';"
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true,
                banner: "'use client';"
            }
        ],
        plugins: [
            resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] }),
            commonjs(),
            json(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: './dist/types',
                outDir: './dist'
            }),
            bundleCssPlugin(),
            copy({
                targets: [
                    { src: 'src/styles/theme.css', dest: 'dist' },
                    { src: 'src/styles/energies', dest: 'dist' },
                    { src: 'src/styles/lenis.css', dest: 'dist' },
                    { src: 'src/styles/utilities.css', dest: 'dist' },
                    { src: 'src/styles/animations.css', dest: 'dist' }
                ]
            })
        ],
        external
    }
];
