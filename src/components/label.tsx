'use client';

import { Label as LabelPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * This function renders a Label component for the elementa-ui.
 *
 * @version 0.4.0
 * @author Aayush Goyal
 * @modified 2026-04-29
 */
function Label({
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                'text-text-primary font-body flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                className
            )}
            {...props}
        />
    );
}

export { Label };
