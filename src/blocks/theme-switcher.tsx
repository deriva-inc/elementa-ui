'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
    getDataFromLocalStorage,
    setDataInLocalStorage
} from '../../lib/local-storage';
import useUserPreferenceStore from '../../lib/store/user-preference-store';
import { THEME } from '../../lib/types/enums';
import { ToggleGroup, ToggleGroupItem } from '../components/toggle-group';

export type TransitionVariant =
    | 'circle'
    | 'square'
    | 'triangle'
    | 'diamond'
    | 'hexagon'
    | 'rectangle'
    | 'star';

/**
 * Applies or removes the 'dark' class on the root HTML element.
 */
const applyThemeToDocument = (themeValue: string) => {
    const htmlElement = document.documentElement;
    if (themeValue === 'system') {
        const isSystemDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;
        htmlElement.classList.toggle('dark', isSystemDark);
    } else {
        htmlElement.classList.toggle('dark', themeValue === 'dark');
    }
};

/**
 * This function renders the Theme Switcher component of the app.
 *
 * @version 0.2.0
 * @author Aayush Goyal
 * @modifed 2026-09-25
 */
export default function ThemeSwitcher({
    duration = 500,
    fromCenter = false,
    variant = 'circle',
    onThemeChange
}: {
    duration?: number;
    fromCenter?: boolean;
    variant?: TransitionVariant;
    onThemeChange?: (theme: THEME) => void;
}) {
    // SECTION: Constants and Variables
    const buttonRef = useRef<HTMLDivElement>(null);
    const isTransitioningRef = useRef(false);
    const shape = variant ?? 'circle';
    const { theme, actions } = useUserPreferenceStore();
    const isControlled = theme !== undefined;
    // !SECTION: Constants and Variables

    // SECTION: States
    const [internalIsDark, setInternalIsDark] = useState(false);
    const isDark = isControlled ? theme === THEME.GUN_METAL : internalIsDark;
    // !SECTION: States

    // SECTION: Functions
    function polygonCollapsed(point: string, vertexCount: number): string {
        const pairs = Array.from({ length: vertexCount }, () => point).join(
            ', '
        );
        return `polygon(${pairs})`;
    }

    function getThemeTransitionClipPaths(
        variant: TransitionVariant,
        cx: number,
        cy: number,
        maxRadius: number,
        viewportWidth: number,
        viewportHeight: number
    ): [string, string] {
        const toX = (x: number) => `${(x / viewportWidth) * 100}%`;
        const toY = (y: number) => `${(y / viewportHeight) * 100}%`;
        const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
        const toRadius = (r: number) =>
            `${(r / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`;

        switch (variant) {
            case 'circle':
                return [
                    `circle(0% at ${point(cx, cy)})`,
                    `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`
                ];
            case 'square': {
                const halfW = Math.max(cx, viewportWidth - cx);
                const halfH = Math.max(cy, viewportHeight - cy);
                const halfSide = Math.max(halfW, halfH) * 1.05;
                const end = [
                    point(cx - halfSide, cy - halfSide),
                    point(cx + halfSide, cy - halfSide),
                    point(cx + halfSide, cy + halfSide),
                    point(cx - halfSide, cy + halfSide)
                ].join(', ');
                return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
            }
            case 'triangle': {
                const scale = maxRadius * 2.2;
                const dx = (Math.sqrt(3) / 2) * scale;
                const verts = [
                    point(cx, cy - scale),
                    point(cx + dx, cy + 0.5 * scale),
                    point(cx - dx, cy + 0.5 * scale)
                ].join(', ');
                return [
                    polygonCollapsed(point(cx, cy), 3),
                    `polygon(${verts})`
                ];
            }
            case 'diamond': {
                const R = maxRadius * Math.SQRT2;
                const end = [
                    point(cx, cy - R),
                    point(cx + R, cy),
                    point(cx, cy + R),
                    point(cx - R, cy)
                ].join(', ');
                return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
            }
            case 'hexagon': {
                const R = maxRadius * Math.SQRT2;
                const verts: string[] = [];
                for (let i = 0; i < 6; i++) {
                    const a = -Math.PI / 2 + (i * Math.PI) / 3;
                    verts.push(
                        point(cx + R * Math.cos(a), cy + R * Math.sin(a))
                    );
                }
                return [
                    polygonCollapsed(point(cx, cy), 6),
                    `polygon(${verts.join(', ')})`
                ];
            }
            case 'rectangle': {
                const halfW = Math.max(cx, viewportWidth - cx);
                const halfH = Math.max(cy, viewportHeight - cy);
                const end = [
                    point(cx - halfW, cy - halfH),
                    point(cx + halfW, cy - halfH),
                    point(cx + halfW, cy + halfH),
                    point(cx - halfW, cy + halfH)
                ].join(', ');
                return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
            }
            case 'star': {
                const R = maxRadius * Math.SQRT2 * 1.03;
                const innerRatio = 0.42;
                const starPolygon = (radius: number) => {
                    const verts: string[] = [];
                    for (let i = 0; i < 5; i++) {
                        const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                        verts.push(
                            point(
                                cx + radius * Math.cos(outerA),
                                cy + radius * Math.sin(outerA)
                            )
                        );
                        const innerA = outerA + Math.PI / 5;
                        verts.push(
                            point(
                                cx + radius * innerRatio * Math.cos(innerA),
                                cy + radius * innerRatio * Math.sin(innerA)
                            )
                        );
                    }
                    return `polygon(${verts.join(', ')})`;
                };
                const startR = Math.max(2, R * 0.025);
                return [starPolygon(startR), starPolygon(R)];
            }
            default:
                return [
                    `circle(0% at ${point(cx, cy)})`,
                    `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`
                ];
        }
    }

    const handleViewTransition = useCallback(
        (value: 'light' | 'dark' | 'system') => {
            const button = buttonRef.current;
            if (
                !button ||
                isTransitioningRef.current ||
                document.documentElement.dataset.themeSwitcherVt === 'active'
            )
                return;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let x: number;
            let y: number;
            if (fromCenter) {
                x = viewportWidth / 2;
                y = viewportHeight / 2;
            } else {
                const { top, left, width, height } =
                    button.getBoundingClientRect();
                x = left + width / 2;
                y = top + height / 2;
            }

            const maxRadius = Math.hypot(
                Math.max(x, viewportWidth - x),
                Math.max(y, viewportHeight - y)
            );

            const applyTheme = () => {
                applyThemeToDocument(value);
            };

            if (typeof document.startViewTransition !== 'function') {
                applyTheme();
                return;
            }

            const clipPath = getThemeTransitionClipPaths(
                shape,
                x,
                y,
                maxRadius,
                viewportWidth,
                viewportHeight
            );

            const root = document.documentElement;
            root.dataset.themeSwitcherVt = 'active';
            root.style.setProperty(
                '--theme-switcher-vt-duration',
                `${duration}ms`
            );
            root.style.setProperty(
                '--theme-switcher-vt-clip-from',
                clipPath[0]
            );
            root.style.setProperty('--theme-switcher-vt-clip-to', clipPath[1]);

            const cleanup = () => {
                isTransitioningRef.current = false;
                delete root.dataset.themeSwitcherVt;
                root.style.removeProperty('--theme-switcher-vt-duration');
                root.style.removeProperty('--theme-switcher-vt-clip-from');
                root.style.removeProperty('--theme-switcher-vt-clip-to');
            };

            isTransitioningRef.current = true;
            const transition = document.startViewTransition(() => {
                flushSync(applyTheme);
            });

            if (typeof transition?.finished?.finally === 'function') {
                transition.finished.finally(cleanup).catch(() => {});
            } else {
                cleanup();
            }

            const ready = transition?.ready;
            if (ready && typeof ready.then === 'function') {
                ready
                    .then(() => {
                        document.documentElement.animate(
                            {
                                clipPath: [clipPath[0], clipPath[1]]
                            },
                            {
                                duration,
                                easing:
                                    shape === 'star' ? 'linear' : 'ease-in-out',
                                fill: 'forwards',
                                pseudoElement: '::view-transition-new(root)'
                            }
                        );
                    })
                    .catch(() => {});
            }
        },
        [shape, fromCenter, duration]
    );
    // !SECTION: Functions

    // SECTION: Event Handlers
    const handleThemeToggle = useCallback(
        (value: 'light' | 'dark' | 'system') => {
            if (!value) return;

            setDataInLocalStorage('theme', value);

            if (value === 'system') {
                actions.setTheme(value);
                actions.setThemeShade(THEME.GUN_METAL); // Default to dark for system
            } else {
                actions.setTheme(value);
                actions.setThemeShade(
                    value === 'light' ? THEME.AMBER : THEME.GUN_METAL
                );
            }

            handleViewTransition(value);

            if (onThemeChange) {
                onThemeChange(
                    value === 'light' ? THEME.AMBER : THEME.GUN_METAL
                );
            }
        },
        [handleViewTransition, onThemeChange, actions]
    );
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    useEffect(() => {
        const storedTheme = getDataFromLocalStorage('theme') as
            | 'light'
            | 'dark'
            | 'system'
            | null;
        if (storedTheme) {
            actions.setTheme(storedTheme);
            if (storedTheme === 'system') {
                actions.setThemeShade(THEME.GUN_METAL);
            } else {
                actions.setThemeShade(
                    storedTheme === 'light' ? THEME.AMBER : THEME.GUN_METAL
                );
            }
            applyThemeToDocument(storedTheme);
        } else {
            applyThemeToDocument(theme || 'light');
        }
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemChange = () => {
            const currentTheme =
                (getDataFromLocalStorage('theme') as string) || theme;
            if (currentTheme === 'system') {
                applyThemeToDocument('system');
            }
        };

        mediaQuery.addEventListener('change', handleSystemChange);
        return () =>
            mediaQuery.removeEventListener('change', handleSystemChange);
    }, [theme]);

    useEffect(() => {
        if (isControlled) return;

        const updateTheme = () => {
            setInternalIsDark(
                document.documentElement.classList.contains('dark')
            );
        };

        updateTheme();

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, [isControlled]);
    // !SECTION: Side Effects

    return (
        <ToggleGroup
            ref={buttonRef}
            type="single"
            onValueChange={handleThemeToggle}
            value={theme}
        >
            <ToggleGroupItem value="light" aria-label="Light theme">
                <Sun className="text-text-primary" />
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="Dark theme">
                <Moon className="text-text-primary" />
            </ToggleGroupItem>
            <ToggleGroupItem value="system" aria-label="System theme">
                <Monitor className="text-text-primary" />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
