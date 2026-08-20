import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSettings } from '@/lib/settings';

type FadeInProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
};

export function FadeIn({ children, style, delay = 0 }: FadeInProps) {
  const { settings } = useSettings();
  const opacity = useRef(new Animated.Value(settings.reducedAnimation || settings.calmMode ? 1 : 0)).current;

  useEffect(() => {
    if (settings.reducedAnimation || settings.calmMode) return;
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  if (settings.reducedAnimation || settings.calmMode) {
    return <View style={style}>{children}</View>;
  }

  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
}

type SlideInProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  from?: 'left' | 'right' | 'bottom';
};

export function SlideIn({ children, style, from = 'bottom' }: SlideInProps) {
  const { settings } = useSettings();
  const translate = useRef(new Animated.Value(settings.reducedAnimation || settings.calmMode ? 0 : 30)).current;

  useEffect(() => {
    if (settings.reducedAnimation || settings.calmMode) return;
    Animated.timing(translate, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  if (settings.reducedAnimation || settings.calmMode) {
    return <View style={style}>{children}</View>;
  }

  const transforms: any[] = [];
  if (from === 'bottom') transforms.push({ translateY: translate });
  if (from === 'left') transforms.push({ translateX: translate });
  if (from === 'right') transforms.push({ translateX: Animated.multiply(translate, -1) });

  return <Animated.View style={[{ transform: transforms }, style]}>{children}</Animated.View>;
}
