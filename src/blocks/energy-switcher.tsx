'use client';

import { ENERGY_THEMES } from '@/lib/constants';
import {
    getDataFromLocalStorage,
    setDataInLocalStorage
} from '@/lib/local-storage';
import useUserPreferenceStore from '@/lib/store/user-preference-store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/src/components/dropdown-menu';
import { Text, TextVariant } from '@/src/components/text';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * This component renders the Energy Switcher for selecting design system themes.
 * It provides access to all 10 available design energy themes.
 *
 * @version 0.2.0
 * @author Aayush Goyal
 * @created 2026-09-19
 */
export default function EnergySwitcher() {
    // SECTION: States and Constants
    const { energy, actions } = useUserPreferenceStore();
    const [currentEnergy, setCurrentEnergy] = useState(energy);
    const currentThemeName =
        ENERGY_THEMES.find((t) => t.id === currentEnergy)?.label ||
        'Select Theme';
    // !SECTION

    // SECTION: Event Handlers
    const handleEnergyChange = (themeId: string) => {
        // Store in local storage
        setDataInLocalStorage('energy', themeId);
        actions.setEnergy(themeId);
        setCurrentEnergy(themeId);

        // Apply the energy theme to the HTML element
        const htmlElement = document.documentElement;
        htmlElement.setAttribute('data-energy', themeId);
    };
    // !SECTION

    // SECTION: Side Effects
    useEffect(() => {
        // Initialize the theme on mount
        const storedEnergy = getDataFromLocalStorage('energy') as string;
        const initialEnergy = storedEnergy || 'dusk-bloom';
        setCurrentEnergy(initialEnergy);
        actions.setEnergy(initialEnergy);
        setDataInLocalStorage('energy', initialEnergy);
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-energy', initialEnergy);
        }
    }, []);
    // !SECTION

    // SECTION: UI
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                className="border-stroke-active-accent-primary border-2"
            >
                <button className="text-text-primary hover:bg-secondary dark:text-text-primary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors">
                    <div className="hidden flex-col items-start sm:flex">
                        <Text
                            variant={TextVariant.Caption}
                            color="text-text-secondary"
                        >
                            Energy
                        </Text>
                        <Text
                            variant={TextVariant.Subtitle2}
                            className="font-heading font-semibold"
                            color="text-text-accent-primary"
                        >
                            {currentThemeName}
                        </Text>
                    </div>
                    <ChevronDown size={16} className="ml-1" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Design System Themes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                    {ENERGY_THEMES.map((theme) => (
                        <DropdownMenuItem
                            key={theme.id}
                            onClick={() => handleEnergyChange(theme.id)}
                            className={`flex flex-col items-start gap-1 py-2 ${
                                currentEnergy === theme.id
                                    ? 'bg-primary text-primary-foreground'
                                    : ''
                            }`}
                        >
                            <div className="flex w-full items-center justify-between">
                                <Text
                                    variant={TextVariant.H6}
                                    className="text-text-primary font-medium"
                                >
                                    {theme.label}
                                </Text>
                                <div className="flex items-center gap-1">
                                    <div
                                        style={{
                                            backgroundColor:
                                                theme.colors.primary.hexCode
                                        }}
                                        className="h-4 w-4 rounded-sm"
                                    />
                                    <div
                                        style={{
                                            backgroundColor:
                                                theme.colors.secondary.hexCode
                                        }}
                                        className="h-4 w-4 rounded-sm"
                                    />
                                </div>
                            </div>
                            <Text
                                variant={TextVariant.Caption}
                                className="text-text-secondary text-xs"
                            >
                                {theme.description}
                            </Text>
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
    // !SECTION: UI
}
