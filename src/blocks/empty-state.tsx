'use client';

import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { ENERGY_THEMES } from '../../lib/constants';
import useUIStore from '../../lib/store/user-ui-preferences-store';
import { UIEnergy } from '../../lib/types/model';
import { cn } from '../../lib/utils';
import { Button } from '../components/button';
import { Text, TextVariant } from '../components/text';

export interface EmptyStateProps {
    heading?: string;
    text?: string;
    animData?: any;
    illustration?: string | React.ReactNode;
    illustrationAlt?: string;
    className?: string;
    primaryButtonOptions?: {
        text: string;
        onClick: () => void;
    };
    secondaryButtonOptions?: {
        text: string;
        onClick: () => void;
    };
}

/**
 * This function renders an empty state component.
 * Supports Lottie animations, as well as PNG and SVG illustrations if animation data is not present.
 * Falls back to theme-dependent SVG illustration when neither animation data nor custom illustration is provided.
 *
 * @version 0.5.0
 * @author Aayush Goyal
 * @modified 2026-11-17
 */
export default function EmptyState({
    heading,
    text,
    animData,
    illustration,
    illustrationAlt,
    className,
    primaryButtonOptions,
    secondaryButtonOptions
}: EmptyStateProps) {
    // SECTION: Constants and Variables
    const energy = useUIStore((state) => state.energy);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [uiEnergy, setUIEnergy] = useState<UIEnergy | null>(null);
    // !SECTION: States

    // SECTION: Side Effects
    useEffect(() => {
        const currentEnergy = ENERGY_THEMES.find((t) => t.id === energy);
        if (currentEnergy) {
            setUIEnergy(currentEnergy);
        }
    }, [energy]);
    // !SECTION: Side Effects

    // SECTION: Constants and Variables
    const lottieOptions = animData
        ? {
              loop: true,
              autoplay: true,
              animationData: animData,
              rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice'
              }
          }
        : null;

    const defaultSvgSrc = uiEnergy?.colors?.primary?.code
        ? `/illus/empty-state/${uiEnergy.colors.primary.code}.svg`
        : '/illus/empty-state/gun-metal-900.svg';
    // !SECTION: Constants and Variables

    // SECTION: UI
    return (
        <div
            className={cn(
                'flex h-fit w-full flex-col items-center justify-center gap-4',
                className
            )}
        >
            <div className="m-auto flex max-h-80 max-w-80 items-center justify-center">
                {lottieOptions ? (
                    <Lottie options={lottieOptions} />
                ) : illustration ? (
                    typeof illustration === 'string' ? (
                        <img
                            src={illustration}
                            alt={
                                illustrationAlt ||
                                heading ||
                                'Empty state illustration'
                            }
                            className="max-h-80 max-w-80 object-contain md:h-60 md:w-60 lg:h-80 lg:w-80"
                        />
                    ) : (
                        illustration
                    )
                ) : (
                    <img
                        src={defaultSvgSrc}
                        alt={illustrationAlt || 'empty shelves'}
                        className="object-contain md:h-60 md:w-60 lg:h-80 lg:w-80 xl:h-100 xl:w-100"
                        height={200}
                        width={200}
                    />
                )}
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

export { EmptyState };
