import { z } from 'zod';
import { create } from 'zustand';

// SECTION: Types
// SECTION: Native TypeScript Enums (Values & Types)
enum SIDEBAR_STATE_ENUM {
    EXPANDED = 'EXPANDED',
    FLOATING = 'FLOATING',
    COLLAPSED = 'COLLAPSED'
}

enum THEME_ENUM {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
    SYSTEM = 'SYSTEM'
}
// !SECTION: Native TypeScript Enums

// SECTION: Zod Schema
const SIDEBAR_STATE_ENUM_SCHEMA = z.enum(SIDEBAR_STATE_ENUM);
const THEME_ENUM_SCHEMA = z.enum(THEME_ENUM);
const UserUIPreferencesStoreStateSchema = z.object({
    isLoggedIn: z.boolean(),
    theme: THEME_ENUM_SCHEMA,
    sidebarType: SIDEBAR_STATE_ENUM_SCHEMA
});
// !SECTION: Zod Schema

// SECTION: TypeScript Types & Value Constants
type UserUIPreferencesStoreState = z.infer<
    typeof UserUIPreferencesStoreStateSchema
>;
interface UserUIPreferencesStoreActions {
    actions: {
        setIsLoggedIn: (isLoggedIn: boolean) => void;
        setTheme: (theme: THEME_ENUM) => void;
        setSidebarType: (type: SIDEBAR_STATE_ENUM) => void;
        clearUserUIPreferencesStore: () => void;
    };
}
// !SECTION: TypeScript Types & Value Constants
// !SECTION: Types

/**
 * This file contains a Zustand store for managing user's UI Preferences.
 *
 * @version 0.1.0
 * @author Aayush Goyal
 * @modified 2026-09-30
 */
const useUserUIPreferencesStore = create<
    UserUIPreferencesStoreState & UserUIPreferencesStoreActions
>((set) => ({
    isLoggedIn: false,
    theme:
        (typeof window !== 'undefined'
            ? (window.localStorage.getItem('theme') as THEME_ENUM)
            : null) || THEME_ENUM.LIGHT,
    sidebarType: SIDEBAR_STATE_ENUM.EXPANDED,
    actions: {
        setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
        setTheme: (theme: THEME_ENUM) => {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('theme', theme);
            }
            set({ theme });
        },
        setSidebarType: (type: SIDEBAR_STATE_ENUM) =>
            set({ sidebarType: type }),
        clearUserUIPreferencesStore: () =>
            set({
                isLoggedIn: false,
                theme: THEME_ENUM.LIGHT,
                sidebarType: SIDEBAR_STATE_ENUM.EXPANDED
            })
    }
}));

export {
    SIDEBAR_STATE_ENUM,
    SIDEBAR_STATE_ENUM_SCHEMA,
    THEME_ENUM,
    THEME_ENUM_SCHEMA,
    UserUIPreferencesStoreStateSchema,
    useUserUIPreferencesStore
};
