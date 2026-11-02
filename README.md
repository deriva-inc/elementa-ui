# Elementa UI

[![npm version](https://img.shields.io/npm/v/get-elementa-ui.svg)](https://www.npmjs.com/package/get-elementa-ui)
[![License: MIT](https://img.shields.io/badge/License-GNU-yellow.svg)](https://elementa.deriva.xyz/license)
[![Documentation](https://img.shields.io/badge/docs-elementa.deriva.xyz-blue)](https://elementa.deriva.xyz)

The official UI component library and design system engine powering the Deriva ecosystem. Built with React 19, Tailwind CSS v4, Radix UI primitives, Motion, and Lucide icons.

---

## Introduction

**Elementa UI** (`get-elementa-ui` on npm) is a design system and React component library built to unify user experiences across Deriva's product portfolio. Rather than relying on generic AI defaults or cookie-cutter templates, Elementa UI embodies a distinct design language:

- **Headless Foundations with Opinionated Styling**: Re-uses battle-tested headless primitives from Radix UI while injecting Elementa's signature visual DNA.
- **5-Layer Spatial Elevation Model**: A mathematically rigorous elevation hierarchy (Layers 0 through 4) ranging from stable canvas surfaces to floating dialogs and high-priority overlays.
- **10 Dynamic Energies**: Real-time palette and vibe adaptation through `data-energy` attributes (`dusk-bloom`, `ember-glow`, `ocean-drift`, `cyber-matrix`, `aurora-veil`, `solar-flare`, `radiant-pulse`, `neon-synth`, `moss-glade`, and `crimson-tide`).
- **Signature Typography**: Direct CDN integration of `Rowan` (editorial serif headings), `Satoshi` (clean sans-serif body), and `JetBrains Mono` (code & data).
- **Extensible & Context-Aware**: Pre-styled smart defaults with full Tailwind CSS class overrides, dark/light system adaptation, and an automated context provider.

---

## Directory Structure

```text
elementa-ui/
├── .github/
│   └── workflows/
│       └── publish.yaml          # Automated CI/CD for npm publishing and versioning
├── dist/                         # Rollup build output (CJS, ESM, types, and styles)
│   ├── index.js                  # CommonJS bundle
│   ├── index.esm.js              # ECMAScript Module bundle
│   ├── styles.css                # Bundled CSS (fonts, animations, theme, energies)
│   ├── theme.css                 # Base theme and token CSS
│   └── types/                    # Generated TypeScript declarations
├── lib/                          # Core utilities, stores, data catalogs, and types
│   ├── api.ts                    # Client/server API error handlers
│   ├── constants.ts              # Platform and theme constants
│   ├── local-storage.ts          # LocalStorage abstraction with SSR safety
│   ├── logger.ts                 # Formatted console logger
│   ├── text.ts                   # String and clipboard helpers
│   ├── utils.ts                  # Tailwind clsx + twMerge helper (cn)
│   ├── data/
│   │   ├── blocks.json           # Registry catalog of UI blocks
│   │   ├── components.json       # Registry catalog of UI components
│   │   ├── changelogs/
│   │   │   ├── blocks/           # Per-block version changelogs
│   │   │   └── ui/               # Per-component version changelogs
│   │   └── installation-guide/   # Framework setup guides (Next.js, React, Flutter)
│   ├── hooks/                    # Custom React hooks (e.g., use-get-firebase-app)
│   ├── store/                    # Zustand stores (user UI preferences & theme)
│   └── types/                    # Shared TypeScript interfaces, types, and enums
├── src/                          # Source code
│   ├── assets/                   # Static assets and icons
│   ├── blocks/                   # High-level compound blocks & marketing patterns
│   │   ├── carousel/             # Interactive carousels (LightspunCurvedCarousel)
│   │   ├── code/                 # Syntax-highlighted CodeBlock
│   │   ├── text/                 # Animated and stylized typography (SquigglyText)
│   │   ├── ballpit.tsx           # Physics-based background simulation
│   │   ├── glowing-effect.tsx    # Interactive neon glow effect
│   │   └── ...
│   ├── components/               # 40+ atomic and molecular UI components
│   │   ├── button.tsx            # Button with variants and energy styling
│   │   ├── elementa-provider.tsx # Context provider for auto-theme and energy sync
│   │   ├── count-up.tsx          # Motion-driven numerical counter
│   │   └── ...
│   ├── styles/                   # Stylesheets and tokens
│   │   ├── animations.css        # Custom keyframe animations
│   │   ├── lenis.css             # Lenis smooth-scroll styles
│   │   ├── styles.css            # Root master stylesheet
│   │   ├── theme.css             # Design tokens and color variables
│   │   ├── utilities.css         # Custom Tailwind utility helpers
│   │   └── energies/             # CSS definitions for each of the 10 energies
│   └── index.ts                  # Main library entrypoint (exports components, blocks, utils)
├── CHANGELOG.md                  # Root library changelog tracking all releases
├── DESIGN.md                     # Comprehensive design philosophy & UX architecture
├── package.json                  # Package dependencies, build scripts, and metadata
├── rollup.config.mjs             # Rollup build and CSS bundling configuration
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## Developing and Testing Locally

### Prerequisites

- **Node.js**: `v20.x` or `v24.x` (recommended)
- **Yarn**: `1.x` (`classic`)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/deriva-inc/elementa-ui.git
cd elementa-ui
yarn install
```

### Local Build Scripts

```bash
# Build the entire library (CJS, ESM, TypeScript declarations, and CSS assets)
yarn build

# Run Rollup in watch mode for active component development
yarn build:watch
```

### Testing in a Consuming Application

To test changes in an external application (e.g. Next.js, Vite) before publishing:

#### Option 1: Symlinking via Yarn Link

1. Inside `elementa-ui`:
   ```bash
   yarn build
   yarn link
   ```
2. Inside your consuming application:
   ```bash
   yarn link "get-elementa-ui"
   ```

#### Option 2: Tarball Installation (Recommended for verifying production builds)

1. Inside `elementa-ui`, build and pack a `.tgz` archive:
   ```bash
   yarn build
   npm pack
   # Output: get-elementa-ui-<version>.tgz
   ```
2. Inside your consuming application:
   ```bash
   yarn add /path/to/elementa-ui/get-elementa-ui-<version>.tgz
   ```

---

## Deployments and CI/CD

Deployment is automated through GitHub Actions via [`.github/workflows/publish.yaml`](.github/workflows/publish.yaml).

### Workflow Triggers

- Any push or merge to the `main` branch.
- Any Git release tag matching `v*.*.*`.

### Pipeline Execution Steps

1. **Checkout & Environment Setup**: Checks out full Git history and sets up Node.js 24 with the npm registry.
2. **Dependency Installation**: Runs `yarn install`.
3. **Automated Version Detection & Auto-Bump**:
   - Queries the npm registry for the version currently listed in `package.json`.
   - If that version is already published on npm, GitHub Actions automatically bumps the patch version (`npm version patch --no-git-tag-version`), commits the change as `chore(release): bump version to <version> [skip ci]`, creates a matching tag, and pushes back to `main`.
4. **Build**: Executes `yarn build` to generate all distribution files in `dist/`.
5. **Publish**: Publishes the package to npm with public access using the `NPM_ACCESS_TOKEN` secret.

### Manual Version Bumping

To manually bump versions prior to pushing:

```bash
yarn version:patch  # 1.79.0 -> 1.79.1
yarn version:minor  # 1.79.0 -> 1.80.0
yarn version:major  # 1.79.0 -> 2.0.0
```

---

## Contributing

We welcome contributions to Elementa UI. When adding a new component or modifying an existing one, please ensure your changes adhere to our design principles, pass builds, and keep repository metadata in sync.

### Contribution Workflow

1. Create a feature branch: `git checkout -b feat/my-component`.
2. Implement your component, block, or style change.
3. Update metadata across the project (see detailed instructions below).
4. Run `yarn build` to verify clean compilation without TypeScript or CSS bundling errors.
5. Submit a Pull Request targeting `main`.

---

### Updating Metadata Across Files

To ensure documentation, changelogs, catalog schemas, and IDE tooling remain in sync, update the following files whenever modifying or creating components:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        METADATA UPDATE WORKFLOW                        │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Component Source File       │ Update JSDoc header (@version, date)  │
│ 2. Main Entrypoint             │ Export component and types in index.ts│
│ 3. Component / Block Catalog   │ Add/update props and docs in JSON     │
│ 4. Individual Changelog JSON   │ Prepend version changes under ui/     │
│ 5. Root Project CHANGELOG.md   │ Document release changes under date   │
└────────────────────────────────┴───────────────────────────────────────┘
```

#### 1. Component Source File (`src/components/<name>.tsx` or `src/blocks/<name>.tsx`)

Update or add the JSDoc docstring above the component definition with the component version and modification date:

```tsx
/**
 * Button component with Elementa theme, energy variants, and interactive feedback.
 *
 * @version 0.12.0
 * @author Your Name
 * @modified 2026-11-02
 */
export function Button(...) { ... }
```

#### 2. Main Entrypoint (`src/index.ts`)

Export the component, its subcomponents, and relevant TypeScript types under the matching section comment:

```typescript
// SECTION: Components
export { Button, buttonVariants, type ButtonProps } from './components/button';
// !SECTION: Components
```

#### 3. Component or Block Catalog (`lib/data/components.json` or `lib/data/blocks.json`)

Update or add the component's registry entry used by the documentation site:

```json
{
    "id": "button",
    "name": "Button",
    "description": "Interactive button with energy states and variants.",
    "version": "0.12.0",
    "lastUpdated": "2026-11-02",
    "thumbnail": "Button component with primary and secondary variants",
    "usage": "Use Button to trigger immediate UI actions and form submissions.",
    "props": [
        {
            "name": "variant",
            "type": "'default' | 'outline' | 'ghost' | 'link'",
            "default": "'default'",
            "description": "Visual style variant of the button"
        }
    ]
}
```

#### 4. Component Changelog JSON (`lib/data/changelogs/ui/<id>.json` or `lib/data/changelogs/blocks/<id>.json`)

Prepend the new version object to the top of the `"versions"` array:

```json
{
    "id": "button",
    "name": "Button",
    "versions": [
        {
            "version": "0.12.0",
            "date": "2026-11-02",
            "changes": [
                "Add subtle glow pulse on active state when rendered with neon energies."
            ]
        },
        {
            "version": "0.11.0",
            "date": "2026-09-25",
            "changes": ["Use relative imports instead of absolute imports."]
        }
    ]
}
```

#### 5. Root Changelog (`CHANGELOG.md`)

Add your changes under the current or upcoming library release header using standard Keep a Changelog categories (`Added`, `Changed`, `Fixed`, `Removed`, `Security`):

```markdown
### [1.79.1] - 2026-11-02
---
#### Added
- Fix font rendering issue by importing font in `ElementaProvider` component.
```

---

## npm and Consuming Applications Showcase

### Package Information

- **npm Registry**: [`get-elementa-ui`](https://www.npmjs.com/package/get-elementa-ui)
- **Documentation & Playground**: [elementa.deriva.xyz](https://elementa.deriva.xyz)
- **Icon Set**: [`elementa-icons`](https://www.npmjs.com/package/elementa-icons) ([elementa.deriva.xyz/icons](https://elementa.deriva.xyz/icons))

### Installation in Consumer Application

```bash
npm install get-elementa-ui
# or
yarn add get-elementa-ui
# or
pnpm add get-elementa-ui
```

### Quick Start Setup

#### 1. Import Global Styles

Import Elementa UI styles in your application's entrypoint or root CSS file (e.g. `app/globals.css` in Next.js or `src/index.css` in Vite):

```css
@import "get-elementa-ui/styles.css";
```

#### 2. Wrap with `ElementaProvider`

Wrap your application root with `<ElementaProvider>` to enable automated font preloading, theme synchronization, and energy management:

```tsx
import { ElementaProvider } from 'get-elementa-ui';

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ElementaProvider
                    defaultTheme="system"
                    defaultEnergy="dusk-bloom"
                >
                    {children}
                </ElementaProvider>
            </body>
        </html>
    );
}
```

#### 3. Render Components & Use the Hook

```tsx
import { Button, Text, useElementa } from 'get-elementa-ui';

export function DashboardHeader() {
    const { theme, energy, setTheme, setEnergy } = useElementa();

    return (
        <header className="flex items-center justify-between p-6 bg-surface-0 border-b border-border">
            <Text variant="heading-lg">Portfolio Dashboard</Text>
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    Toggle Theme ({theme})
                </Button>
                <Button
                    variant="default"
                    onClick={() => setEnergy('solar-flare')}
                >
                    Energize ({energy})
                </Button>
            </div>
        </header>
    );
}
```

### Consuming Applications Showcase

Elementa UI is deployed in production across the Deriva ecosystem, powering diverse applications:

- **[Khelo](https://khelo.app)**: Your leaderboard app for all racquet sports.
- **[tallileo](https://tallileo.com)**: track, save, share, and invest. all in one money app.
- **[Keyper](https://keyper.deriva.xyz)**: Self-hosted password manager.
- **[Claro](https://claro.deriva.xyz)**: Your personal OKR app.
- **[Assertive](https://assertive.deriva.xyz)**: Self-hosted and managed test-suite platform driven by AI.
