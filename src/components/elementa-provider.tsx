'use client';

import React, { createContext, useContext, useEffect } from 'react';
import {
    getDataFromLocalStorage,
    setDataInLocalStorage
} from '../../lib/local-storage';
import useUserPreferenceStore from '../../lib/store/user-preference-store';
import { THEME } from '../../lib/types/enums';

export interface ElementaProviderProps {
    children: React.ReactNode;
    defaultTheme?: 'light' | 'dark' | 'system';
    defaultEnergy?: string;
}

interface ElementaContextType {
    theme: 'light' | 'dark' | 'system';
    energy: string;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setEnergy: (energy: string) => void;
}

const ElementaContext = createContext<ElementaContextType | undefined>(
    undefined
);

/**
 * ElementaProvider automatically applies Elementa themes and energy attributes
 * to the document root, ensuring themes and energies work out of the box in Next.js apps.
 *
 * @version 0.2.0
 * @author Aayush Goyal
 */
export function ElementaProvider({
    children,
    defaultTheme = 'system',
    defaultEnergy = 'dusk-bloom'
}: ElementaProviderProps) {
    const { theme, energy, actions } = useUserPreferenceStore();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 1. Initialize Energy
        const storedEnergy =
            (getDataFromLocalStorage('energy') as string) || defaultEnergy;
        actions.setEnergy(storedEnergy);
        document.documentElement.setAttribute('data-energy', storedEnergy);
        setDataInLocalStorage('energy', storedEnergy);

        // 2. Initialize Theme
        const storedTheme =
            (getDataFromLocalStorage('theme') as 'light' | 'dark' | 'system') ||
            defaultTheme;
        actions.setTheme(storedTheme);

        const applyTheme = (themeValue: 'light' | 'dark' | 'system') => {
            const htmlElement = document.documentElement;
            if (themeValue === 'system') {
                const isSystemDark = window.matchMedia(
                    '(prefers-color-scheme: dark)'
                ).matches;
                htmlElement.classList.toggle('dark', isSystemDark);
                actions.setThemeShade(
                    isSystemDark ? THEME.GUN_METAL : THEME.AMBER
                );
            } else {
                htmlElement.classList.toggle('dark', themeValue === 'dark');
                actions.setThemeShade(
                    themeValue === 'light' ? THEME.AMBER : THEME.GUN_METAL
                );
            }
        };

        applyTheme(storedTheme);

        // 3. Listen for system theme changes if set to system
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = () => {
            const currentTheme =
                (getDataFromLocalStorage('theme') as
                    | 'light'
                    | 'dark'
                    | 'system') || storedTheme;
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleSystemChange);
        return () =>
            mediaQuery.removeEventListener('change', handleSystemChange);
    }, [defaultEnergy, defaultTheme, actions]);

    const contextValue: ElementaContextType = {
        theme,
        energy,
        setTheme: (newTheme) => {
            actions.setTheme(newTheme);
            setDataInLocalStorage('theme', newTheme);
            const htmlElement = document.documentElement;
            if (newTheme === 'system') {
                const isDark = window.matchMedia(
                    '(prefers-color-scheme: dark)'
                ).matches;
                htmlElement.classList.toggle('dark', isDark);
            } else {
                htmlElement.classList.toggle('dark', newTheme === 'dark');
            }
        },
        setEnergy: (newEnergy) => {
            actions.setEnergy(newEnergy);
            setDataInLocalStorage('energy', newEnergy);
            document.documentElement.setAttribute('data-energy', newEnergy);
        }
    };

    return (
        <ElementaContext.Provider value={contextValue}>
            {children}
        </ElementaContext.Provider>
    );
}

export function useElementa() {
    const context = useContext(ElementaContext);
    if (!context) {
        // Fallback to store if used outside provider
        const { theme, energy, actions } = useUserPreferenceStore();
        return {
            theme,
            energy,
            setTheme: actions.setTheme,
            setEnergy: actions.setEnergy
        };
    }
    return context;
}

export default ElementaProvider;
