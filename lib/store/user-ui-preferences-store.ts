/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { THEME_ENUM, ThemeType } from '../types';

/**
 * This file defines a Zustand store for managing user preferences.
 */
export interface UserUIPreferencesState {
    theme: ThemeType;
    themeShade: THEME_ENUM;
    energy: string;
    actions: {
        setTheme: (theme: ThemeType) => void;
        setThemeShade: (themeShade: THEME_ENUM) => void;
        setEnergy: (energy: string) => void;
    };
}

export const useUserUIPreferencesStore = create<UserUIPreferencesState>(
    (set) => ({
        theme: 'light',
        themeShade: THEME_ENUM.AMBER,
        energy: 'dusk-bloom',
        actions: {
            setTheme: (theme: ThemeType) => set({ theme }),
            setThemeShade: (themeShade: THEME_ENUM) => set({ themeShade }),
            setEnergy: (energy: string) => set({ energy })
        }
    })
);

export default useUserUIPreferencesStore;
