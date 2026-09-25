// SECTION: Components
export {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from './components/accordion';
export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    AlertDialogTrigger
} from './components/alert-dialog';
export {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage
} from './components/avatar';
export { Badge, badgeVariants } from './components/badge';
export {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from './components/breadcrumb';
export { Button, buttonVariants } from './components/button';
export {
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
    buttonGroupVariants
} from './components/button-group';
export { Calendar, CalendarDayButton } from './components/calendar';
export { Checkbox } from './components/checkbox';
export {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuPortal,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger
} from './components/context-menu';
export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
} from './components/dialog';
export {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerPortal,
    DrawerTitle,
    DrawerTrigger
} from './components/drawer';
export {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from './components/dropdown-menu';
export {
    ElementaProvider,
    useElementa,
    type ElementaProviderProps
} from './components/elementa-provider';
export {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle
} from './components/field';
export {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from './components/hover-card';
export { Input } from './components/input';
export {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea
} from './components/input-group';
export {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot
} from './components/input-otp';
export {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemGroup,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
    ItemTitle
} from './components/item';
export { Label } from './components/label';
export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from './components/pagination';
export {
    Popover,
    PopoverAnchor,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger
} from './components/popover';
export { Progress } from './components/progress';
export { RadioGroup, RadioGroupItem } from './components/radio-group';
export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from './components/select';
export { Separator } from './components/separator';
export {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from './components/sheet';
export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar
} from './components/sidebar';
export { Skeleton } from './components/skeleton';
export { Slider } from './components/slider';
export { Toaster as Sonner } from './components/sonner';
export { Spinner } from './components/spinner';
export {
    Stepper,
    StepperContent,
    StepperContentItem,
    StepperIndicatorList,
    StepperIndicatorListItem
} from './components/stepper';
export { Switch } from './components/switch';
export {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from './components/table';
export {
    Tabs,
    TabsContent,
    TabsList,
    tabsListVariants,
    TabsTrigger
} from './components/tabs';
export { Text, TextVariant } from './components/text';
export { Textarea } from './components/textarea';
export { Toggle, toggleVariants } from './components/toggle';
export { ToggleGroup, ToggleGroupItem } from './components/toggle-group';
export {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from './components/tooltip';
// !SECTION: Components

// SECTION: Blocks
export { default as EmptyState } from './blocks/empty-state';
export { default as EnergySwitcher } from './blocks/energy-switcher';
export { default as ErrorState } from './blocks/error-state';
export { default as LoadingState } from './blocks/loading-state';
export {
    default as ThemeSwitcher,
    type TransitionVariant
} from './blocks/theme-switcher';
// export {
//     default as PixelSwap,
//     type PixelSwapProps,
//     type PixelSwapPattern,
//     type PixelSwapTrigger
// } from './blocks/pixel-swap';
// export {
//     default as Galaxy,
//     type GalaxyProps
// } from './blocks/background/galaxy';
export { default as CodeBlock } from './blocks/code/code-block';
export {
    SquigglyText,
    type SquigglyTextProps
} from './blocks/text/squiggly-text';
// export {
//     default as LightspunCurvedCarousel,
//     LightspunCurvedCarousel as LightspunCurvedCarouselNamed,
//     type LightspunCurvedCarouselProps,
//     type SlideItem
// } from './blocks/carousel/LightspunCurvedCarousel';
// !SECTION: Blocks

// SECTION: Hooks
export { useIsMobile } from './hooks/use-mobile';
// !SECTION: Hooks

// SECTION: Store & Preferences
export { default as useUserPreferenceStore } from '../lib/store/user-preference-store';
// !SECTION: Store & Preferences

// SECTION: Constants & Enums
export { APP_PLATFORMS, ENERGY_THEMES } from '../lib/constants';
export {
    CODE_LANGUAGES,
    ENERGY,
    HTTP_STATUS_CODE,
    THEME,
    UI_STATE
} from '../lib/types/enums';
export type {
    AppPlatform,
    ColorMapping,
    Icon,
    IconCategory,
    UIEnergy
} from '../lib/types/model';
// !SECTION: Constants & Enums

// SECTION: Utilities
export {
    getDataFromLocalStorage,
    setDataInLocalStorage
} from '../lib/local-storage';
export { copyToClipboard } from '../lib/text';
export { cn } from '../lib/utils';
// !SECTION: Utilities
