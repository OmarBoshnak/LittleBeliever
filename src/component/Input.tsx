/**
 * Input Component for React Native
 */
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext.tsx';
import { borderRadius, fontSize, spacing } from '../theme/spacing.ts';

interface InputProps extends TextInputProps {
  error?: string;
}

export const Input = ({ style, error, ...props }: InputProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: error ? colors.destructive : colors.border,
          },
          style,
        ]}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
      {error && (
        <Text style={[styles.errorText, { color: colors.destructive }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.xs,
  },
  errorText: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
