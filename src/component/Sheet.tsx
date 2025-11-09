import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../theme/ThemeContext.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../theme/spacing.ts';

type TabsContextValue = {
  value: string | null;
  setValue: (nextValue: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be wrapped in <Tabs>');
  }
  return context;
};

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Tabs = ({
  value,
  defaultValue,
  onValueChange,
  children,
  style,
}: TabsProps) => {
  const [internalValue, setInternalValue] = useState<string | null>(
    value ?? defaultValue ?? null,
  );

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [onValueChange, value],
  );

  const contextValue = useMemo(
    () => ({
      value: internalValue,
      setValue: handleChange,
    }),
    [handleChange, internalValue],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <View style={style}>{children}</View>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const TabsList = ({ children, style }: TabsListProps) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.list,
        {
          backgroundColor: `${colors.border}33`,
          borderRadius: borderRadius.xl,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const TabsTrigger = ({
  value,
  children,
  style,
  textStyle,
}: TabsTriggerProps) => {
  const { value: activeValue, setValue } = useTabsContext();
  const { colors } = useTheme();
  const isActive = activeValue === value;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={() => setValue(value)}
      style={({ pressed }) => [
        styles.trigger,
        {
          backgroundColor: isActive ? colors.card : 'transparent',
          borderRadius: borderRadius.xl,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <View style={styles.triggerContent}>
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text
            style={[
              styles.triggerLabel,
              {
                color: isActive ? colors.foreground : colors.mutedForeground,
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const TabsContent = ({ value, children, style }: TabsContentProps) => {
  const { value: activeValue } = useTabsContext();

  if (activeValue !== value) {
    return null;
  }

  return <View style={style}>{children}</View>;
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    padding: spacing.xs,
    alignSelf: 'center',
  },
  trigger: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: spacing.xs,
  },
  triggerLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
