'use client';

import { Text } from '@/src/components/text';
import { motion } from 'motion/react';

/**
 * This function renders a scroll indicator for hero items on the UI.
 *
 * @author Aayush Goyal
 * @created 2026-09-20
 */
export default function ScrollIndicator() {
    // SECTION: Constants and Variables
    // !SECTION: Constants and Variables

    // SECTION: States
    // !SECTION: States

    // SECTION: API Queries
    // !SECTION API Queries

    // SECTION: Event Handlers
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // !SECTION: Side Effects

    // SECTION: UI
    return (
        <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
            animate={{ y: [0, 8, 0] }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        >
            <div className="flex flex-col items-center gap-2">
                <Text className="">Scroll to explore</Text>
                <svg
                    className="text-text-secondary dark:text-amber-60 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </div>
        </motion.div>
    );
    // !SECTION: UI
}
