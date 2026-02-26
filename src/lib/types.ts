enum TextVariant {
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Body,
    Button,
    Subtitle1,
    Subtitle2,
    Caption,
    Custom
}

interface TextProps {
    variant?: TextVariant;
    color?: string;
    children: React.ReactNode;
}

export { TextVariant };
export type { TextProps };
