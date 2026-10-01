'use client';

import { Text, TextVariant } from 'get-elementa-ui';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../components/button';

/**
 * This function renders a LightspunCurvedCarousel block component for the elementa-ui.
 *
 * @version 0.1.0
 * @author Aayush Goyal
 * @modified 2026-10-01
 */
export interface SlideItem {
    id: string | number;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    [key: string]: any;
}

export interface LightspunCurvedCarouselProps<T extends SlideItem = SlideItem> {
    slides: T[];
    /** Custom render function for each card item */
    renderItem?: (item: T, index: number, isActive: boolean) => React.ReactNode;
    /** Cylinder radius in px (default: 900 for natural 3D curve) */
    radius?: number;
    /** Perspective depth in px (default: 1000) */
    perspective?: number;
    /** Total slots in cylinder ring to keep arc seamless (default: 21) */
    slidesInRing?: number;
    /** Height of individual slides (default: 380) */
    slideHeight?: number;
    /** Explicit slide width override. If omitted, calculated from arc length */
    slideWidth?: number;
    /** Spacing angle gap between slides (default: 1) */
    slideSpacing?: number;
    /** Enable auto rotation (default: false) */
    autoRotate?: boolean;
    /** Rotation speed in degrees per frame if autoRotate is true (default: 0.1) */
    rotationSpeed?: number;
    /** Pause auto rotation when hovering over carousel */
    pauseOnHover?: boolean;
    /** Delay in ms to resume rotation after unhovering (default: 1000) */
    resumeDelay?: number;
    /** Entrance animation mode: 'none' | 'fadeIn' | 'fadeUp' */
    entranceAnimation?: 'none' | 'fadeIn' | 'fadeUp';
    /** Entrance distance for 'fadeUp' mode */
    entranceDistance?: number;
    /** Enable edge fadeout gradient mask */
    fadeOut?: boolean;
    /** Show bottom manual controls & item detail panel (default: true) */
    showControls?: boolean;
    className?: string;
}

export function LightspunCurvedCarousel<T extends SlideItem = SlideItem>({
    slides,
    renderItem,
    radius = 900,
    perspective = 1000,
    slidesInRing = 12,
    slideHeight = 380,
    slideWidth,
    slideSpacing = 1,
    autoRotate = false,
    rotationSpeed = 0.1,
    pauseOnHover = true,
    resumeDelay = 1000,
    entranceAnimation = 'fadeUp',
    entranceDistance = 50,
    fadeOut = true,
    showControls = true,
    className = ''
}: LightspunCurvedCarouselProps<T>) {
    // SECTION: Constants and Variables
    const stageRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const ringIndexRef = useRef<number>(0);
    // !SECTION: Constants and Variables

    // SECTION: States
    const [activeIndex, setActiveIndex] = useState<number>(0);

    // 1. Calculate & duplicate slides to meet the required ring density
    const totalTarget = Math.max(slidesInRing, slides.length);
    const multiplier = Math.ceil(totalTarget / (slides.length || 1));
    const normalizedSlides = Array.from({ length: multiplier }, () => slides)
        .flat()
        .slice(0, totalTarget);

    const totalSlideCount = normalizedSlides.length;
    const anglePerSlide = 360 / (totalSlideCount || 1);

    // Calculate proportional card width to avoid distorted aspect ratios
    const calculatedArcWidth =
        (anglePerSlide - slideSpacing) * (Math.PI / 180) * radius;
    const finalSlideWidth =
        slideWidth || Math.min(Math.max(calculatedArcWidth, 240), 320);

    // SECTION: Event Handlers
    // Rotate ring to target ring index using GSAP
    const rotateToRingIndex = useCallback(
        (targetRingIndex: number) => {
            if (!ringRef.current || slides.length === 0) return;

            ringIndexRef.current = targetRingIndex;

            // Calculate active original slide index
            const normalizedOriginalIndex =
                ((targetRingIndex % slides.length) + slides.length) %
                slides.length;
            setActiveIndex(normalizedOriginalIndex);

            const targetAngle = targetRingIndex * anglePerSlide;

            gsap.to(ringRef.current, {
                rotationY: targetAngle,
                duration: 0.7,
                ease: 'power2.out'
            });
        },
        [slides.length, anglePerSlide]
    );

    const nextSlide = useCallback(() => {
        rotateToRingIndex(ringIndexRef.current + 1);
    }, [rotateToRingIndex]);

    const prevSlide = useCallback(() => {
        rotateToRingIndex(ringIndexRef.current - 1);
    }, [rotateToRingIndex]);

    const goToSlide = useCallback(
        (targetOriginalIndex: number) => {
            const diff = targetOriginalIndex - activeIndex;
            rotateToRingIndex(ringIndexRef.current + diff);
        },
        [activeIndex, rotateToRingIndex]
    );
    // !SECTION: Event Handlers

    // SECTION: Side Effects
    // Initialize 3D Cylinder Layout
    useEffect(() => {
        if (!ringRef.current || totalSlideCount === 0) return;

        const ring = ringRef.current;
        const slideElements = Array.from(ring.children) as HTMLElement[];

        if (stageRef.current) {
            stageRef.current.style.width = `${finalSlideWidth}px`;
            stageRef.current.style.height = `${slideHeight}px`;
        }

        // Set initial 3D transform metrics for each card
        slideElements.forEach((slide, index) => {
            slide.style.width = `${finalSlideWidth}px`;
            slide.style.height = `${slideHeight}px`;

            gsap.set(slide, {
                rotateY: index * -anglePerSlide,
                transformOrigin: `50% 50% ${radius}px`,
                z: -radius,
                backfaceVisibility: 'hidden'
            });
        });

        // Auto Rotation Controller (if autoRotate is enabled)
        let speedController = { value: 0 };
        let speedTween: gsap.core.Tween | null = null;
        let resumeTimeout: NodeJS.Timeout | null = null;

        const startAutoRotation = () => {
            if (!autoRotate) return;
            if (speedTween) speedTween.kill();
            speedTween = gsap.to(speedController, {
                value: rotationSpeed,
                duration: 1.0,
                ease: 'power1.out'
            });
        };

        const stopAutoRotation = () => {
            if (speedTween) speedTween.kill();
            speedTween = gsap.to(speedController, {
                value: 0,
                duration: 0.6,
                ease: 'power1.out'
            });
        };

        const tickerCallback = () => {
            if (autoRotate && speedController.value !== 0 && ringRef.current) {
                gsap.set(ringRef.current, {
                    rotationY: `+=${speedController.value}`
                });
            }
        };

        // Entrance Animation Sequence
        const ctx = gsap.context(() => {
            if (entranceAnimation !== 'none') {
                let fromVars: gsap.TweenVars = { opacity: 0 };
                if (entranceAnimation === 'fadeUp') {
                    fromVars.y = entranceDistance;
                }

                gsap.from(slideElements, {
                    ...fromVars,
                    duration: 0.9,
                    stagger: 0.02,
                    ease: 'power2.out',
                    onComplete: () => {
                        if (autoRotate) startAutoRotation();
                    }
                });
            } else if (autoRotate) {
                startAutoRotation();
            }

            if (autoRotate) {
                gsap.ticker.add(tickerCallback);
            }
        });

        const handleMouseEnter = () => {
            if (!autoRotate || !pauseOnHover) return;
            if (resumeTimeout) clearTimeout(resumeTimeout);
            stopAutoRotation();
        };

        const handleMouseLeave = () => {
            if (!autoRotate || !pauseOnHover) return;
            resumeTimeout = setTimeout(() => {
                startAutoRotation();
            }, resumeDelay);
        };

        const containerEl = stageRef.current?.parentElement;
        if (containerEl && autoRotate) {
            containerEl.addEventListener('mouseenter', handleMouseEnter);
            containerEl.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            ctx.revert();
            if (autoRotate) gsap.ticker.remove(tickerCallback);
            if (resumeTimeout) clearTimeout(resumeTimeout);
            if (containerEl && autoRotate) {
                containerEl.removeEventListener('mouseenter', handleMouseEnter);
                containerEl.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [
        totalSlideCount,
        radius,
        slideHeight,
        finalSlideWidth,
        anglePerSlide,
        autoRotate,
        rotationSpeed,
        pauseOnHover,
        resumeDelay,
        entranceAnimation,
        entranceDistance
    ]);

    // Keyboard Arrow Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);
    // !SECTION: Side Effects

    const activeItem = slides[activeIndex];

    // SECTION: UI
    return (
        <div
            className={`relative flex w-full flex-col items-center py-8 ${className}`}
        >
            {/* 3D Viewport Stage */}
            <div
                className="pointer-events-none relative flex w-full items-center justify-center overflow-hidden py-4"
                style={{
                    maskImage: fadeOut
                        ? 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                        : 'none',
                    WebkitMaskImage: fadeOut
                        ? 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)'
                        : 'none'
                }}
            >
                <div
                    ref={stageRef}
                    className="pointer-events-none relative flex items-center justify-center"
                    style={{
                        perspective: `${perspective}px`,
                        perspectiveOrigin: '50% 50%'
                    }}
                >
                    {/* Revolving Cylinder Ring */}
                    <div
                        ref={ringRef}
                        className="pointer-events-none relative flex h-full w-full items-center justify-center"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {normalizedSlides.map((slide, idx) => {
                            const originalIdx = idx % slides.length;
                            const isActive = originalIdx === activeIndex;

                            return (
                                <div
                                    key={`${slide.id}-${idx}`}
                                    onClick={() => goToSlide(originalIdx)}
                                    className={`border-stroke-active-accent-primary pointer-events-auto absolute inset-0 cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                                        isActive
                                            ? 'ring-stroke-active-accent-primary z-10 scale-100 shadow-2xl ring-2'
                                            : 'scale-95 opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    {/* Custom Slot Renderer or Default Image Card */}
                                    {renderItem ? (
                                        renderItem(slide, originalIdx, isActive)
                                    ) : (
                                        <div className="from-bg-active-accent-primary to-bg-active-accent-secondary relative h-full w-full">
                                            {slide.image && (
                                                <img
                                                    src={slide.image}
                                                    alt={
                                                        slide.title ||
                                                        `Slide ${originalIdx}`
                                                    }
                                                    className="pointer-events-none h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            )}
                                            {slide.title && (
                                                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                                                    <Text className="truncate font-sans text-xs font-semibold">
                                                        {slide.title}
                                                    </Text>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Manual Control Panel & Active Item Details */}
            {showControls && (
                <div className="mt-6 flex w-full max-w-3xl flex-col items-center gap-6 px-4">
                    {/* Active Item Details */}
                    {activeItem && (
                        <div className="text-center transition-all duration-300">
                            <span className="text-text-accent-secondary font-mono text-xs font-bold tracking-widest uppercase">
                                #{String(activeIndex + 1).padStart(2, '0')} /{' '}
                                {String(slides.length).padStart(2, '0')}
                            </span>
                            {activeItem.title && (
                                <Text
                                    variant={TextVariant.H3}
                                    className="text-text-accent-primary font-heading mx-auto mt-1"
                                >
                                    {activeItem.title}
                                </Text>
                            )}
                            {activeItem.description && (
                                <Text className="text-text-secondary mx-auto mt-1 max-w-md">
                                    {activeItem.description}
                                </Text>
                            )}
                        </div>
                    )}

                    {/* Navigation Controls */}
                    <div className="border-stroke-active-accent-secondary flex w-full items-center justify-between gap-4 border-t pt-4">
                        {/* Step Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                            {slides.map((item, idx) => {
                                const isCurrent = idx === activeIndex;
                                return (
                                    <button
                                        key={item.id || idx}
                                        onClick={() => goToSlide(idx)}
                                        className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                                            isCurrent
                                                ? 'bg-bg-active-accent-secondary text-text-primary shadow-md'
                                                : 'text-text-secondary hover:text-text-primary'
                                        }`}
                                    >
                                        #{String(idx + 1).padStart(2, '0')}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Manual Arrow Buttons */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                onClick={prevSlide}
                                aria-label="Previous Slide"
                                variant="outline"
                                className="text-text-accent-primary border-stroke-active-accent-primary rounded-full border bg-transparent p-2.5 transition-all active:scale-95"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={nextSlide}
                                aria-label="Next Slide"
                                className="text-text-accent-primary border-stroke-active-accent-primary rounded-full border bg-transparent p-2.5 transition-all active:scale-95"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    // !SECTION: UI
}
