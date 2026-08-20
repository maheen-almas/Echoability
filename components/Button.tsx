import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useSettings } from '@/lib/settings';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const { theme } = useSettings();

  const variantColors: Record<string, { bg: string; text: string; border: string }> = {
    primary: { bg: theme.colors.primary, text: theme.colors.textOnPrimary, border: theme.colors.primary },
    secondary: { bg: theme.colors.secondary, text: theme.colors.textOnSecondary, border: theme.colors.secondary },
    accent: { bg: theme.colors.accent, text: '#FFFFFF', border: theme.colors.accent },
    success: { bg: theme.colors.success, text: '#FFFFFF', border: theme.colors.success },
    outline: { bg: 'transparent', text: theme.colors.primary, border: theme.colors.primary },
    ghost: { bg: 'transparent', text: theme.colors.primary, border: 'transparent' },
  };

  const sizes: Record<string, { paddingV: number; paddingH: number; fontSize: number; radius: number }> = {
    sm: { paddingV: 8, paddingH: 16, fontSize: theme.typography.fontSizeSm, radius: theme.radius.sm },
    md: { paddingV: 14, paddingH: 24, fontSize: theme.typography.fontSizeMd, radius: theme.radius.md },
    lg: { paddingV: 18, paddingH: 32, fontSize: theme.typography.fontSizeLg, radius: theme.radius.lg },
  };

  const vc = variantColors[variant];
  const sz = sizes[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: vc.bg,
          borderColor: vc.border,
          paddingVertical: sz.paddingV,
          paddingHorizontal: sz.paddingH,
          borderRadius: sz.radius,
          opacity: pressed ? 0.85 : 1,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={vc.text} size="small" />
        ) : (
          <>
            {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
            <Text
              style={{
                color: vc.text,
                fontSize: sz.fontSize,
                fontWeight: '700',
                fontFamily: theme.typography.fontFamilyBold,
              }}
            >
              {title}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },
});
