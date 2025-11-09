import React, {
  cloneElement,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme/ThemeContext.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../theme/spacing.ts';

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SheetContext = createContext<SheetContextValue | null>(null);

const useSheetContext = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be wrapped in <Sheet>');
  }
  return context;
};

interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const Sheet = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: SheetProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open);
    }
  }, [open]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open],
  );

  const value = useMemo(
    () => ({
      open: internalOpen,
      setOpen: handleOpenChange,
    }),
    [handleOpenChange, internalOpen],
  );

  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  );
};

// 1) Constrain the child to have an optional onPress
type PressableChild = React.ReactElement<{
  onPress?: (...args: any[]) => void;
}>;

interface TriggerProps {
  children: PressableChild;
}

// 2) Use the typed child in Trigger and Close
export const SheetTrigger = ({ children }: TriggerProps) => {
  const { setOpen } = useSheetContext();
  const originalOnPress = children.props.onPress;

  return cloneElement(children, {
    onPress: (...args: any[]) => {
      originalOnPress?.(...args);
      setOpen(true);
    },
  });
};

export const SheetClose = ({ children }: TriggerProps) => {
  const { setOpen } = useSheetContext();
  const originalOnPress = children.props.onPress;

  return cloneElement(children, {
    onPress: (...args: any[]) => {
      originalOnPress?.(...args);
      setOpen(false);
    },
  });
};

interface SheetContentProps {
  children: ReactNode;
  side?: 'bottom' | 'right';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const SCREEN = Dimensions.get('window');

export const SheetContent = ({
  children,
  side = 'bottom',
  style,
  contentStyle,
}: SheetContentProps) => {
  const { open, setOpen } = useSheetContext();
  const { colors } = useTheme();
  const [visible, setVisible] = useState(open);
  const translate = useRef(new Animated.Value(open ? 0 : 1)).current;

  useEffect(() => {
    if (open) {
      setVisible(true);
    }

    Animated.timing(translate, {
      toValue: open ? 0 : 1,
      duration: 240,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !open) {
        setVisible(false);
      }
    });
  }, [open, translate]);

  const handleClose = () => setOpen(false);

  if (!visible) {
    return null;
  }

  const translateStyle =
    side === 'right'
      ? {
          transform: [
            {
              translateX: translate.interpolate({
                inputRange: [0, 1],
                outputRange: [0, SCREEN.width],
              }),
            },
          ],
        }
      : {
          transform: [
            {
              translateY: translate.interpolate({
                inputRange: [0, 1],
                outputRange: [0, SCREEN.height],
              }),
            },
          ],
        };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose} />
      <Animated.View style={[styles.container, translateStyle]}>
        <View
          style={[
            styles.content,
            { backgroundColor: colors.card },
            side === 'right' ? styles.alignRight : styles.alignBottom,
            style,
          ]}
        >
          <View style={[styles.inner, contentStyle]}>{children}</View>
        </View>
      </Animated.View>
    </Modal>
  );
};

interface SimpleViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SheetHeader = ({ children, style }: SimpleViewProps) => (
  <View style={[styles.section, styles.header, style]}>{children}</View>
);

export const SheetFooter = ({ children, style }: SimpleViewProps) => (
  <View style={[styles.section, style]}>{children}</View>
);

interface TextProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export const SheetTitle = ({ children, style }: TextProps) => {
  const { colors } = useTheme();
  return (
    <Text style={[styles.title, { color: colors.foreground }, style]}>
      {children}
    </Text>
  );
};

export const SheetDescription = ({ children, style }: TextProps) => {
  const { colors } = useTheme();
  return (
    <Text
      style={[styles.description, { color: colors.mutedForeground }, style]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  alignBottom: {
    borderTopLeftRadius: borderRadius.xl * 2,
    borderTopRightRadius: borderRadius.xl * 2,
    paddingBottom: spacing.lg,
  },
  alignRight: {
    alignSelf: 'flex-end',
    width: Math.min(SCREEN.width * 0.9, 360),
    borderTopLeftRadius: borderRadius.xl * 2,
    borderBottomLeftRadius: borderRadius.xl * 2,
    height: '100%',
  },
  content: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  inner: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 3,
  },
  section: {
    rowGap: spacing.sm,
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  description: {
    fontSize: fontSize.sm,
  },
});
