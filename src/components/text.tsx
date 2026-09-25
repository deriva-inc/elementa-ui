import { cn } from '../../lib/utils';

export enum TextVariant {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Body,
    Button,
    Subtitle1,
    Subtitle2,
    Caption,
    Custom
}

export interface TextProps {
    variant?: TextVariant;
    color?: string;
    children: React.ReactNode;
    className?: string;
}

/**
 * This function renders the Text component for the library.
 *
 * @version 0.9.0
 * @author Aayush Goyal
 * @modified 2026-09-25
 */
export function Text({
    variant = TextVariant.Body,
    color = 'text-text-primary',
    children,
    className
}: TextProps) {
    // SECTION: Constants and Variables
    const baseClassNames = 'w-fit';
    // !SECTION: Constants and Variables

    // SECTION: Functions
    /**
     * This function returns the class name for the given variant.
     *
     * @param variant - The variant of the text component.
     * @returns The class name for the given variant.
     */
    const getVariantClass = (variant: TextVariant) => {
        switch (variant) {
            case TextVariant.H1:
                return '';
            case TextVariant.H2:
                return '';
            case TextVariant.H3:
                return '';
            case TextVariant.H4:
                return '';
            case TextVariant.H5:
                return '';
            case TextVariant.H6:
                return '';
            case TextVariant.Body:
                return 'font-body';
            case TextVariant.Subtitle1:
                return 'text-sm font-bold font-body';
            case TextVariant.Subtitle2:
                return 'text-xs font-medium font-body';
            case TextVariant.Button:
                return 'text-sm font-medium font-body';
            case TextVariant.Caption:
                return 'text-xs font-body';
            default:
                return 'text-sm font-body';
        }
    };
    // !SECTION Functions

    const internalClassName = cn(
        baseClassNames,
        getVariantClass(variant),
        color,
        className
    );

    // SECTION: UI
    switch (variant) {
        case TextVariant.H1:
            return <h1 className={internalClassName}>{children}</h1>;
        case TextVariant.H2:
            return <h2 className={internalClassName}>{children}</h2>;
        case TextVariant.H3:
            return <h3 className={internalClassName}>{children}</h3>;
        case TextVariant.H4:
            return <h4 className={internalClassName}>{children}</h4>;
        case TextVariant.H5:
            return <h5 className={internalClassName}>{children}</h5>;
        case TextVariant.H6:
            return <h6 className={internalClassName}>{children}</h6>;
        case TextVariant.Button:
            return <p className={internalClassName}>{children}</p>;
        case TextVariant.Caption:
            return <p className={internalClassName}>{children}</p>;
        case TextVariant.Subtitle1:
            return <p className={internalClassName}>{children}</p>;
        case TextVariant.Subtitle2:
            return <p className={internalClassName}>{children}</p>;
        default:
            return <p className={internalClassName}>{children}</p>;
    }
    // !SECTION: UI
}
