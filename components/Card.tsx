import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSettings } from '@/lib/settings';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  elevation?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'imagebutton';
  style?: StyleProp<ViewStyle>;
};

export function Card({
  children,
  onPress,
  elevation = false,
  accessibilityLabel,
  accessibilityRole,
  style,
}: CardProps) {
  const { theme } = useSettings();

  const cardStyle: ViewStyle = {
    backgroundColor: elevation ? theme.colors.surfaceElevated : theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    shadowColor: '#1A2B4A',
    shadowOffset: { width: 0, height: elevation ? 4 : 2 },
    shadowOpacity: elevation ? 0.12 : 0.06,
    shadowRadius: elevation ? 12 : 6,
    elevation: elevation ? 4 : 2,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole={accessibilityRole ?? 'button'}
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          cardStyle,
          { transform: [{ scale: pressed ? 0.98 : 1 }] },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}
