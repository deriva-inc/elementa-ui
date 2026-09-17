import { cn } from '@/lib/utils';
import * as React from 'react';

/**
 * This function renders a Table component for the elementa-ui.
 *
 * @version 0.1.0
 * @author Aayush Goyal
 * @modifiedAt 2026-04-20
 */
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'border-stroke-base-primary font-body bg-bg-flat-primary flex field-sizing-content min-h-16 w-full rounded-lg border px-2.5 py-2 text-base transition-colors outline-none md:text-sm',
                'focus-visible:border-stroke-active-accent-primary focus-visible:ring-bg-active-fill-accent-primary focus-visible:ring-3',
                'aria-invalid:ring-bg-hover-destructive aria-invalid:border-stroke-destructive aria-invalid:ring-3',
                'disabled:bg-bg-disabled disabled:text-text-disabled disabled:pointer-events-none disabled:cursor-not-allowed',
                'placeholder:text-text-tertiary',
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
