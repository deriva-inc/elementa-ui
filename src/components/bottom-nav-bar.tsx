'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import {
    type TopNavLink,
    useBottomNavStore
} from '../../lib/store/bottom-nav-store';
import { cn } from '../../lib/utils';

export interface BottomNavItem {
    /** Unique value or identifier for the navigation item */
    id: string;
    /** Human-readable label displayed below the icon */
    label: string;
    /** Icon element to render */
    icon: React.ReactNode;
    /** Active icon override (e.g. filled variant when active) */
    activeIcon?: React.ReactNode;
    /** Optional badge count or status dot */
    badge?: number | string | boolean;
    /** Whether this item is rendered as a prominent circular action button (e.g. center FAB) */
    isAction?: boolean;
    /** Optional link URL when used for anchor navigation */
    href?: string;
    /** Custom click event handler */
    onClick?: (
        item: BottomNavItem,
        event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Accessible label for the navigation item */
    ariaLabel?: string;
}

export interface BottomNavBarProps {
    /** Navigation items (maximum of 5 items). Falls back to topNavLinks from useBottomNavStore if omitted. */
    items?: BottomNavItem[];
    /** Active item ID for controlled usage */
    value?: string;
    /** Default active item ID for uncontrolled usage */
    defaultValue?: string;
    /** Callback fired when an item is selected */
    onValueChange?: (value: string, item: BottomNavItem) => void;
    /** Optional navigation handler for href links (e.g. router.push in Next.js) */
    onNavigate?: (href: string, item: BottomNavItem) => void;
    /** Layout variant: 'fixed' (docked to viewport bottom), 'floating' (pill above bottom), or 'inline' */
    variant?: 'fixed' | 'floating' | 'inline';
    /** Whether to show text labels below icons */
    showLabels?: boolean;
    /** Whether to render the iOS-style home indicator safe area bar */
    showHomeIndicator?: boolean;
    /** Whether to hide on desktop viewports (>= 728px) */
    mobileOnly?: boolean;
    /** Whether the current user is authenticated (passed by the consuming project) */
    isAuthenticated?: boolean;
    /** Pathnames where the navigation bar should be hidden (e.g. ['/']) */
    hideOnPaths?: string[];
    /** Additional CSS classes for root element */
    className?: string;
    /** Inline style overrides */
    style?: React.CSSProperties;
    /** Accessible landmark label */
    ariaLabel?: string;
}

const renderLinkIcon = (icon: TopNavLink['icon']): React.ReactNode => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || typeof icon === 'object') {
        const IconComponent = icon as React.ComponentType<{
            height?: number | string;
            width?: number | string;
        }>;
        return <IconComponent height={22} width={22} />;
    }
    return icon;
};

/**
 * This function renders the Bottom Navigation Bar component for elementa-ui.
 * Maintains its own Zustand store (`useBottomNavStore`) to manage `topNavLinks`,
 * highlights the active item with the primary accent color depending on the current energy,
 * and styles unselected items in the tertiary color.
 *
 * @version 0.2.0
 * @author Aayush Goyal
 * @modified 2026-11-17
 */
export function BottomNavBar({
    items,
    value,
    defaultValue,
    onValueChange,
    onNavigate,
    variant = 'fixed',
    showLabels = true,
    showHomeIndicator,
    mobileOnly = false,
    isAuthenticated = true,
    hideOnPaths = [],
    className,
    style,
    ariaLabel = 'Bottom Navigation'
}: BottomNavBarProps) {
    // SECTION: Constants and Variables
    const MAX_ITEMS = 5;
    const nextPathname = usePathname();
    const pathname =
        nextPathname ??
        (typeof window !== 'undefined' ? window.location.pathname : '');

    const topNavLinks = useBottomNavStore((state) => state.topNavLinks);
    const currentPage = useBottomNavStore((state) => state.currentPage);
    const storeActions = useBottomNavStore((state) => state.actions);
    const layoutId = React.useId();

    const hasHomeIndicator =
        showHomeIndicator !== undefined
            ? showHomeIndicator
            : variant === 'fixed';
    // !SECTION: Constants and Variables

    // SECTION: States
    const [mounted, setMounted] = React.useState<boolean>(false);
    const [isSmallScreen, setIsSmallScreen] = React.useState<boolean>(true);
    const [internalValue, setInternalValue] = React.useState<string | null>(
        null
    );

    const storeNavItems: BottomNavItem[] = React.useMemo(() => {
        return topNavLinks.map((link) => ({
            id: link.id,
            label: link.label,
            href: link.href,
            icon: renderLinkIcon(link.icon),
            activeIcon: renderLinkIcon(link.activeIcon ?? link.icon),
            isAction: link.isAction,
            badge: link.badge,
            disabled: link.disabled
        }));
    }, [topNavLinks]);

    const navigationItems = items && items.length > 0 ? items : storeNavItems;
    const visibleItems = navigationItems.slice(0, MAX_ITEMS);

    // Derive active tab from controlled value, internal state, store state, or pathname
    const activeValue = React.useMemo(() => {
        if (value !== undefined) return value;
        if (internalValue !== null) return internalValue;
        if (currentPage) return currentPage;

        const matchingLink = visibleItems.find(
            (link) =>
                link.href &&
                (pathname === link.href ||
                    (link.href !== '/' && pathname.startsWith(link.href)))
        );
        return matchingLink
            ? matchingLink.id
            : (defaultValue ?? visibleItems[0]?.id ?? '');
    }, [
        value,
        internalValue,
        currentPage,
        pathname,
        defaultValue,
        visibleItems
    ]);
    // !SECTION: States

    // SECTION: Side Effects
    React.useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 728);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        if (
            process.env.NODE_ENV !== 'production' &&
            navigationItems.length > MAX_ITEMS
        ) {
            // eslint-disable-next-line no-console
            console.warn(
                `[BottomNavBar] Bottom navigation bar cannot have more than ${MAX_ITEMS} items. Received ${navigationItems.length}, displaying only the first ${MAX_ITEMS}.`
            );
        }
    }, [navigationItems.length]);
    // !SECTION: Side Effects

    // SECTION: Event Handlers
    const handleSelect = React.useCallback(
        (
            item: BottomNavItem,
            event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
        ) => {
            if (item.disabled) {
                event.preventDefault();
                return;
            }

            if (value === undefined) {
                setInternalValue(item.id);
            }
            storeActions.setCurrentPage(item.id);
            onValueChange?.(item.id, item);

            if (item.onClick) {
                item.onClick(item, event);
            } else if (item.href && onNavigate) {
                event.preventDefault();
                onNavigate(item.href, item);
            }
        },
        [value, storeActions, onValueChange, onNavigate]
    );
    // !SECTION: Event Handlers

    // SECTION: Authentication & Screen Size Guard
    if (hideOnPaths.includes(pathname)) {
        return null;
    }
    if (!isAuthenticated) {
        return null;
    }
    if (mobileOnly && mounted && !isSmallScreen) {
        return null;
    }
    // !SECTION: Authentication & Screen Size Guard

    // SECTION: UI
    const containerClasses = cn(
        'z-40 w-full transition-colors select-none',
        mobileOnly && 'min-[728px]:hidden',
        'bg-bg-flat-primary/95 backdrop-blur-md border-stroke-base-primary',
        variant === 'fixed' &&
            'fixed bottom-0 inset-x-0 border-t pb-2 pt-2 px-4 shadow-lg',
        variant === 'floating' &&
            'fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md px-4 py-2 rounded-3xl border shadow-2xl w-[calc(100%-2rem)]',
        variant === 'inline' &&
            'relative max-w-md px-4 py-2 rounded-2xl border shadow-sm mx-auto',
        className
    );

    return (
        <nav
            role="navigation"
            aria-label={ariaLabel}
            data-component="bottom-nav-bar"
            className={containerClasses}
            style={style}
        >
            <ul
                role="menubar"
                className="mx-auto flex w-full max-w-lg items-center justify-around gap-1"
            >
                {visibleItems.map((item) => {
                    const isSelected = activeValue === item.id;
                    const isAction = Boolean(item.isAction);

                    if (isAction) {
                        const actionClasses = cn(
                            'relative flex size-12 items-center justify-center rounded-full transition-all duration-200 outline-none',
                            'bg-gun-metal-1100 text-amber-white-100 hover:bg-gun-metal-1000',
                            'dark:bg-bg-raised-primary dark:border-stroke-raised-primary dark:text-text-primary dark:hover:bg-bg-raised-primary/80 dark:border',
                            'focus-visible:ring-stroke-active-accent-primary shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2',
                            'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
                            item.disabled && 'pointer-events-none opacity-40'
                        );

                        const actionChildren = (
                            <>
                                <span className="text-xl">
                                    {isSelected && item.activeIcon
                                        ? item.activeIcon
                                        : item.icon}
                                </span>

                                {item.badge !== undefined && (
                                    <span className="bg-bg-active-accent-primary text-text-primary absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                                        {typeof item.badge === 'boolean'
                                            ? ''
                                            : item.badge}
                                    </span>
                                )}
                            </>
                        );

                        return (
                            <li
                                key={item.id}
                                role="none"
                                className="flex shrink-0 items-center justify-center px-1"
                            >
                                {item.href ? (
                                    <motion.a
                                        href={item.href}
                                        role="menuitem"
                                        aria-label={
                                            item.ariaLabel || item.label
                                        }
                                        aria-disabled={item.disabled}
                                        whileTap={{ scale: 0.92 }}
                                        onClick={(e) => handleSelect(item, e)}
                                        className={actionClasses}
                                    >
                                        {actionChildren}
                                    </motion.a>
                                ) : (
                                    <motion.button
                                        type="button"
                                        role="menuitem"
                                        aria-label={
                                            item.ariaLabel || item.label
                                        }
                                        disabled={item.disabled}
                                        whileTap={{ scale: 0.92 }}
                                        onClick={(e) => handleSelect(item, e)}
                                        className={actionClasses}
                                    >
                                        {actionChildren}
                                    </motion.button>
                                )}
                            </li>
                        );
                    }

                    const itemClasses = cn(
                        'group relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-1.5 transition-colors duration-200 outline-none',
                        'focus-visible:ring-stroke-active-accent-primary focus-visible:ring-2',
                        'disabled:cursor-not-allowed disabled:opacity-40',
                        item.disabled && 'pointer-events-none opacity-40'
                    );

                    const itemChildren = (
                        <>
                            {isSelected && (
                                <motion.div
                                    layoutId={`bottom-nav-active-${layoutId}`}
                                    className="bg-bg-active-fill-accent-primary/40 absolute inset-0 -z-10 rounded-xl"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 30
                                    }}
                                />
                            )}

                            {/* Icon Container */}
                            <div
                                className={cn(
                                    'relative flex size-6 items-center justify-center transition-colors duration-200',
                                    isSelected
                                        ? 'text-text-accent-primary'
                                        : 'text-text-tertiary group-hover:text-text-secondary'
                                )}
                            >
                                {isSelected && item.activeIcon
                                    ? item.activeIcon
                                    : item.icon}

                                {/* Optional Badge */}
                                {item.badge !== undefined && (
                                    <span
                                        className={cn(
                                            'absolute -top-1 -right-2 flex items-center justify-center rounded-full',
                                            typeof item.badge === 'boolean'
                                                ? 'bg-bg-active-accent-primary size-2'
                                                : 'bg-bg-active-accent-primary text-text-primary h-4 min-w-4 px-1 text-[10px] font-bold shadow-xs'
                                        )}
                                    >
                                        {typeof item.badge === 'boolean'
                                            ? null
                                            : item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            {showLabels && (
                                <span
                                    className={cn(
                                        'mt-1 text-xs tracking-tight transition-colors duration-200',
                                        isSelected
                                            ? 'text-text-accent-primary font-semibold'
                                            : 'text-text-tertiary group-hover:text-text-secondary font-normal'
                                    )}
                                >
                                    {item.label}
                                </span>
                            )}
                        </>
                    );

                    return (
                        <li
                            key={item.id}
                            role="none"
                            className="flex min-w-0 flex-1 justify-center"
                        >
                            {item.href ? (
                                <motion.a
                                    href={item.href}
                                    role="menuitem"
                                    aria-current={
                                        isSelected ? 'page' : undefined
                                    }
                                    aria-label={item.ariaLabel || item.label}
                                    aria-disabled={item.disabled}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => handleSelect(item, e)}
                                    className={itemClasses}
                                >
                                    {itemChildren}
                                </motion.a>
                            ) : (
                                <motion.button
                                    type="button"
                                    role="menuitem"
                                    aria-selected={isSelected}
                                    aria-current={
                                        isSelected ? 'page' : undefined
                                    }
                                    aria-label={item.ariaLabel || item.label}
                                    disabled={item.disabled}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => handleSelect(item, e)}
                                    className={itemClasses}
                                >
                                    {itemChildren}
                                </motion.button>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* iOS Home Indicator Bar */}
            {hasHomeIndicator && (
                <div
                    aria-hidden="true"
                    className="bg-text-tertiary/20 mx-auto mt-1.5 h-1 w-28 rounded-full"
                />
            )}
        </nav>
    );
    // !SECTION: UI
}

export default BottomNavBar;
