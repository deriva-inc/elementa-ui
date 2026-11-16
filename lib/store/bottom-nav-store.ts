'use client';

import { ArrowUpDown, CreditCard, Home, Search, Users } from 'lucide-react';
import * as React from 'react';
import { create } from 'zustand';

export interface TopNavLink {
    id: string;
    label: string;
    href: string;
    icon?:
        | React.ComponentType<{
              height?: number | string;
              width?: number | string;
              className?: string;
          }>
        | React.ReactNode;
    activeIcon?:
        | React.ComponentType<{
              height?: number | string;
              width?: number | string;
              className?: string;
          }>
        | React.ReactNode;
    isAction?: boolean;
    badge?: number | string | boolean;
    disabled?: boolean;
}

export const DEFAULT_TOP_NAV_LINKS: TopNavLink[] = [
    {
        id: 'home',
        label: 'Home',
        href: '/home',
        icon: Home
    },
    {
        id: 'payments',
        label: 'Payments',
        href: '/payments',
        icon: CreditCard
    },
    {
        id: 'transfer',
        label: 'Transfer',
        href: '/transfer',
        icon: ArrowUpDown,
        isAction: true
    },
    {
        id: 'customers',
        label: 'Customers',
        href: '/customers',
        icon: Users
    },
    {
        id: 'search',
        label: 'Search',
        href: '/search',
        icon: Search
    }
];

export interface BottomNavStoreState {
    topNavLinks: TopNavLink[];
    currentPage: string;
    actions: {
        setTopNavLinks: (links: TopNavLink[]) => void;
        setCurrentPage: (page: string) => void;
    };
}

/**
 * Zustand store for managing BottomNavBar navigation links and active page state.
 *
 * @author Aayush Goyal
 * @modified 2026-11-16
 */
export const useBottomNavStore = create<BottomNavStoreState>((set) => ({
    topNavLinks: DEFAULT_TOP_NAV_LINKS,
    currentPage: '',
    actions: {
        setTopNavLinks: (topNavLinks: TopNavLink[]) => set({ topNavLinks }),
        setCurrentPage: (currentPage: string) => set({ currentPage })
    }
}));

export default useBottomNavStore;
