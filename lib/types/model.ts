/**
 * This file contains all the type definitions for the model/entities used in the application.
 */

import { ENERGY } from './enums';

interface AppPlatform {
    id: string;
    name: string;
    description: string;
    icon: string;
}

interface ColorMapping {
    [key: string]: {
        code: string;
        id: string;
        description: string;
        name: string;
        hexCode: string;
    };
}

interface UIEnergy {
    code: 'aw' | 'cv' | 'ce' | 'dc' | 'db' | 'eh' | 'mc' | 'ns' | 'tg' | 'zt';
    id: ENERGY;
    label: string;
    colors: {
        primary: ColorMapping[keyof ColorMapping];
        secondary: ColorMapping[keyof ColorMapping];
        accent1: ColorMapping[keyof ColorMapping];
        accent2: ColorMapping[keyof ColorMapping];
    };
    description: string;
}

interface Category {
    name: string;
    id: string;
    imgSrc: string;
    imgAlt: string;
}

interface Icon {
    altText?: string;
    id: string;
    name: string;
    version: string;
    component: React.ComponentType<any>;
    svgPath: string;
    pngPath: string;
}

interface IconCategory {
    category: Category;
    icons: Icon[];
}

export type { AppPlatform, ColorMapping, Icon, IconCategory, UIEnergy };
