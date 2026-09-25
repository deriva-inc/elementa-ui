'use client';

import { Check, ChevronDown, Copy, Pipette } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/**
 * This function renders a Color Picker component for the elementa-ui.
 *
 * @version 0.2.0
 * @author Aayush Goyal
 * @modified 2026-09-25
 */

export interface ColorPickerProps {
    /** Current color value (e.g. hex #EF767A, rgb(239, 118, 122), etc.) */
    value: string;
    /** Callback when color changes (returns normalized hex #RRGGBB) */
    onChange: (color: string) => void;
    /** Optional label (defaults to "Color", pass empty string or null to hide) */
    label?: string;
    /** Additional CSS classes for the root container */
    className?: string;
    /** List of preset hex colors to display */
    presets?: string[];
    /** Whether to show the preset swatches */
    showPresets?: boolean;
    /** Whether to show the eyedropper tool */
    showEyedropper?: boolean;
    /** Whether to show the copy button */
    showCopy?: boolean;
    /** Display mode: 'popover' (compact trigger + floating studio) or 'inline' (studio rendered in-place) */
    mode?: 'popover' | 'inline';
    /** Disable interactions */
    disabled?: boolean;
}

type ColorFormat = 'HEX' | 'RGB' | 'HSL';

const DEFAULT_PRESETS: string[] = [
    '#EF767A', // Coral Red
    '#9B6DF2', // Electric Violet
    '#70A073', // Matcha Sage
    '#DD9C00', // Golden Hour
    '#C1582F', // Terracotta Rust
    '#C26D8F', // Dusty Rose
    '#3B82F6', // Blueberry
    '#06B6D4', // Cyan
    '#18181B', // Gun Metal
    '#71717A', // Muted Slate
    '#FFFFFF' // Pure White
];

/* -------------------------------------------------------------------------- */
/*                           Color Math Utilities                             */
/* -------------------------------------------------------------------------- */

interface RGB {
    r: number;
    g: number;
    b: number;
}

interface HSV {
    h: number; // 0-360
    s: number; // 0-100
    v: number; // 0-100
}

interface HSL {
    h: number; // 0-360
    s: number; // 0-100
    l: number; // 0-100
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Normalizes hex strings (with or without #, 3-char or 6-char) to 7-character #RRGGBB.
 */
function normalizeHex(color: string): string {
    if (!color) return '#000000';
    let hex = color.trim().replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((c) => c + c)
            .join('');
    }
    if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return `#${hex.toUpperCase()}`;
    }
    return '#000000';
}

function hexToRgb(hex: string): RGB {
    const full = normalizeHex(hex).replace(/^#/, '');
    const num = parseInt(full, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) =>
        clamp(Math.round(n), 0, 255)
            .toString(16)
            .padStart(2, '0')
            .toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsv(r: number, g: number, b: number): HSV {
    const rN = clamp(r, 0, 255) / 255;
    const gN = clamp(g, 0, 255) / 255;
    const bN = clamp(b, 0, 255) / 255;

    const max = Math.max(rN, gN, bN);
    const min = Math.min(rN, gN, bN);
    const diff = max - min;

    let h = 0;
    const s = max === 0 ? 0 : (diff / max) * 100;
    const v = max * 100;

    if (diff !== 0) {
        if (max === rN) {
            h = ((gN - bN) / diff) % 6;
        } else if (max === gN) {
            h = (bN - rN) / diff + 2;
        } else {
            h = (rN - gN) / diff + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }

    return {
        h: clamp(Math.round(h), 0, 360),
        s: clamp(Math.round(s), 0, 100),
        v: clamp(Math.round(v), 0, 100)
    };
}

function hsvToRgb(h: number, s: number, v: number): RGB {
    const hN = (clamp(h, 0, 360) % 360) / 60;
    const sN = clamp(s, 0, 100) / 100;
    const vN = clamp(v, 0, 100) / 100;

    const c = vN * sN;
    const x = c * (1 - Math.abs((hN % 2) - 1));
    const m = vN - c;

    let r1 = 0;
    let g1 = 0;
    let b1 = 0;

    if (hN >= 0 && hN < 1) {
        r1 = c;
        g1 = x;
    } else if (hN >= 1 && hN < 2) {
        r1 = x;
        g1 = c;
    } else if (hN >= 2 && hN < 3) {
        g1 = c;
        b1 = x;
    } else if (hN >= 3 && hN < 4) {
        g1 = x;
        b1 = c;
    } else if (hN >= 4 && hN < 5) {
        r1 = x;
        b1 = c;
    } else {
        r1 = c;
        b1 = x;
    }

    return {
        r: clamp(Math.round((r1 + m) * 255), 0, 255),
        g: clamp(Math.round((g1 + m) * 255), 0, 255),
        b: clamp(Math.round((b1 + m) * 255), 0, 255)
    };
}

function rgbToHsl(r: number, g: number, b: number): HSL {
    const rN = clamp(r, 0, 255) / 255;
    const gN = clamp(g, 0, 255) / 255;
    const bN = clamp(b, 0, 255) / 255;

    const max = Math.max(rN, gN, bN);
    const min = Math.min(rN, gN, bN);
    const diff = max - min;
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (diff !== 0) {
        s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
        if (max === rN) {
            h = ((gN - bN) / diff) % 6;
        } else if (max === gN) {
            h = (bN - rN) / diff + 2;
        } else {
            h = (rN - gN) / diff + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }

    return {
        h: clamp(Math.round(h), 0, 360),
        s: clamp(Math.round(s * 100), 0, 100),
        l: clamp(Math.round(l * 100), 0, 100)
    };
}

function hslToRgb(h: number, s: number, l: number): RGB {
    const hN = (clamp(h, 0, 360) % 360) / 60;
    const sN = clamp(s, 0, 100) / 100;
    const lN = clamp(l, 0, 100) / 100;

    const c = (1 - Math.abs(2 * lN - 1)) * sN;
    const x = c * (1 - Math.abs((hN % 2) - 1));
    const m = lN - c / 2;

    let r1 = 0;
    let g1 = 0;
    let b1 = 0;

    if (hN >= 0 && hN < 1) {
        r1 = c;
        g1 = x;
    } else if (hN >= 1 && hN < 2) {
        r1 = x;
        g1 = c;
    } else if (hN >= 2 && hN < 3) {
        g1 = c;
        b1 = x;
    } else if (hN >= 3 && hN < 4) {
        g1 = x;
        b1 = c;
    } else if (hN >= 4 && hN < 5) {
        r1 = x;
        b1 = c;
    } else {
        r1 = c;
        b1 = x;
    }

    return {
        r: clamp(Math.round((r1 + m) * 255), 0, 255),
        g: clamp(Math.round((g1 + m) * 255), 0, 255),
        b: clamp(Math.round((b1 + m) * 255), 0, 255)
    };
}

function isLightColor(hex: string): boolean {
    const rgb = hexToRgb(hex);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.65;
}

/* -------------------------------------------------------------------------- */
/*                         Visual Color Studio Area                           */
/* -------------------------------------------------------------------------- */

interface ColorStudioProps {
    hsv: HSV;
    onChangeHsv: (hsv: HSV) => void;
    currentHex: string;
    presets?: string[];
    showPresets?: boolean;
    disabled?: boolean;
}

function ColorStudio({
    hsv,
    onChangeHsv,
    currentHex,
    presets,
    showPresets = true,
    disabled = false
}: ColorStudioProps) {
    const [format, setFormat] = React.useState<ColorFormat>('HEX');
    const satAreaRef = React.useRef<HTMLDivElement>(null);
    const hueSliderRef = React.useRef<HTMLDivElement>(null);

    // Derived color representations
    const rgb = React.useMemo(
        () => hsvToRgb(hsv.h, hsv.s, hsv.v),
        [hsv.h, hsv.s, hsv.v]
    );
    const hsl = React.useMemo(
        () => rgbToHsl(rgb.r, rgb.g, rgb.b),
        [rgb.r, rgb.g, rgb.b]
    );

    // Local inputs state for fluid editing
    const [hexInput, setHexInput] = React.useState(() =>
        currentHex.replace(/^#/, '')
    );
    const [rInput, setRInput] = React.useState(() => String(rgb.r));
    const [gInput, setGInput] = React.useState(() => String(rgb.g));
    const [bInput, setBInput] = React.useState(() => String(rgb.b));
    const [hInput, setHInput] = React.useState(() => String(hsl.h));
    const [sInput, setSInput] = React.useState(() => String(hsl.s));
    const [lInput, setLInput] = React.useState(() => String(hsl.l));

    React.useEffect(() => {
        setHexInput(currentHex.replace(/^#/, ''));
        setRInput(String(rgb.r));
        setGInput(String(rgb.g));
        setBInput(String(rgb.b));
        setHInput(String(hsl.h));
        setSInput(String(hsl.s));
        setLInput(String(hsl.l));
    }, [currentHex, rgb.r, rgb.g, rgb.b, hsl.h, hsl.s, hsl.l]);

    // Handle 2D Saturation / Value dragging
    const handleSatPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || !satAreaRef.current) return;
        const target = e.currentTarget;
        target.setPointerCapture(e.pointerId);

        const updateFromPointer = (ev: PointerEvent | React.PointerEvent) => {
            if (!satAreaRef.current) return;
            const rect = satAreaRef.current.getBoundingClientRect();
            const x = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
            const y = clamp((ev.clientY - rect.top) / rect.height, 0, 1);

            const newS = Math.round(x * 100);
            const newV = Math.round((1 - y) * 100);
            onChangeHsv({ h: hsv.h, s: newS, v: newV });
        };

        updateFromPointer(e);

        const onPointerMove = (ev: PointerEvent) => updateFromPointer(ev);
        const onPointerUp = (ev: PointerEvent) => {
            target.releasePointerCapture(ev.pointerId);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    // Handle Hue Slider dragging
    const handleHuePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled || !hueSliderRef.current) return;
        const target = e.currentTarget;
        target.setPointerCapture(e.pointerId);

        const updateFromPointer = (ev: PointerEvent | React.PointerEvent) => {
            if (!hueSliderRef.current) return;
            const rect = hueSliderRef.current.getBoundingClientRect();
            const x = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
            const newH = clamp(Math.round(x * 360), 0, 360);
            onChangeHsv({ h: newH, s: hsv.s, v: hsv.v });
        };

        updateFromPointer(e);

        const onPointerMove = (ev: PointerEvent) => updateFromPointer(ev);
        const onPointerUp = (ev: PointerEvent) => {
            target.releasePointerCapture(ev.pointerId);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    // Cycle through formats
    const cycleFormat = () => {
        setFormat((prev) => {
            if (prev === 'HEX') return 'RGB';
            if (prev === 'RGB') return 'HSL';
            return 'HEX';
        });
    };

    // Hex input handlers
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
        setHexInput(text);
        if (text.length === 3 || text.length === 6) {
            const normalized = normalizeHex(text);
            const newRgb = hexToRgb(normalized);
            const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
            onChangeHsv(newHsv);
        }
    };

    // RGB input handlers
    const applyRgb = (r: number, g: number, b: number) => {
        const newHsv = rgbToHsv(r, g, b);
        onChangeHsv(newHsv);
    };

    // HSL input handlers
    const applyHsl = (h: number, s: number, l: number) => {
        const newRgb = hslToRgb(h, s, l);
        const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
        onChangeHsv({ ...newHsv, h });
    };

    return (
        <div className="flex w-full flex-col gap-3">
            {/* 2D Saturation / Value Surface */}
            <div
                ref={satAreaRef}
                onPointerDown={handleSatPointerDown}
                role="slider"
                aria-label="Color saturation and brightness picker"
                aria-valuetext={`Saturation: ${hsv.s}%, Brightness: ${hsv.v}%`}
                tabIndex={0}
                onKeyDown={(e) => {
                    let sStep = 0;
                    let vStep = 0;
                    if (e.key === 'ArrowRight') sStep = 2;
                    if (e.key === 'ArrowLeft') sStep = -2;
                    if (e.key === 'ArrowUp') vStep = 2;
                    if (e.key === 'ArrowDown') vStep = -2;
                    if (sStep !== 0 || vStep !== 0) {
                        e.preventDefault();
                        onChangeHsv({
                            h: hsv.h,
                            s: clamp(hsv.s + sStep, 0, 100),
                            v: clamp(hsv.v + vStep, 0, 100)
                        });
                    }
                }}
                className={cn(
                    'relative h-32 w-full cursor-crosshair overflow-hidden rounded-lg shadow-inner select-none touch-none',
                    'border-stroke-base-primary border focus-visible:ring-stroke-active-accent-primary focus-visible:ring-2 focus-visible:outline-none'
                )}
                style={{
                    backgroundColor: `hsl(${hsv.h}, 100%, 50%)`
                }}
            >
                {/* Horizontal white gradient (saturation) */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to right, #ffffff, transparent)'
                    }}
                />
                {/* Vertical black gradient (brightness/value) */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to top, #000000, transparent)'
                    }}
                />
                {/* Visual Position Thumb */}
                <div
                    className="pointer-events-none absolute size-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-transform duration-75 ring-1 ring-black/40"
                    style={{
                        left: `${hsv.s}%`,
                        top: `${100 - hsv.v}%`,
                        backgroundColor: currentHex
                    }}
                />
            </div>

            {/* Hue Spectrum Rainbow Slider */}
            <div className="flex flex-col gap-1.5">
                <div
                    ref={hueSliderRef}
                    onPointerDown={handleHuePointerDown}
                    role="slider"
                    aria-label="Color hue spectrum slider"
                    aria-valuenow={hsv.h}
                    aria-valuemin={0}
                    aria-valuemax={360}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        let step = 0;
                        if (e.key === 'ArrowRight' || e.key === 'ArrowUp')
                            step = 5;
                        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown')
                            step = -5;
                        if (step !== 0) {
                            e.preventDefault();
                            onChangeHsv({
                                h: clamp(hsv.h + step, 0, 360),
                                s: hsv.s,
                                v: hsv.v
                            });
                        }
                    }}
                    className={cn(
                        'relative h-3.5 w-full cursor-pointer rounded-full shadow-inner select-none touch-none',
                        'border-stroke-base-primary border focus-visible:ring-stroke-active-accent-primary focus-visible:ring-2 focus-visible:outline-none'
                    )}
                    style={{
                        background:
                            'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                    }}
                >
                    {/* Hue Thumb */}
                    <div
                        className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/30"
                        style={{
                            left: `${(hsv.h / 360) * 100}%`,
                            backgroundColor: `hsl(${hsv.h}, 100%, 50%)`
                        }}
                    />
                </div>
            </div>

            {/* Multi-Format Channel Inputs & Switcher */}
            <div className="flex items-center gap-1.5">
                {/* Format Switcher Button */}
                <button
                    type="button"
                    onClick={cycleFormat}
                    title="Switch color format (HEX / RGB / HSL)"
                    className={cn(
                        'border-stroke-base-primary bg-bg-flat-primary text-text-secondary hover:text-text-primary hover:border-stroke-raised-primary flex h-8 shrink-0 items-center gap-1 rounded-md border px-2 text-[11px] font-bold tracking-wider uppercase transition-colors',
                        'focus-visible:ring-stroke-active-secondary focus-visible:ring-2 focus-visible:outline-none'
                    )}
                >
                    <span>{format}</span>
                    <ChevronDown className="size-3 opacity-60" />
                </button>

                {/* HEX Input */}
                {format === 'HEX' && (
                    <div className="border-stroke-base-primary bg-bg-flat-primary focus-within:border-stroke-active-accent-primary focus-within:ring-bg-active-fill-accent-primary/20 flex h-8 min-w-0 flex-1 items-center rounded-md border px-2 shadow-2xs focus-within:ring-2">
                        <span className="text-text-tertiary mr-1 font-mono text-xs font-bold select-none">
                            #
                        </span>
                        <input
                            type="text"
                            value={hexInput}
                            onChange={handleHexChange}
                            onBlur={() =>
                                setHexInput(currentHex.replace(/^#/, ''))
                            }
                            maxLength={6}
                            disabled={disabled}
                            spellCheck={false}
                            className="text-text-primary placeholder:text-text-tertiary w-full bg-transparent font-mono text-xs font-semibold tracking-wider uppercase outline-none"
                            aria-label="Hex color value"
                        />
                    </div>
                )}

                {/* RGB Channels */}
                {format === 'RGB' && (
                    <div className="grid min-w-0 flex-1 grid-cols-3 gap-1">
                        {[
                            {
                                label: 'R',
                                val: rInput,
                                setVal: setRInput,
                                max: 255,
                                apply: (v: number) => applyRgb(v, rgb.g, rgb.b)
                            },
                            {
                                label: 'G',
                                val: gInput,
                                setVal: setGInput,
                                max: 255,
                                apply: (v: number) => applyRgb(rgb.r, v, rgb.b)
                            },
                            {
                                label: 'B',
                                val: bInput,
                                setVal: setBInput,
                                max: 255,
                                apply: (v: number) => applyRgb(rgb.r, rgb.g, v)
                            }
                        ].map(({ label, val, setVal, max, apply }) => (
                            <div
                                key={label}
                                className="border-stroke-base-primary bg-bg-flat-primary focus-within:border-stroke-active-accent-primary flex h-8 min-w-0 flex-col items-center justify-center rounded-md border px-1"
                            >
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={val}
                                    onChange={(e) => {
                                        const clean = e.target.value.replace(
                                            /\D/g,
                                            ''
                                        );
                                        setVal(clean);
                                        if (clean !== '') {
                                            const num = clamp(
                                                parseInt(clean, 10),
                                                0,
                                                max
                                            );
                                            apply(num);
                                        }
                                    }}
                                    onBlur={() => {
                                        const num = clamp(
                                            parseInt(val, 10) || 0,
                                            0,
                                            max
                                        );
                                        setVal(String(num));
                                        apply(num);
                                    }}
                                    className="text-text-primary w-full bg-transparent text-center font-mono text-xs font-semibold outline-none"
                                    aria-label={`RGB ${label} channel`}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* HSL Channels */}
                {format === 'HSL' && (
                    <div className="grid min-w-0 flex-1 grid-cols-3 gap-1">
                        {[
                            {
                                label: 'H',
                                val: hInput,
                                setVal: setHInput,
                                max: 360,
                                apply: (v: number) => applyHsl(v, hsl.s, hsl.l)
                            },
                            {
                                label: 'S',
                                val: sInput,
                                setVal: setSInput,
                                max: 100,
                                apply: (v: number) => applyHsl(hsl.h, v, hsl.l)
                            },
                            {
                                label: 'L',
                                val: lInput,
                                setVal: setLInput,
                                max: 100,
                                apply: (v: number) => applyHsl(hsl.h, hsl.s, v)
                            }
                        ].map(({ label, val, setVal, max, apply }) => (
                            <div
                                key={label}
                                className="border-stroke-base-primary bg-bg-flat-primary focus-within:border-stroke-active-accent-primary flex h-8 min-w-0 flex-col items-center justify-center rounded-md border px-1"
                            >
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={val}
                                    onChange={(e) => {
                                        const clean = e.target.value.replace(
                                            /\D/g,
                                            ''
                                        );
                                        setVal(clean);
                                        if (clean !== '') {
                                            const num = clamp(
                                                parseInt(clean, 10),
                                                0,
                                                max
                                            );
                                            apply(num);
                                        }
                                    }}
                                    onBlur={() => {
                                        const num = clamp(
                                            parseInt(val, 10) || 0,
                                            0,
                                            max
                                        );
                                        setVal(String(num));
                                        apply(num);
                                    }}
                                    className="text-text-primary w-full bg-transparent text-center font-mono text-xs font-semibold outline-none"
                                    aria-label={`HSL ${label} channel`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Presets in Studio Panel */}
            {showPresets && presets && presets.length > 0 && (
                <div className="border-stroke-base-primary flex flex-col gap-1.5 border-t pt-2.5">
                    <span className="text-text-tertiary text-[10px] font-bold tracking-wider uppercase">
                        Presets
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {presets.map((preset) => {
                            const normalizedPreset = normalizeHex(preset);
                            const isSelected =
                                normalizeHex(currentHex) === normalizedPreset;
                            const light = isLightColor(normalizedPreset);

                            return (
                                <button
                                    key={preset}
                                    type="button"
                                    title={preset}
                                    aria-label={`Select preset ${preset}`}
                                    disabled={disabled}
                                    onClick={() => {
                                        const nextRgb =
                                            hexToRgb(normalizedPreset);
                                        onChangeHsv(
                                            rgbToHsv(
                                                nextRgb.r,
                                                nextRgb.g,
                                                nextRgb.b
                                            )
                                        );
                                    }}
                                    className={cn(
                                        'group relative flex size-5.5 cursor-pointer items-center justify-center rounded-md border transition-all duration-150',
                                        'hover:scale-110 active:scale-95',
                                        'focus-visible:ring-stroke-active-secondary focus-visible:ring-2 focus-visible:outline-none',
                                        isSelected
                                            ? 'border-stroke-active-accent-primary ring-stroke-active-accent-primary ring-offset-bg-base-primary z-10 scale-105 shadow-xs ring-2 ring-offset-1'
                                            : 'hover:border-stroke-active-accent-primary border-black/15 dark:border-white/20'
                                    )}
                                    style={{ backgroundColor: preset }}
                                >
                                    {isSelected && (
                                        <Check
                                            className={cn(
                                                'size-3 stroke-[2.5]',
                                                light
                                                    ? 'text-gun-metal-1100'
                                                    : 'text-white'
                                            )}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                           Main ColorPicker Export                          */
/* -------------------------------------------------------------------------- */

/**
 * Modern, sleek ColorPicker component styled with Elementa design tokens.
 * Features an interactive custom HSV/RGB/HSL spectrum studio, rainbow hue slider,
 * format switcher, and compact responsive layouts for tight spaces.
 *
 * @author Aayush Goyal
 * @version 0.2.0
 * @modified 2026-09-25
 */
export function ColorPicker({
    value = '#EF767A',
    onChange,
    label = 'Color',
    className,
    presets = DEFAULT_PRESETS,
    showPresets = true,
    showEyedropper = true,
    showCopy = true,
    mode = 'popover',
    disabled = false
}: ColorPickerProps) {
    const fullHex = normalizeHex(value);

    // Maintain HSV state locally so dragging Hue doesn't reset when saturation is 0
    const [hsv, setHsv] = React.useState<HSV>(() => {
        const rgb = hexToRgb(fullHex);
        return rgbToHsv(rgb.r, rgb.g, rgb.b);
    });

    const [hasCopied, setHasCopied] = React.useState(false);
    const [hasEyeDropper, setHasEyeDropper] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    // Sync HSV when external value changes
    React.useEffect(() => {
        const rgb = hexToRgb(fullHex);
        const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        setHsv((prev) => {
            // Preserve Hue if saturation is zero (e.g. black/white/grey)
            if (nextHsv.s === 0) {
                return { ...nextHsv, h: prev.h };
            }
            return nextHsv;
        });
    }, [fullHex]);

    // Check Eyedropper API availability
    React.useEffect(() => {
        setHasEyeDropper(
            typeof window !== 'undefined' && 'EyeDropper' in window
        );
    }, []);

    const handleHsvChange = (newHsv: HSV) => {
        setHsv(newHsv);
        const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
        const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
        onChange(newHex);
    };

    const handleCopy = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (disabled) return;
        try {
            await navigator.clipboard.writeText(fullHex);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 1800);
        } catch {
            // Fallback if clipboard fails
        }
    };

    const handleEyeDropper = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (disabled || !hasEyeDropper) return;
        try {
            // @ts-expect-error EyeDropper is a standard browser API not yet in all TS DOM declarations
            const eyeDropper = new window.EyeDropper();
            const result = await eyeDropper.open();
            if (result?.sRGBHex) {
                const pickedHex = normalizeHex(result.sRGBHex);
                const rgb = hexToRgb(pickedHex);
                const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                setHsv(nextHsv);
                onChange(pickedHex);
            }
        } catch {
            // User cancelled eyedropper
        }
    };

    // Quick text input change on the compact trigger bar
    const handleTriggerInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const clean = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
        if (clean.length === 3 || clean.length === 6) {
            const nextHex = normalizeHex(clean);
            const rgb = hexToRgb(nextHex);
            const nextHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
            setHsv(nextHsv);
            onChange(nextHex);
        }
    };

    // If inline mode requested, render full studio directly in-place
    if (mode === 'inline') {
        return (
            <div
                className={cn(
                    'font-body border-stroke-base-primary bg-bg-raised-primary flex w-full min-w-0 flex-col gap-2.5 rounded-xl border p-3 shadow-xs',
                    disabled && 'pointer-events-none opacity-60',
                    className
                )}
            >
                {label && (
                    <div className="flex items-center justify-between">
                        <Label className="tracking-wider uppercase">
                            {label}
                        </Label>
                        <div className="border-stroke-base-primary bg-bg-flat-primary flex items-center gap-1.5 rounded-md border px-2 py-0.5">
                            <span
                                className="size-2 rounded-full border border-black/10 dark:border-white/20"
                                style={{ backgroundColor: fullHex }}
                            />
                            <span className="text-text-secondary font-mono text-[11px] font-medium tracking-tight">
                                {fullHex}
                            </span>
                        </div>
                    </div>
                )}
                <ColorStudio
                    hsv={hsv}
                    onChangeHsv={handleHsvChange}
                    currentHex={fullHex}
                    presets={presets}
                    showPresets={showPresets}
                    disabled={disabled}
                />
            </div>
        );
    }

    // Default: Responsive compact trigger with floating modern Popover
    return (
        <div
            className={cn(
                'font-body flex w-full min-w-0 flex-col gap-2.5',
                disabled && 'pointer-events-none opacity-60',
                className
            )}
        >
            {/* Header / Label */}
            {label && (
                <div className="flex items-center justify-between">
                    <span className="text-text-secondary font-body text-xs font-semibold tracking-wider uppercase">
                        {label}
                    </span>
                    <div className="border-stroke-base-primary bg-bg-flat-primary flex items-center gap-1.5 rounded-md border px-2 py-0.5">
                        <span
                            className="size-2 rounded-full border border-black/10 dark:border-white/20"
                            style={{ backgroundColor: fullHex }}
                        />
                        <span className="text-text-secondary font-mono text-[11px] font-medium tracking-tight">
                            {fullHex}
                        </span>
                    </div>
                </div>
            )}

            {/* Responsive Input & Controls Trigger Row */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex w-full min-w-0 items-center gap-2">
                    {/* Color Swatch Trigger */}
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            title="Open color spectrum studio"
                            aria-label="Pick color"
                            disabled={disabled}
                            className={cn(
                                'group border-stroke-raised-secondary bg-bg-base-primary relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border p-0.5 shadow-xs transition-all duration-150',
                                'hover:border-stroke-active-accent-primary hover:scale-[1.03] active:scale-95',
                                'focus-visible:ring-stroke-active-secondary focus-visible:ring-2 focus-visible:outline-none',
                                isOpen &&
                                    'border-stroke-active-accent-primary ring-stroke-active-accent-primary/20 ring-2'
                            )}
                        >
                            <span
                                className="size-full rounded-[6px] border border-black/10 transition-shadow dark:border-white/15"
                                style={{ backgroundColor: fullHex }}
                            />
                        </button>
                    </PopoverTrigger>

                    {/* Hex Text Field */}
                    <div
                        className={cn(
                            'border-stroke-base-primary bg-bg-flat-primary flex h-9 min-w-0 flex-1 items-center rounded-lg border px-2.5 shadow-xs transition-colors',
                            'focus-within:border-stroke-active-accent-primary focus-within:ring-bg-active-fill-accent-primary/20 focus-within:ring-2'
                        )}
                    >
                        <span className="text-text-tertiary mr-1 font-mono text-xs font-bold select-none">
                            #
                        </span>
                        <input
                            type="text"
                            value={fullHex.replace(/^#/, '')}
                            onChange={handleTriggerInputChange}
                            placeholder="EF767A"
                            maxLength={6}
                            disabled={disabled}
                            spellCheck={false}
                            className="text-text-primary placeholder:text-text-tertiary selection:bg-bg-active-fill-accent-primary/30 w-full min-w-0 bg-transparent font-mono text-xs font-semibold tracking-wider uppercase outline-none"
                            aria-label="Hex color value"
                        />
                    </div>

                    {/* Eyedropper Button */}
                    {showEyedropper && hasEyeDropper && (
                        <button
                            type="button"
                            onClick={handleEyeDropper}
                            disabled={disabled}
                            title="Pick color from screen"
                            aria-label="Eyedropper"
                            className={cn(
                                'border-stroke-base-primary bg-bg-flat-primary text-text-secondary flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all duration-150',
                                'hover:border-stroke-raised-primary hover:bg-bg-raised-secondary hover:text-text-primary active:scale-95',
                                'focus-visible:ring-stroke-active-secondary focus-visible:ring-2 focus-visible:outline-none'
                            )}
                        >
                            <Pipette className="size-4" />
                        </button>
                    )}

                    {/* Copy Button */}
                    {showCopy && (
                        <button
                            type="button"
                            onClick={handleCopy}
                            disabled={disabled}
                            title={hasCopied ? 'Copied!' : 'Copy Hex'}
                            aria-label="Copy color hex"
                            className={cn(
                                'border-stroke-base-primary bg-bg-flat-primary text-text-secondary flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all duration-150',
                                'hover:border-stroke-raised-primary hover:bg-bg-raised-secondary hover:text-text-primary active:scale-95',
                                'focus-visible:ring-stroke-active-secondary focus-visible:ring-2 focus-visible:outline-none',
                                hasCopied &&
                                    'border-stroke-success text-text-success bg-bg-success'
                            )}
                        >
                            {hasCopied ? (
                                <Check className="animate-in zoom-in-50 text-text-success size-4 duration-150" />
                            ) : (
                                <Copy className="size-4" />
                            )}
                        </button>
                    )}
                </div>

                {/* Floating Studio Popover */}
                <PopoverContent
                    align="start"
                    sideOffset={8}
                    className="border-stroke-base-primary bg-bg-raised-primary/95 text-text-primary w-64 max-w-[calc(100vw-2rem)] rounded-xl border p-3 shadow-xl backdrop-blur-md"
                >
                    <ColorStudio
                        hsv={hsv}
                        onChangeHsv={handleHsvChange}
                        currentHex={fullHex}
                        presets={presets}
                        showPresets={showPresets}
                        disabled={disabled}
                    />
                </PopoverContent>
            </Popover>

            {/* Quick Preset Swatches Bar (underneath trigger) */}
            {showPresets && presets && presets.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {presets.map((preset) => {
                        const normalizedPreset = normalizeHex(preset);
                        const isSelected = fullHex === normalizedPreset;
                        const light = isLightColor(normalizedPreset);

                        return (
                            <button
                                key={preset}
                                type="button"
                                title={preset}
                                aria-label={`Select color ${preset}`}
                                disabled={disabled}
                                onClick={() => {
                                    const nextRgb = hexToRgb(normalizedPreset);
                                    const nextHsv = rgbToHsv(
                                        nextRgb.r,
                                        nextRgb.g,
                                        nextRgb.b
                                    );
                                    setHsv(nextHsv);
                                    onChange(normalizedPreset);
                                }}
                                className={cn(
                                    'group relative flex size-6 cursor-pointer items-center justify-center rounded-md border transition-all duration-150',
                                    'hover:scale-110 active:scale-90',
                                    'focus-visible:ring-stroke-active-secondary focus-visible:ring-2 focus-visible:outline-none',
                                    isSelected
                                        ? 'border-stroke-active-accent-primary ring-stroke-active-accent-primary ring-offset-bg-base-primary z-10 scale-105 shadow-xs ring-2 ring-offset-2'
                                        : 'hover:border-stroke-active-accent-primary border-black/10 dark:border-white/15'
                                )}
                                style={{ backgroundColor: preset }}
                            >
                                {isSelected && (
                                    <Check
                                        className={cn(
                                            'size-3 stroke-[2.5] drop-shadow-xs',
                                            light
                                                ? 'text-gun-metal-1100'
                                                : 'text-white'
                                        )}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ColorPicker;
