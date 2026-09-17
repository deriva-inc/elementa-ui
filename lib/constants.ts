import { ENERGY } from '@/lib/types/enums';
import { AppPlatform, ColorMapping, UIEnergy } from '@/lib/types/model';

const COLOR_MAP: ColorMapping = {
    ELECTRIC_VIOLET: {
        code: 'ev',
        id: 'electric-violet',
        description:
            'A deep, punchy violet-magenta. It sits right on the edge of purple and pink, giving it a futuristic, premium feel.',
        name: 'Electric Violet',
        hexCode: '#9B6DF2'
    },
    DUSTY_ROSE: {
        code: 'dr',
        id: 'dusty-rose',
        description:
            'Vivid and playful. It leans slightly cooler than a pure red, making it an excellent highlight color.',
        name: 'Dusty Rose',
        hexCode: '#C26D8F'
    },
    MATCHA_SAGE: {
        code: 'ms',
        id: 'matcha-sage',
        description:
            'A digital, fresh mint-green. It avoids the "toxic" look of pure lime and feels sophisticated and readable.',
        name: 'Matcha Sage',
        hexCode: '#70A073'
    },
    TERRACOTTA_RUST: {
        code: 'tr',
        id: 'terracotta-rust',
        description:
            'Earthy, bold, and grounding. It provides a warm, tactile contrast to the digital coolness of the other colors.',
        name: 'Terracotta Rust',
        hexCode: '#C1582F'
    },
    GOLDEN_HOUR: {
        code: 'gh',
        id: 'golden-hour',
        description:
            'A warm, sunny yellow that maintains strong readability and avoids muddying when mixed with darker tones.',
        name: 'Golden Hour',
        hexCode: '#DD9C00'
    }
};

const ENERGY_THEMES: UIEnergy[] = [
    {
        code: 'aw',
        id: ENERGY.ACOUSTIC_WOOD,
        label: 'Acoustic Wood',
        colors: {
            primary: COLOR_MAP.TERRACOTTA_RUST,
            secondary: COLOR_MAP.DUSTY_ROSE,
            accent1: COLOR_MAP.MATCHA_SAGE,
            accent2: COLOR_MAP.ELECTRIC_VIOLET
        },
        description:
            'Analog. Warm and resonant. Mimics physical textures, making it highly suited for personal blogs or interfaces requiring an organic, handmade feel.'
    },
    {
        code: 'cv',
        id: ENERGY.CIPHER_VAULT,
        label: 'Cipher Vault',
        colors: {
            primary: COLOR_MAP.ELECTRIC_VIOLET,
            secondary: COLOR_MAP.MATCHA_SAGE,
            accent1: COLOR_MAP.DUSTY_ROSE,
            accent2: COLOR_MAP.TERRACOTTA_RUST
        },
        description:
            'Secure. The deep violet provides structural safety, while the sage gives a trusted "success" glow for password managers.'
    },
    {
        code: 'ce',
        id: ENERGY.CREMA_EXTRACTION,
        label: 'Crema Extraction',
        colors: {
            primary: COLOR_MAP.TERRACOTTA_RUST,
            secondary: COLOR_MAP.GOLDEN_HOUR,
            accent1: COLOR_MAP.DUSTY_ROSE,
            accent2: COLOR_MAP.ELECTRIC_VIOLET
        },
        description:
            'Inviting. Warm and tactile. Perfectly suited for lifestyle interfaces, food exploration, or human-centric aesthetics.'
    },
    {
        code: 'dc',
        id: ENERGY.DAWN_CHORUS,
        label: 'Dawn Chorus',
        colors: {
            primary: COLOR_MAP.GOLDEN_HOUR,
            secondary: COLOR_MAP.DUSTY_ROSE,
            accent1: COLOR_MAP.ELECTRIC_VIOLET,
            accent2: COLOR_MAP.TERRACOTTA_RUST
        },
        description:
            'Optimistic. Soft and welcoming. Ideal for morning wellness check-ins or onboarding screens, offering a gentle start without harsh contrasts.'
    },
    {
        code: 'db',
        id: ENERGY.DUSK_BLOOM,
        label: 'Dusk Bloom',
        colors: {
            primary: COLOR_MAP.DUSTY_ROSE,
            secondary: COLOR_MAP.ELECTRIC_VIOLET,
            accent1: COLOR_MAP.GOLDEN_HOUR,
            accent2: COLOR_MAP.MATCHA_SAGE
        },
        description:
            'Premium. Editorial and elegant. The soft rose is approachable, while the violet accent provides sharp, high-end contrast.'
    },
    {
        code: 'eh',
        id: ENERGY.EVENT_HORIZON,
        label: 'Event Horizon',
        colors: {
            primary: COLOR_MAP.ELECTRIC_VIOLET,
            secondary: COLOR_MAP.TERRACOTTA_RUST,
            accent1: COLOR_MAP.MATCHA_SAGE,
            accent2: COLOR_MAP.GOLDEN_HOUR
        },
        description:
            'Profound. Deep and grounding. Ideal for complex astrophysics visualizations or immersive, distraction-free knowledge consumption.'
    },
    {
        code: 'mc',
        id: ENERGY.MAKERS_CANVAS,
        label: "Maker's Canvas",
        colors: {
            primary: COLOR_MAP.TERRACOTTA_RUST,
            secondary: COLOR_MAP.MATCHA_SAGE,
            accent1: COLOR_MAP.ELECTRIC_VIOLET,
            accent2: COLOR_MAP.GOLDEN_HOUR
        },
        description:
            'Utilitarian. Tactile and focused. Best for software managing 3D printing pipelines, manual assembly tools, or building things from scratch.'
    },
    {
        code: 'ns',
        id: ENERGY.NEON_SYMPHONY,
        label: 'Neon Symphony',
        colors: {
            primary: COLOR_MAP.ELECTRIC_VIOLET,
            secondary: COLOR_MAP.GOLDEN_HOUR,
            accent1: COLOR_MAP.DUSTY_ROSE,
            accent2: COLOR_MAP.MATCHA_SAGE
        },
        description:
            'Rhythmic. High-contrast and dynamic. Built for audio streaming interfaces or apps tracking multi-instrumental progress.'
    },
    {
        code: 'tg',
        id: ENERGY.TROPICAL_GRID,
        label: 'Tropical Grid',
        colors: {
            primary: COLOR_MAP.MATCHA_SAGE,
            secondary: COLOR_MAP.GOLDEN_HOUR,
            accent1: COLOR_MAP.TERRACOTTA_RUST,
            accent2: COLOR_MAP.DUSTY_ROSE
        },
        description:
            'Structured. Lush yet mathematically organized. Excellent for charting long-term passive income portfolios or plotting coastal travel itineraries.'
    },
    {
        code: 'zt',
        id: ENERGY.ZEN_TOOLKIT,
        label: 'Zen Toolkit',
        colors: {
            primary: COLOR_MAP.MATCHA_SAGE,
            secondary: COLOR_MAP.DUSTY_ROSE,
            accent1: COLOR_MAP.GOLDEN_HOUR,
            accent2: COLOR_MAP.TERRACOTTA_RUST
        },
        description:
            'Calm. Earthy and highly readable. Excellent for deep-focus dashboards or configuration panels where eye strain must be minimized.'
    }
];

const APP_PLATFORMS: AppPlatform[] = [
    {
        id: 'react',
        name: 'React',
        description: 'A JavaScript library for building user interfaces.',
        icon: ''
    },
    {
        id: 'flutter',
        name: 'Flutter',
        description:
            'An open-source UI software development toolkit by Google.',
        icon: ''
    }
];

export { APP_PLATFORMS, ENERGY_THEMES };
