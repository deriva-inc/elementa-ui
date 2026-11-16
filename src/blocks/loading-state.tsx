'use client';

import Lottie from 'react-lottie';
import { cn } from '../../lib/utils';
import sampleAnimData from '../assets/anims/sample-anim.json';
import { Text, TextVariant } from '../components/text';

export interface LoadingStateProps {
    text?: string;
    animData?: any;
    illustration?: string | React.ReactNode;
    illustrationAlt?: string;
    className?: string;
}

/**
 * This function renders a loading state component.
 * Supports Lottie animations, as well as PNG and SVG illustrations if animation data is not present.
 *
 * @version 0.5.0
 * @author Aayush Goyal
 * @created 2026-09-25
 * @modified 2026-11-17
 */
export default function LoadingState({
    text,
    animData,
    illustration,
    illustrationAlt,
    className
}: LoadingStateProps) {
    // SECTION: Constants and Variables
    const resolvedAnimData =
        animData ?? (!illustration ? sampleAnimData : null);

    const sampleAnimLottieOptions = resolvedAnimData
        ? {
              loop: true,
              autoplay: true,
              animationData: resolvedAnimData,
              rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice'
              }
          }
        : null;
    // !SECTION: Constants and Variables

    // SECTION: States
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <div
            className={cn(
                'flex h-fit w-full flex-col items-center justify-center gap-4',
                className
            )}
        >
            <div className="m-auto flex max-h-80 max-w-80 items-center justify-center">
                {sampleAnimLottieOptions ? (
                    <Lottie options={sampleAnimLottieOptions} />
                ) : typeof illustration === 'string' ? (
                    <img
                        src={illustration}
                        alt={illustrationAlt || text || 'Loading illustration'}
                        className="max-h-80 max-w-80 object-contain md:h-60 md:w-60 lg:h-80 lg:w-80"
                    />
                ) : (
                    illustration
                )}
            </div>
            <Text variant={TextVariant.H3}>
                {text || 'Loading your data...'}
            </Text>
        </div>
    );
    // !SECTION: UI
}

export { LoadingState };
