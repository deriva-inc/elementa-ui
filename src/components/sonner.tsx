'use client';

import useUIStore from '@/lib/store/user-preference-store';
import { Info, TickCloud } from 'elementa-icons';
import { Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * This function renders a custom Sonner toast component for the elementa-ui.
 *
 * @version 0.3.0
 * @author Aayush Goyal
 * @modifiedAt 2026-08-25
 */
const Toaster = ({ ...props }: ToasterProps) => {
    const theme = useUIStore((state) => state.theme);

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            icons={{
                success: <TickCloud className="size-4" />,
                info: <Info className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />
            }}
            style={
                {
                    '--normal-bg': 'var(--bg-modal-primary)',
                    '--normal-text': 'var(--text-primary)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)'
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: 'cn-toast font-body',
                    error: 'bg-bg-fill-destructive! text-text-destructive! font-body',
                    info: 'bg-bg-fill-info! text-text-info! font-body',
                    success: 'bg-bg-fill-success! text-text-success! font-body',
                    warning: 'bg-bg-fill-warning! text-text-warning! font-body'
                }
            }}
            {...props}
        />
    );
};

export { Toaster };
