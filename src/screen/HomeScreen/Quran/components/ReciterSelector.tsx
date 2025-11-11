import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../../../theme/ThemeContext.tsx';
import { spacing, borderRadius, fontSize } from '../../../../theme/spacing.ts';

export interface Reciter {
  id: string;
  name: string;
  nameArabic?: string;
  description?: string;
  backendId?: number; // Backend numeric ID
}

const reciters: Reciter[] = [
  {
    id: 'ar.abdurrahmaansudais',
    name: 'Abdur-Rahman As-Sudais',
    nameArabic: 'عبد الرحمن السديس',
    description: 'Imam of Masjid al-Haram',
    backendId: 2,
  },
  {
    id: 'ar.alafasy',
    name: 'Mishary Al-Afasy',
    nameArabic: 'مشاري العفاسي',
    description: 'Beautiful and clear recitation',
    backendId: 2,
  },
  {
    id: 'ar.husary',
    name: 'Mahmoud Al-Husary',
    nameArabic: 'محمود الحصري',
    description: 'Educational style',
    backendId: 3,
  },
  {
    id: 'ar.minshawi',
    name: 'Mohamed Al-Minshawi',
    nameArabic: 'محمد المنشاوي',
    description: 'Melodious voice',
    backendId: 4,
  },
  {
    id: 'ar.mahermuaiqly',
    name: 'Maher Al Muaiqly',
    nameArabic: 'ماهر المعيقلي',
    description: 'Soothing recitation',
    backendId: 2,
  },
  {
    id: 'ar.shaatree',
    name: 'Abu Bakr Al-Shatri',
    nameArabic: 'أبو بكر الشاطري',
    description: 'Default reciter',
    backendId: 7,
  },
];

interface ReciterSelectorProps {
  selectedReciter: Reciter;
  onSelect: (reciter: Reciter) => void;
}

export const ReciterSelector: React.FC<ReciterSelectorProps> = ({
  selectedReciter,
  onSelect,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[styles.label, { color: colors.mutedForeground }]}
      >
        Select Reciter:
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {reciters.map((reciter) => {
          const isSelected = selectedReciter.id === reciter.id;
          return (
            <TouchableOpacity
              key={reciter.id}
              onPress={() => onSelect(reciter)}
              style={[
                styles.reciterCard,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected
                    ? colors.primary + '10'
                    : colors.card,
                },
              ]}
            >
              {reciter.nameArabic && (
                <Text
                  style={[
                    styles.reciterNameArabic,
                    {
                      color: isSelected ? colors.primary : colors.foreground,
                    },
                  ]}
                >
                  {reciter.nameArabic}
                </Text>
              )}
              <Text
                style={[
                  styles.reciterName,
                  {
                    color: isSelected ? colors.primary : colors.foreground,
                  },
                ]}
              >
                {reciter.name}
              </Text>
              {isSelected && (
                <View style={styles.checkIcon}>
                  <Check size={16} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export { reciters };

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontSize: fontSize.xs,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  reciterCard: {
    minWidth: 140,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    alignItems: 'center',
  },
  reciterNameArabic: {
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  reciterName: {
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  checkIcon: {
    marginTop: spacing.xs,
  },
});



