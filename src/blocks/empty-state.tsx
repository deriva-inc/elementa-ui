'use client';

import { useEffect, useState } from 'react';
import { ENERGY_THEMES } from '../../lib/constants';
import useUIStore from '../../lib/store/user-preference-store';
import { UIEnergy } from '../../lib/types/model';
import { cn } from '../../lib/utils';
import { Button } from '../components/button';
import { Text, TextVariant } from '../components/text';

/**
 * This function renders an empty state component.
 *
 * * @version 0.3.0
 * @author Aayush Goyal
 * @modified 2026-09-25
 */
export default function EmptyState({
    heading,
    text,
    className,
    primaryButtonOptions,
    secondaryButtonOptions
}: {
    heading?: string;
    text?: string;
    className?: string;
    primaryButtonOptions?: {
        text: string;
        onClick: () => void;
    };
    secondaryButtonOptions?: {
        text: string;
        onClick: () => void;
    };
}) {
    // SECTION: Constants and Variables
    const energy = useUIStore((state) => state.energy);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [uiEnergy, setUIEnergy] = useState<UIEnergy | null>(null);
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        const currentEnergy = ENERGY_THEMES.find((t) => t.id === energy);
        if (currentEnergy) {
            setUIEnergy(currentEnergy);
        }
    }, [energy]);
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <div
            className={cn(
                'flex h-fit w-full flex-col items-center justify-center gap-4',
                className
            )}
        >
            <div className="m-auto max-h-80 max-w-80">
                <img
                    src={`/illus/empty-state/${uiEnergy?.colors?.primary?.code}.svg`}
                    alt="empty shelves"
                    className="md:h-60 md:w-60 lg:h-80 lg:w-80 xl:h-100 xl:w-100"
                    height={200}
                    width={200}
                />
            </div>
            <div className="mt-8 flex flex-col items-center gap-2 text-center">
                <Text variant={TextVariant.H3}>
                    {heading || 'Woah! That looks like a black hole!'}
                </Text>
                <Text variant={TextVariant.Body}>
                    {text || 'There is no data available at the moment.'}
                </Text>
            </div>
            <div className="mt-4 flex items-center gap-4">
                {secondaryButtonOptions && (
                    <Button
                        onClick={secondaryButtonOptions.onClick}
                        variant="outline"
                    >
                        {secondaryButtonOptions.text || 'Go to Home'}
                    </Button>
                )}
                {primaryButtonOptions && (
                    <Button onClick={primaryButtonOptions.onClick}>
                        {primaryButtonOptions.text || 'Create Something'}
                    </Button>
                )}
            </div>
        </div>
    );
    // !SECTION: UI
}
