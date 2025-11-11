import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bookmark, Pause, Play, Repeat, Volume2 } from 'lucide-react-native';
import { useTheme } from '../../../../theme/ThemeContext.tsx';
import { borderRadius, spacing } from '../../../../theme/spacing.ts';

interface ReadingControlsProps {
  isPlaying: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isBookmarked: boolean;
  onPlayPause: () => void;
  onRepeat: () => void;
  onBookmark: () => void;
  onReciterSelect: () => void;
  reciterName: string;
}

export const ReadingControls: React.FC<ReadingControlsProps> = ({
  isPlaying,
  repeatMode,
  isBookmarked,
  onPlayPause,
  onRepeat,
  onBookmark,
  onReciterSelect,
  reciterName,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderTopColor: colors.border },
      ]}
    >
      {/* Reciter Selector */}
      <TouchableOpacity
        onPress={onReciterSelect}
        style={[styles.reciterButton, { backgroundColor: colors.muted }]}
      >
        <Volume2 size={16} color={colors.foreground} />
        <View style={styles.reciterInfo}>
          <Text
            style={[styles.reciterText, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {reciterName}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={onPlayPause}
          style={[styles.controlButton, { backgroundColor: colors.primary }]}
        >
          {isPlaying ? (
            <Pause size={20} color="#fff" />
          ) : (
            <Play size={20} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRepeat}
          style={[
            styles.controlButton,
            {
              backgroundColor:
                repeatMode !== 'none' ? colors.primary + '20' : colors.muted,
            },
          ]}
        >
          <Repeat
            size={18}
            color={
              repeatMode !== 'none' ? colors.primary : colors.mutedForeground
            }
          />
          {repeatMode === 'one' && (
            <View
              style={[styles.repeatBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.repeatBadgeText}>1</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onBookmark}
          style={[
            styles.controlButton,
            {
              backgroundColor: isBookmarked
                ? colors.primary + '20'
                : colors.muted,
            },
          ]}
        >
          <Bookmark
            size={18}
            color={isBookmarked ? colors.primary : colors.mutedForeground}
            fill={isBookmarked ? colors.primary : 'none'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    gap: spacing.md,
  },
  reciterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  reciterInfo: {
    flex: 1,
  },
  reciterText: {
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repeatBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});
