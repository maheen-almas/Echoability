import { StyleSheet, Text, type TextProps } from 'react-native';
import { useSettings } from '@/lib/settings';

type Variant = 'display' | 'title' | 'subtitle' | 'body' | 'caption' | 'label';

type ThemedTextProps = TextProps & {
  variant?: Variant;
  muted?: boolean;
  bold?: boolean;
  color?: string;
};

export function ThemedText({
  variant = 'body',
  muted = false,
  bold = false,
  color,
  style,
  ...rest
}: ThemedTextProps) {
  const { theme } = useSettings();

  const variantStyles: Record<Variant, { fontSize: number; lineHeight: number }> = {
    display: { fontSize: theme.typography.fontSizeXxl, lineHeight: theme.typography.lineHeightHeading },
    title: { fontSize: theme.typography.fontSizeXl, lineHeight: theme.typography.lineHeightHeading },
    subtitle: { fontSize: theme.typography.fontSizeLg, lineHeight: theme.typography.lineHeightHeading },
    body: { fontSize: theme.typography.fontSizeMd, lineHeight: theme.typography.lineHeightBody },
    caption: { fontSize: theme.typography.fontSizeSm, lineHeight: theme.typography.lineHeightBody },
    label: { fontSize: theme.typography.fontSizeXs, lineHeight: theme.typography.lineHeightBody },
  };

  return (
    <Text
      style={[
        {
          fontFamily: theme.typography.fontFamily,
          fontSize: variantStyles[variant].fontSize,
          lineHeight: variantStyles[variant].lineHeight,
          color: color ?? (muted ? theme.colors.textMuted : theme.colors.text),
          fontWeight: bold ? '700' : '400',
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {},
});
