import { Loader2Icon } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * This function renders a Spinner component for the elementa-ui.
 *
 * @version 0.2.0
 * @author Aayush Goyal
 * @modified 2026-09-25
 */
function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
        <Loader2Icon
            role="status"
            aria-label="Loading"
            className={cn('size-4 animate-spin', className)}
            {...props}
        />
    );
}

export { Spinner };
