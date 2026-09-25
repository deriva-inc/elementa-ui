/**
 * This file contains utility functions for handling text.
 */

import { toast } from 'sonner';

function capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * This function copies the given text to the clipboard and shows a toast notification.
 *
 * @param text - The text to be copied to the clipboard.
 * @returns A promise that resolves to true if the text was successfully copied, or false if there was an error.
 */
async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);

        toast('Copied!', {
            description: 'Copied to clipboard',
            duration: 2000
        });

        return true;
    } catch (err) {
        toast.error('Error', {
            description: 'Failed to copy'
        });
        return false;
    }
}

export { capitalizeFirstLetter, copyToClipboard };
