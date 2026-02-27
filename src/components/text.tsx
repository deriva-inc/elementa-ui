'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/src/lib/utils';
import { TextProps, TextVariant } from '@/src/lib/types';

/**
 * This function renders the Text component for the library.
 */
function Text({
    variant = TextVariant.Body,
    color,
    children,
    customClassName
}: TextProps) {
    // SECTION: Constants and Variables
    const [className, setClassName] = useState('');
    // !SECTION: Constants and Variables

    // SECTION: States
    // !SECTION: States

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
                return 'text-[61px] font-heading';
            case TextVariant.H2:
                return 'text-[48px] font-heading';
            case TextVariant.H3:
                return 'text-[39px] font-heading';
            case TextVariant.H4:
                return 'text-[31px] font-bold font-heading';
            case TextVariant.H5:
                return 'text-[25px] font-bold font-heading';
            case TextVariant.H6:
                return 'text-[20px] font-bold font-heading';
            case TextVariant.Body:
                return 'text-[16px] font-body';
            case TextVariant.Button:
                return 'text-[16px] font-bold font-body';
            default:
                return 'text-[16px] font-body';
        }
    };
    // !SECTION Functions

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        setClassName(cn(getVariantClass(variant), color, customClassName));
    }, [variant, color, customClassName]);
    // !SECTION: Side Effects

    // SECTION: UI
    return <p className={className}>{children}</p>;
    // !SECTION: UI
}

export { Text };
