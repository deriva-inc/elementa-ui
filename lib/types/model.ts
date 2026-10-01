/**
 * This file contains all the type definitions for the model/entities used in the application.
 */

import {
    ENERGY_ENUM,
    HTTP_STATUS_CODE_ENUM,
    NETWORK_CALL_STATUS_ENUM
} from './enums';

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

export type ThemeType = 'light' | 'dark' | 'system';

interface UIEnergy {
    code: 'aw' | 'cv' | 'ce' | 'dc' | 'db' | 'eh' | 'mc' | 'ns' | 'tg' | 'zt';
    id: ENERGY_ENUM;
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

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export type {
    AppPlatform,
    ColorMapping,
    Icon,
    IconCategory,
    LogLevel,
    UIEnergy
};

export interface ClientSideNetworkError {
    code: HTTP_STATUS_CODE_ENUM;
    message: string;
}

export interface ClientSideNetworkResponse {
    data: object;
    code: HTTP_STATUS_CODE_ENUM;
}

// This is used only for state management on UI pages.
export interface ClientSideNetworkDetails {
    status: NETWORK_CALL_STATUS_ENUM;
    data?: object;
    error?: object;
}

// A good practice is to maintain a map of network call details for easier state management.
export interface ClientNetworkCallDetailsMap {
    [key: string]: ClientSideNetworkDetails;
}

export interface ServerSideNetworkError {
    code: HTTP_STATUS_CODE_ENUM;
    message: string;
    type?: string;
    details?: unknown;
}

export interface ServerSideResponse {
    api_version?: number;
    success?: boolean;
    data?: object;
    meta?: object;
    error?: ServerSideNetworkError;
}
