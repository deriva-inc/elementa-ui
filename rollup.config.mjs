/* eslint-disable import/no-extraneous-dependencies */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import { dts } from 'rollup-plugin-dts';
import fs from 'fs';

// Read package.json synchronously and parse it. This is 100% reliable.
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

export default [
    // --- JavaScript and TypeScript Bundle ---
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            // The copy plugin now lives here. It only needs to run once.
            copy({
                targets: [
                    { src: 'src/assets/fonts', dest: 'dist/assets/fonts' }
                ]
            })
        ],
        // Define external dependencies to avoid bundling them
        external: ['react', 'react-dom']
    },

    // --- CSS Bundle ---
    {
        input: 'src/styles/globals.css',
        output: {
            file: 'dist/style.css'
        },
        plugins: [
            // PostCSS will process your CSS file
            postcss({
                extract: true, // This is key. It creates the separate style.css file.
                minimize: true,
                // Assumes you have a postcss.config.js for Tailwind
                config: true
            })
        ]
    },

    // --- TypeScript Declaration (.d.ts) Bundle ---
    {
        input: 'dist/types/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        plugins: [dts()],
        external: [/\.css$/] // Exclude CSS files from the types
    }
];
