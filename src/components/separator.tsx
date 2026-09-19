'use client';

import { cn } from '@/lib/utils';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import * as React from 'react';

/**
 * This function renders a Separator component for the elementa-ui.
 *
 * @version 0.2.0
 * @author Aayush Goyal
 * @modifiedAt 2026-04-15
 */
function Separator({
    className,
    orientation = 'horizontal',
    decorative = true,
    ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
    return (
        <SeparatorPrimitive.Root
            data-slot="separator"
            decorative={decorative}
            orientation={orientation}
            className={cn(
                'bg-stroke-base-primary shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
                className
            )}
            {...props}
        />
    );
}

export { Separator };
