import { Search } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext.tsx';
import { StyleSheet, TextInput, View } from 'react-native';
import { borderRadius, spacing } from '../theme/spacing.ts';

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  textAlign,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  textAlign?: 'left' | 'right';
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.border }]}>
      <Search color={colors.primary} size={18} />
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        autoFocus={false}
        textAlign={textAlign}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.md,
    marginHorizontal: spacing.md,
  },
  input: { flex: 1, paddingVertical: 10, marginLeft: 8 },
});

export default SearchBar;
