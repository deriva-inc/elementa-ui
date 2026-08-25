'use client';

import useUserPreferenceStore from '@/lib/store/user-preference-store';
import { copyToClipboard } from '@/lib/text';
import { CODE_LANGUAGES } from '@/lib/types/enums';
import { Badge } from '@/src/components/badge';
import { Button } from '@/src/components/button';
import { Text } from '@/src/components/text';
import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
    atomOneDark,
    atomOneLight
} from 'react-syntax-highlighter/dist/esm/styles/hljs';

/**
 * This component renders a code block with syntax highlighting and copy functionality.
 *
 * @version 0.1.0
 * @author Aayush Goyal
 * @created 2026-08-25
 */

interface CodeBlockProps {
    code: string;
    language?: CODE_LANGUAGES;
    title?: string;
    showLineNumbers?: boolean;
}

export default function CodeBlock({
    code,
    language = CODE_LANGUAGES.TYPESCRIPT,
    title,
    showLineNumbers = true
}: CodeBlockProps) {
    // SECTION: Constants and Variables
    const theme = useUserPreferenceStore((state) => state.theme);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [isCopied, setIsCopied] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    // !SECTION: States

    // SECTION: Side Effects
    useEffect(() => {
        const checkIsDark = () => {
            if (theme === 'system') {
                return window.matchMedia('(prefers-color-scheme: dark)')
                    .matches;
            }
            return theme === 'dark';
        };

        setIsDarkTheme(checkIsDark());

        if (theme === 'system') {
            const mediaQuery = window.matchMedia(
                '(prefers-color-scheme: dark)'
            );
            const listener = (e: MediaQueryListEvent) => {
                setIsDarkTheme(e.matches);
            };
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        }
    }, [theme]);
    // !SECTION: Side Effects

    // SECTION: Event Handlers
    /**
     * This function handles the copy code button click event.
     */
    const handleCopyCode = async () => {
        const isCodeCopied = await copyToClipboard(code);
        if (isCodeCopied) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };
    // !SECTION: Event Handlers

    // SECTION: UI
    return (
        <div className="border-stroke-raised-secondary bg-bg-raised-secondary relative overflow-hidden rounded-lg border">
            {/* Header with title and copy button */}
            {(title || true) && (
                <div className="bg-bg-raised-secondary border-stroke-raised-secondary flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Badge variant="info" className="font-mono">
                            {language.toLocaleUpperCase()}
                        </Badge>
                        <Text className="text-text-primary font-mono font-semibold">
                            {title || 'Code Block'}
                        </Text>
                    </div>
                    <Button
                        size="xs"
                        variant="default"
                        onClick={handleCopyCode}
                        className=""
                        title="Copy code"
                    >
                        {isCopied ? (
                            <>
                                <Check
                                    size={16}
                                    className="text-text-success"
                                />
                                <Text className="text-xs">Copied</Text>
                            </>
                        ) : (
                            <>
                                <Copy className="text-text-primary" size={16} />
                                <Text className="text-xs">Copy</Text>
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Code block */}
            <div className="overflow-x-auto font-mono">
                <SyntaxHighlighter
                    language={language}
                    style={isDarkTheme ? atomOneDark : atomOneLight}
                    showLineNumbers={showLineNumbers}
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        fontFamily: 'JetBrains Mono'
                    }}
                    codeTagProps={{
                        style: {
                            fontFamily: 'JetBrains Mono',
                            fontSize: '0.875rem',
                            lineHeight: '1.5'
                        }
                    }}
                    lineNumberStyle={{
                        color: '#666',
                        paddingRight: '1rem',
                        userSelect: 'none'
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
    // !SECTION: UI
}
