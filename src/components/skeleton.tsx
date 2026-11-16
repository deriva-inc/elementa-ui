import { cn } from '../../lib/utils';

/**
 * This function renders a Skeleton component for the elementa-ui.
 *
 * @version 0.4.0
 * @author Aayush Goyal
 * @modified 2026-11-17
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="skeleton"
            className={cn(
                'bg-bg-modal-primary animate-pulse rounded-md',
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
