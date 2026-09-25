/* eslint-disable no-unused-vars */
import { THEME } from '../types/enums';
import { create } from 'zustand';

/**
 * This file defines a Zustand store for managing user preferences.
 */
interface UserPreferenceState {
    theme: 'light' | 'dark' | 'system';
    themeShade: THEME;
    energy: string;
    actions: {
        setTheme: (theme: 'light' | 'dark' | 'system') => void;
        setThemeShade: (themeShade: THEME) => void;
        setEnergy: (energy: string) => void;
    };
}

const useUserPreferenceStore = create<UserPreferenceState>((set) => ({
    theme: 'light',
    themeShade: THEME.AMBER,
    energy: 'dusk-bloom',
    actions: {
        setTheme: (theme) => set({ theme }),
        setThemeShade: (themeShade) => set({ themeShade }),
        setEnergy: (energy) => set({ energy })
    }
}));

export default useUserPreferenceStore;
