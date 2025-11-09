import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Bookmark, ChevronRight, Search } from 'lucide-react-native';

import { RootstackParamList, Routes } from '../../../MainNavigation/Routes.tsx';
import { useTheme } from '../../../theme/ThemeContext.tsx';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../../theme/spacing.ts';
import { Card } from '../../../component/Card.tsx';
import { Input } from '../../../component/Input.tsx';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '../../../component/QuranComponent/Tabs.tsx';
import { useQuranBookmarks } from '../../../hooks/useQuranBookmarks.ts';
import {
  getAllJuzMeta,
  getAllSurahs,
  JuzMeta,
  SurahMeta,
} from '../../../api/quranApi';
import { Progress } from '../../../component/Progress.tsx';
import { useNavigation } from '@react-navigation/native';
import GradientBackground from '../../../component/GradientBackground.tsx';

const HEADER_GRADIENT = ['#c8e6f566', '#fdfcf866', '#f9d9a766'];

const stripLatinDiacritics = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Arabic-Indic/Persian digits → 0-9
const normalizeArabicDigits = (s: string) =>
  s
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

// unify Arabic, remove tashkeel, kashida, and tolerant taa marbuta
const normalizeArabicLetters = (s: string) =>
  s
    // harakat & Quranic marks
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // tatweel
    .replace(/\u0640/g, '')
    // letter variants
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    // taa marbuta ~ ha
    .replace(/ة/g, 'ه');

const normalizeForSearch = (s: string) =>
  stripLatinDiacritics(normalizeArabicLetters(normalizeArabicDigits(s)))
    .toLowerCase()
    .trim();

interface SurahListItem {
  number: number;
  nameArabic: string;
  englishName: string;
  englishTranslation: string;
  ayahCount: number;
  revelationType: 'Meccan' | 'Medinan';
  juz: number;
}

type Section = SectionListData<SurahListItem, { title: string; id: number }>;

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

export const QuranIndexScreen = () => {
  const { colors } = useTheme();
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();
  const {
    bookmarks,
    progress,
    loading: bookmarksLoading,
  } = useQuranBookmarks();

  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [juzMeta, setJuzMeta] = useState<JuzMeta[]>([]);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'saved'>(
    'surah',
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [surahList, juzList] = await Promise.all([
          getAllSurahs(),
          getAllJuzMeta(),
        ]);
        setSurahs(surahList);
        setJuzMeta(juzList);
      } catch (err) {
        console.warn("Failed to load Qur'an meta", err);
        setError(t.networkError);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [t.networkError]);

  const surahMap = useMemo(() => {
    return surahs.reduce<Record<number, SurahMeta>>((acc, item) => {
      acc[item.number] = item;
      return acc;
    }, {});
  }, [surahs]);

  const surahToJuz = useMemo(() => {
    const map = new Map<number, number>();
    juzMeta.forEach(juz => {
      juz.surahs.forEach(surah => {
        if (!map.has(surah.number)) {
          map.set(surah.number, juz.juz);
        }
      });
    });
    return map;
  }, [juzMeta]);

  const buildItem = React.useCallback(
    (surahNumber: number, juzNumber: number): SurahListItem | null => {
      const meta = surahMap[surahNumber];
      if (!meta) {
        return null;
      }

      return {
        number: meta.number,
        nameArabic: meta.name,
        englishName: meta.englishName,
        englishTranslation: meta.englishNameTranslation,
        ayahCount: meta.numberOfAyahs,
        revelationType: meta.revelationType,
        juz: juzNumber,
      };
    },
    [surahMap],
  );

  const normalizedQuery = useMemo(() => normalizeForSearch(query), [query]);

  // pre-normalize surah searchable fields (perf win)
  const normalizedSurahs = useMemo(
    () =>
      surahs.map(s => ({
        number: s.number,
        nAr: normalizeForSearch(s.name),
        nEn: normalizeForSearch(s.englishName),
        nTr: normalizeForSearch(s.englishNameTranslation),
        nNum: normalizeForSearch(String(s.number)),
      })),
    [surahs],
  );

  const sections = useMemo(() => {
    if (!surahs.length || !juzMeta.length) {
      return [] as Section[];
    }

    if (normalizedQuery) {
      const matches = normalizedSurahs
        .filter(
          s =>
            s.nAr.includes(normalizedQuery) ||
            s.nEn.includes(normalizedQuery) ||
            s.nTr.includes(normalizedQuery) ||
            s.nNum.includes(normalizedQuery),
        )
        .map(s => buildItem(s.number, surahToJuz.get(s.number) ?? 1))
        .filter((item): item is SurahListItem => Boolean(item));

      return matches.length
        ? [
            {
              data: matches,
              title: t.searchResults,
              id: 0,
            },
          ]
        : [];
    }

    // Default: grouped by Juz
    return juzMeta
      .map(juz => {
        const data = juz.surahs
          .map(surah => buildItem(surah.number, juz.juz))
          .filter((item): item is SurahListItem => Boolean(item));
        return {
          data,
          title: `${t.juzLabel} ${juz.juz}`,
          id: juz.juz,
        };
      })
      .filter(section => section.data.length > 0);
  }, [
    surahs,
    juzMeta,
    normalizedQuery,
    normalizedSurahs,
    surahToJuz,
    buildItem,
    t.juzLabel,
    t.searchResults,
  ]);

  const handleSelectSurah = (item: SurahListItem) => {
    navigation.navigate(Routes.QuranReaderScreen, {
      surahNumber: item.number,
      surahName: item.englishName,
      surahNameArabic: item.nameArabic,
      juzNumber: item.juz,
    });
  };

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
      {section.title}
    </Text>
  );

  const renderSurahItem: SectionListRenderItem<SurahListItem, Section> = ({
    item,
  }) => {
    const progressEntry = progress[item.number];
    const completedRatio = progressEntry
      ? ((progressEntry.ayahNumber + 1) / item.ayahCount) * 100
      : 0;

    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => handleSelectSurah(item)}
      >
        <Card
          style={[styles.surahCard, { backgroundColor: `${colors.card}F5` }]}
        >
          <View
            style={[
              styles.surahRow,
              { flexDirection: isRTL ? 'row-reverse' : 'row' },
            ]}
          >
            <View
              style={[styles.badge, { backgroundColor: `${colors.primary}1A` }]}
            >
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {item.number}
              </Text>
            </View>
            <View
              style={[styles.surahInfo, isRTL && { alignItems: 'flex-end' }]}
            >
              <Text
                style={[styles.surahNameArabic, { color: colors.foreground }]}
              >
                {item.nameArabic}
              </Text>
              <Text
                style={[
                  styles.surahNameEnglish,
                  { color: colors.mutedForeground },
                ]}
              >
                {item.englishName}
              </Text>
              <View style={styles.metaRow}>
                <Text style={[styles.metaText, { color: colors.secondary }]}>
                  {item.revelationType === 'Meccan' ? t.meccan : t.medinan}
                </Text>
                <View style={styles.dot} />
                <Text
                  style={[styles.metaText, { color: colors.mutedForeground }]}
                >
                  {item.ayahCount} {t.versesLabel}
                </Text>
              </View>
              {progressEntry && (
                <View style={styles.progressRow}>
                  <Progress value={completedRatio} style={styles.progressBar} />
                  <Text
                    style={[
                      styles.progressLabel,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {t.resumeAt} {progressEntry.ayahNumber + 1}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const handleBookmarkPress = (bookmark: (typeof bookmarks)[number]) => {
    navigation.navigate(Routes.QuranReaderScreen, {
      surahNumber: bookmark.surahNumber,
      surahName: bookmark.surahName,
      surahNameArabic: bookmark.surahNameArabic,
      startAyah: bookmark.ayahNumber,
    });
  };

  const renderBookmark = ({ item }: { item: (typeof bookmarks)[number] }) => (
    <Card
      style={[styles.bookmarkCard, { backgroundColor: `${colors.card}F2` }]}
    >
      <TouchableOpacity
        onPress={() => handleBookmarkPress(item)}
        activeOpacity={0.85}
        style={[
          styles.bookmarkRow,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        <View
          style={[
            styles.bookmarkBadge,
            { backgroundColor: `${colors.primary}1A` },
          ]}
        >
          <Bookmark size={18} color={colors.primary} />
        </View>
        <View
          style={[styles.bookmarkInfo, isRTL && { alignItems: 'flex-end' }]}
        >
          <Text style={[styles.bookmarkSurah, { color: colors.foreground }]}>
            {item.surahNameArabic}
          </Text>
          <Text
            style={[styles.bookmarkSubtitle, { color: colors.mutedForeground }]}
          >
            {item.surahName} • {t.ayahLabel} {item.ayahNumber + 1}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.mutedForeground} />
      </TouchableOpacity>
    </Card>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            {t.loading}
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            {error}
          </Text>
        </View>
      );
    }

    if (activeTab === 'surah') {
      return (
        <SectionList
          sections={sections}
          keyExtractor={item => `${item.number}-${item.juz}`}
          renderItem={renderSurahItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={styles.sectionListContent}
        />
      );
    }

    if (bookmarksLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }

    if (!bookmarks.length) {
      return (
        <View style={styles.emptyState}>
          <View
            style={[
              styles.emptyBadge,
              { backgroundColor: `${colors.primary}15` },
            ]}
          >
            <Bookmark size={28} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            {t.noBookmarksTitle}
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.mutedForeground }]}
          >
            {t.noBookmarksSubtitle}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={bookmarks}
        keyExtractor={item => `${item.surahNumber}-${item.ayahNumber}`}
        renderItem={renderBookmark}
        contentContainerStyle={styles.sectionListContent}
      />
    );
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.md,
          },
        ]}
      >
        <GradientBackground
          colors={HEADER_GRADIENT}
          style={styles.gredient}
          opacity={1}
        />

        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={[styles.backButton, { backgroundColor: `${colors.card}AA` }]}
          >
            <ArrowLeft
              size={20}
              color={colors.primary}
              style={isRTL ? styles.flip : undefined}
            />
          </TouchableOpacity>
          <View style={styles.headerText}>
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

        <Card
          style={[styles.searchCard, { backgroundColor: `${colors.card}F5` }]}
        >
          <View style={styles.searchRow}>
            <Search size={18} color={colors.mutedForeground} />
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder={t.searchSurah}
              style={[
                styles.searchInput,
                { textAlign: isRTL ? 'right' : 'left', borderWidth: 0 },
              ]}
            />
          </View>
        </Card>
      </View>

      <View style={styles.tabsWrapper}>
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as typeof activeTab)}
        >
          <TabsList style={styles.tabsList}>
            <TabsTrigger value="surah">
              <Text style={styles.tabLabel}>{t.surahTabLabel}</Text>
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Text style={styles.tabLabel}>{t.savedTabLabel}</Text>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </View>

      <View style={styles.contentWrapper}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    marginBottom: 10,
  },
  gredient: {
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    height: 220,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    rowGap: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
  },
  searchCard: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    backgroundColor: 'transparent',
  },
  tabsWrapper: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
  },
  tabsList: {
    width: '100%',
  },
  tabLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionListContent: {
    paddingBottom: spacing.xl * 3,
    rowGap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  surahCard: {
    padding: spacing.md,
    borderWidth: 0,
  },
  surahRow: {
    alignItems: 'center',
    columnGap: spacing.md,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  surahInfo: {
    flex: 1,
    rowGap: spacing.xs,
  },
  surahNameArabic: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
  surahNameEnglish: {
    fontSize: fontSize.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.xs,
  },
  metaText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
  },
  progressRow: {
    marginTop: spacing.xs,
    rowGap: spacing.xs,
  },
  progressBar: {
    height: 6,
  },
  progressLabel: {
    fontSize: fontSize.xs,
  },
  bookmarkCard: {
    padding: spacing.md,
    borderWidth: 0,
  },
  bookmarkRow: {
    alignItems: 'center',
    columnGap: spacing.md,
  },
  bookmarkBadge: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkInfo: {
    flex: 1,
    rowGap: spacing.xs,
  },
  bookmarkSurah: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  bookmarkSubtitle: {
    fontSize: fontSize.sm,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.sm,
  },
  errorText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
    rowGap: spacing.md,
  },
  emptyBadge: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  flip: {
    transform: [{ scaleX: -1 }],
  },
});
