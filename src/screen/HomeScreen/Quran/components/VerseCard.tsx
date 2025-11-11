import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bookmark, Pause, Play, Share2 } from 'lucide-react-native';
import { Card } from '../../../../component/Card.tsx';
import { useTheme } from '../../../../theme/ThemeContext.tsx';
import { borderRadius, fontSize, spacing } from '../../../../theme/spacing.ts';

interface VerseCardProps {
  verse: {
    text: string;
    translation?: string;
    transliteration?: string;
    tafsir?: string;
  };
  verseNumber: number;
  isBookmarked: boolean;
  isHighlighted: boolean;
  isPlaying: boolean;
  onPress: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onPlay: () => void;
  showTranslation: boolean;
}

export const VerseCard: React.FC<VerseCardProps> = memo(({
  verse,
  verseNumber,
  isBookmarked,
  isHighlighted,
  isPlaying,
  onPress,
  onBookmark,
  onShare,
  onPlay,
  showTranslation,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.container,
        isHighlighted && { backgroundColor: colors.primary + '20' },
      ]}
    >
      <Card style={[styles.card]}>
        {/* Verse Number and Actions */}
        <View style={styles.header}>
          <View
            style={[
              styles.verseNumberCircle,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.verseNumberText}>{verseNumber}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={onPlay} style={styles.actionButton}>
              {isPlaying ? (
                <Pause size={16} color={colors.primary} />
              ) : (
                <Play size={16} color={colors.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onBookmark} style={styles.actionButton}>
              <Bookmark
                size={16}
                color={colors.primary}
                fill={isBookmarked ? colors.primary : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} style={styles.actionButton}>
              <Share2 size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Arabic Text */}
        <Text
          style={[
            styles.arabicText,
            { color: colors.foreground },
            isHighlighted && { color: colors.primary },
          ]}
        >
          {verse.text}
        </Text>

        {/* Transliteration */}
        {verse.transliteration && (
          <Text
            style={[styles.transliteration, { color: colors.mutedForeground }]}
          >
            {verse.transliteration}
          </Text>
        )}

        {/* Translation */}
        {showTranslation && verse.translation && (
          <View
            style={[
              styles.translationContainer,
              { backgroundColor: colors.muted + '40' },
            ]}
          >
            <Text style={[styles.translation, { color: colors.foreground }]}>
              {verse.translation}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memoization
  return (
    prevProps.verse.text === nextProps.verse.text &&
    prevProps.verse.translation === nextProps.verse.translation &&
    prevProps.verseNumber === nextProps.verseNumber &&
    prevProps.isBookmarked === nextProps.isBookmarked &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.showTranslation === nextProps.showTranslation
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  card: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  verseNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumberText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },
  arabicText: {
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * 2,
    textAlign: 'right',
    marginBottom: spacing.md,
    fontFamily: 'System', // You may want to add a custom Arabic font
  },
  transliteration: {
    fontSize: fontSize.sm,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  translationContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  translation: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.5,
    textAlign: 'left',
  },
});
