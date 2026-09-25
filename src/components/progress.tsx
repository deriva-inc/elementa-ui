'use client';

import { Progress as ProgressPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * This function renders a Progress component for the elementa-ui.
 *
 * @version 0.3.0
 * @author Aayush Goyal
 * @modified 2026-09-25
 */
function Progress({
    className,
    value,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                'bg-bg-active-primary border-stroke-active-primary relative flex h-1 w-full items-center overflow-x-hidden rounded-full border-[0.5px]',
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className="bg-text-primary size-full flex-1 transition-all"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
