import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext.tsx';
import { useEffect, useRef } from 'react';
import { borderRadius } from '../theme/spacing.ts';

interface ProgressProps {
  value?: number;
  style?: ViewStyle;
  trackStyle?: ViewStyle;
  indicatorStyle?: ViewStyle;
}

export const Progress = ({
  value = 0,
  style,
  trackStyle,
  indicatorStyle,
}: ProgressProps) => {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: Math.max(0, Math.min(100, value)),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, value]);

  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.track,
        { backgroundColor: `${colors.primary}33` },
        style,
        trackStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.indicator,
          { backgroundColor: colors.primary, width },
          indicatorStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
