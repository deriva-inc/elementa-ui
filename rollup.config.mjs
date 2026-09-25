/* eslint-disable import/no-extraneous-dependencies */
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';

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
            })
        ],
        external
    },

    // --- CSS Bundle ---
    {
        input: 'src/styles/styles.css',
        output: {
            file: 'dist/styles.css'
        },
        plugins: [
            postcss({
                extract: true,
                minimize: true,
                config: true
            }),
            copy({
                targets: [
                    { src: 'src/styles/theme.css', dest: 'dist' },
                    { src: 'src/styles/energies', dest: 'dist' }
                ]
            })
        ]
    }
];
