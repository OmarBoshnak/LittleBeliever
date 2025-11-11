import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../../component/Card.tsx';
import { useTheme } from '../../../../theme/ThemeContext.tsx';
import { spacing, borderRadius, fontSize } from '../../../../theme/spacing.ts';

interface SurahHeaderProps {
  surahName: string;
  surahNameArabic: string;
  revelationType: string;
  numberOfAyahs: number;
  juz?: number;
}

export const SurahHeader: React.FC<SurahHeaderProps> = ({
  surahName,
  surahNameArabic,
  revelationType,
  numberOfAyahs,
  juz,
}) => {
  const { colors } = useTheme();

  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        <Text
          style={[
            styles.arabicName,
            { color: colors.foreground },
          ]}
        >
          {surahNameArabic}
        </Text>
        <Text
          style={[styles.englishName, { color: colors.mutedForeground }]}
        >
          {surahName}
        </Text>
        <View style={styles.meta}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  revelationType === 'Meccan'
                    ? colors.chart3 + '40'
                    : colors.chart1 + '40',
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color:
                    revelationType === 'Meccan' ? '#B45309' : colors.primary,
                },
              ]}
            >
              {revelationType === 'Meccan' ? 'Meccan' : 'Medinan'}
            </Text>
          </View>
          {juz && (
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              • Juz {juz}
            </Text>
          )}
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            • {numberOfAyahs} verses
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  content: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  arabicName: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  englishName: {
    fontSize: fontSize.base,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  metaText: {
    fontSize: fontSize.xs,
  },
});



