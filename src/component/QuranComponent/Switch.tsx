import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme/ThemeContext.tsx';
import { borderRadius } from '../../theme/spacing.ts';

interface SwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 22;
const THUMB_SIZE = 20;

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
}) => {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, value]);

  const trackColors = useMemo(
    () => ({
      active: colors.primary,
      inactive: `${colors.border}80`,
      thumbActive: colors.primaryForeground,
      thumbInactive: colors.cardForeground,
    }),
    [colors],
  );

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, TRACK_WIDTH - THUMB_SIZE - 2],
  });

  const handlePress = () => {
    if (disabled || !onValueChange) {
      return;
    }
    onValueChange(!value);
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: value ? trackColors.active : trackColors.inactive,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          borderRadius: borderRadius.full,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: value
              ? trackColors.thumbActive
              : trackColors.thumbInactive,
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    justifyContent: 'center',
    padding: 1,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
