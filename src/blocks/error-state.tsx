import Lottie from 'react-lottie';
import { cn } from '../../lib/utils';
import sampleAnimData from '../assets/anims/sample-anim.json';
import { Button } from '../components/button';
import { Text, TextVariant } from '../components/text';

export interface ErrorStateProps {
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
 * This function renders an error state component.
 * Supports Lottie animations, as well as PNG and SVG illustrations if animation data is not present.
 *
 * @version 0.3.0
 * @author Aayush Goyal
 * @modified 2026-11-16
 */
export default function ErrorState({
    heading,
    text,
    animData,
    illustration,
    illustrationAlt,
    className,
    primaryButtonOptions,
    secondaryButtonOptions
}: ErrorStateProps) {
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
                        alt={illustrationAlt || heading || 'Error illustration'}
                        className="max-h-80 max-w-80 object-contain md:h-60 md:w-60 lg:h-80 lg:w-80"
                    />
                ) : (
                    illustration
                )}
            </div>
            <div className="mt-8 flex flex-col items-center gap-2 text-center">
                <Text variant={TextVariant.H3}>
                    {heading || 'Oops that is not good!'}
                </Text>
                <Text variant={TextVariant.Body}>
                    {text || 'An error occurred while loading your data.'}
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
                        {primaryButtonOptions.text || 'Retry'}
                    </Button>
                )}
            </div>
        </div>
    );
    // !SECTION: UI
}

export { ErrorState };
