import React, { useMemo, useState } from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Lock, Search } from 'lucide-react-native';

import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { useTheme } from '../../theme/ThemeContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { Card } from '../../component/Card.tsx';
import { Input } from '../../component/Input.tsx';
import { borderRadius, fontSize, fontWeight, spacing } from '../../theme/spacing.ts';
import { getSurahsByJuz, SurahPreview } from '../../data/quran.ts';
import { LockedModal } from './components/LockedModal.tsx';

const HEADER_GRADIENT = ['#c8e6f566', '#fdfcf866', '#f9d9a766'];

type ScreenProps = NativeStackScreenProps<
  RootstackParamList,
  'QuranSurahListScreen'
>;

type Section = SectionListData<SurahPreview, { title: string; id: number }>;

export const QuranSurahListScreen = ({ navigation, route }: ScreenProps) => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [lockedModalVisible, setLockedModalVisible] = useState(false);

  const isSubscribed = route.params?.isSubscribed ?? false;

  const sections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const groups = getSurahsByJuz();

    if (!normalizedQuery) {
      return groups.map(group => ({
        data: group.surahs,
        title: group.title,
        id: group.id,
      }));
    }

    return groups
      .map(group => {
        const filtered = group.surahs.filter(surah => {
          const englishMatch = surah.name.toLowerCase().includes(normalizedQuery);
          const arabicMatch = surah.nameArabic.includes(query.trim());
          const numberMatch = `${surah.id}`.includes(normalizedQuery);
          return englishMatch || arabicMatch || numberMatch;
        });

        return {
          data: filtered,
          title: group.title,
          id: group.id,
        };
      })
      .filter(section => section.data.length > 0);
  }, [query]);

  const handleSelectSurah = (surah: SurahPreview) => {
    if (surah.locked && !isSubscribed) {
      setLockedModalVisible(true);
      return;
    }

    navigation.navigate(Routes.QuranReaderScreen, {
      surahId: surah.id,
      isSubscribed,
    });
  };

  const renderHeader = () => (
    <LinearGradient
      colors={HEADER_GRADIENT}
      style={[styles.headerContainer, { paddingTop: insets.top + spacing.xl }]}
    >
      <View style={styles.headerTopRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={[styles.backButton, { backgroundColor: `${colors.card}90` }]}
        >
          <ArrowLeft
            size={20}
            color={colors.primary}
            style={isRTL ? styles.iconFlipped : undefined}
          />
        </TouchableOpacity>
        <View style={styles.headerTextWrapper}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>
            {t.quranLibrary}
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.mutedForeground }]}
          >
            {t.quranLibrarySubtitle}
          </Text>
        </View>
      </View>

      <Card style={[styles.searchCard, { backgroundColor: `${colors.card}EE` }]}>
        <View
          style={[
            styles.searchRow,
            { flexDirection: isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <Search size={18} color={colors.mutedForeground} />
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder={t.searchSurah}
            style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
          />
        </View>
      </Card>
    </LinearGradient>
  );

  const renderSection = ({ section }: { section: Section }) => (
    <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
      {t.juzLabel} {section.id}
    </Text>
  );

  const renderItem: SectionListRenderItem<SurahPreview, Section> = ({ item }) => {
    const verseCount = item.verses.length;

    return (
      <TouchableOpacity activeOpacity={0.75} onPress={() => handleSelectSurah(item)}>
        <Card style={[styles.surahCard, { backgroundColor: `${colors.card}F5` }]}
        >
          <View
            style={[styles.surahRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <View style={[styles.surahBadge, { backgroundColor: `${colors.primary}20` }]}
            >
              <Text style={[styles.surahBadgeText, { color: colors.primary }]}> 
                {item.id}
              </Text>
            </View>
            <View style={[styles.surahInfo, isRTL && { alignItems: 'flex-end' }]}
            >
              <Text style={[styles.surahName, { color: colors.foreground }]}
              >
                {isRTL ? item.nameArabic : item.name}
              </Text>
              <Text
                style={[styles.surahMeta, { color: colors.mutedForeground }]}
              >
                {verseCount} {t.versesLabel}
              </Text>
            </View>
            {item.locked && !isSubscribed ? (
              <Lock size={18} color={colors.mutedForeground} />
            ) : null}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const flatSections = sections as unknown as Section[];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}
    >
      <SectionList
        sections={flatSections}
        keyExtractor={item => `${item.id}`}
        ListHeaderComponent={renderHeader}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) =>
          section.data.length > 0 ? (
            <View style={styles.sectionHeaderWrapper}>
              {renderSection({ section: section as Section })}
            </View>
          ) : null
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {t.noSurahFound}
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.mutedForeground }]}
            >
              {t.noSurahFoundSubtitle}
            </Text>
          </View>
        }
      />

      <LockedModal
        visible={lockedModalVisible}
        onClose={() => setLockedModalVisible(false)}
        onUpgrade={() => {
          setLockedModalVisible(false);
          navigation.navigate(Routes.SubscriberScreen);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  searchCard: {
    borderWidth: 0,
  },
  searchRow: {
    alignItems: 'center',
    gap: spacing.md,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl * 2,
    gap: spacing.lg,
  },
  sectionHeaderWrapper: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  surahCard: {
    borderWidth: 0,
    marginTop: spacing.sm,
  },
  surahRow: {
    alignItems: 'center',
    gap: spacing.md,
  },
  surahBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surahBadgeText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  surahMeta: {
    fontSize: fontSize.sm,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  iconFlipped: {
    transform: [{ rotate: '180deg' }],
  },
});
