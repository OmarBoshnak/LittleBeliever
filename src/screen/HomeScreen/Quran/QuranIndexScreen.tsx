import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootstackParamList, Routes } from '../../../MainNavigation/Routes.tsx';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import { useTheme } from '../../../theme/ThemeContext.tsx';
import { Card } from '../../../component/Card.tsx';
import { Button } from '../../../component/Button.tsx';
import { Progress } from '../../../component/Progress.tsx';
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  ChevronRight,
  Lock,
} from 'lucide-react-native';
import {
  getAllJuzMeta,
  getAllSurahs,
  type JuzMeta,
  type SurahMeta,
} from '../../../api/quranApi.ts';
import { useQuranBookmarks } from '../../../hooks/useQuranBookmarks.ts';
import { useAppSelector } from '../../../redux/hooks.ts';
import { borderRadius, fontSize, spacing } from '../../../theme/spacing.ts';

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

type TabType = 'surah' | 'bookmarks';

export const QuranIndexScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const { t, language } = useLanguage();
  const { colors } = useTheme();
  const {
    bookmarks,
    progress,
    loading: bookmarksLoading,
  } = useQuranBookmarks();
  const isPremium = useAppSelector(state => state.subscription.isPremium);

  const [activeTab, setActiveTab] = useState<TabType>('surah');
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [surahsData, juzData] = await Promise.all([
        getAllSurahs(),
        getAllJuzMeta(),
      ]);
      setSurahs(surahsData);
    } catch (err: any) {
      setError(err.message || t.networkError);
      Alert.alert(t.networkError, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSurahSelect = (surah: SurahMeta) => {
    // First 4 surahs are free, rest require premium
    const isLocked = !isPremium && surah.number > 4;

    if (isLocked) {
      Alert.alert(
        t.unlockQuran || 'Premium Content',
        t.unlockWithPremium || 'Subscribe to unlock this surah',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: t.upgradeToPremium || 'Subscribe',
            onPress: () => navigation.navigate(Routes.SubscriberScreen),
          },
        ],
      );
      return;
    }

    navigation.navigate(Routes.QuranReaderScreen, {
      surahNumber: surah.number,
      surahName: surah.englishName,
      surahNameArabic: surah.name,
      isSubscribed: isPremium,
    });
  };

  const handleJuzSelect = (juz: JuzMeta) => {
    if (!juz.surahs.length) return;

    const firstSurah = juz.surahs[0];
    const surah = surahs.find(s => s.number === firstSurah.number);

    if (surah) {
      navigation.navigate(Routes.QuranReaderScreen, {
        surahNumber: surah.number,
        surahName: surah.englishName,
        surahNameArabic: surah.name,
        juzNumber: juz.juz,
        isSubscribed: isPremium,
      });
    }
  };

  const handleBookmarkSelect = (bookmark: any) => {
    navigation.navigate(Routes.QuranReaderScreen, {
      surahNumber: bookmark.surahNumber,
      surahName: bookmark.surahName,
      surahNameArabic: bookmark.surahNameArabic,
      startAyah: bookmark.ayahNumber,
      isSubscribed: isPremium,
    });
  };

  const renderSurahTab = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {surahs.map(surah => {
          const lastRead = progress[surah.number];
          const hasBookmark = bookmarks.some(
            b => b.surahNumber === surah.number,
          );
          const isLocked = !isPremium && surah.number > 4;

          return (
            <TouchableOpacity
              key={surah.number}
              onPress={() => handleSurahSelect(surah)}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.surahCard,
                  ...(isLocked ? [styles.lockedCard] : []),
                ]}
              >
                {/* Continue Reading Badge */}
                {lastRead && lastRead.ayahNumber > 0 && (
                  <View style={styles.continueBadge}>
                    <Text style={styles.continueBadgeText}>
                      {t.continue || 'Continue'}
                    </Text>
                  </View>
                )}

                <View style={styles.surahCardContent}>
                  {/* Surah Number Circle */}
                  <View style={styles.surahNumberContainer}>
                    <View
                      style={[
                        styles.surahNumberCircle,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text style={styles.surahNumberText}>{surah.number}</Text>
                    </View>
                    {isLocked && (
                      <View style={styles.lockBadge}>
                        <Lock size={12} color="#fff" />
                      </View>
                    )}
                  </View>

                  {/* Surah Info */}
                  <View style={styles.surahInfo}>
                    <View style={styles.surahNameRow}>
                      <Text
                        style={[
                          styles.surahNameArabic,
                          { color: colors.foreground },
                        ]}
                      >
                        {surah.name}
                      </Text>
                      {hasBookmark && (
                        <Bookmark
                          size={16}
                          color={colors.primary}
                          fill={colors.primary}
                          style={{ marginTop: 20 }}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.surahNameEnglish,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {surah.englishName}
                    </Text>
                    <View style={styles.surahMeta}>
                      <View
                        style={[
                          styles.revelationBadge,
                          {
                            backgroundColor:
                              surah.revelationType === 'Meccan'
                                ? colors.chart3 + '40'
                                : colors.chart1 + '40',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.revelationText,
                            {
                              color:
                                surah.revelationType === 'Meccan'
                                  ? '#B45309'
                                  : colors.primary,
                            },
                          ]}
                        >
                          {surah.revelationType === 'Meccan'
                            ? t.meccan
                            : t.medinan}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.verseCount,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        • {surah.numberOfAyahs} {t.versesLabel || 'verses'}
                      </Text>
                    </View>

                    {/* Progress Bar */}
                    {lastRead && lastRead.ayahNumber > 0 && (
                      <View style={styles.progressContainer}>
                        <Progress
                          value={
                            (lastRead.ayahNumber / surah.numberOfAyahs) * 100
                          }
                        />
                        <Text
                          style={[
                            styles.progressText,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          Ayah {lastRead.ayahNumber + 1} of{' '}
                          {surah.numberOfAyahs}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderBookmarksTab = () => {
    if (bookmarksLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (bookmarks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconContainer,
              { backgroundColor: colors.muted },
            ]}
          >
            <Bookmark size={40} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            No Bookmarks Yet
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.mutedForeground }]}
          >
            Bookmark verses as you read to save them here
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {bookmarks.map((bookmark, index) => {
          const surah = surahs.find(s => s.number === bookmark.surahNumber);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleBookmarkSelect(bookmark)}
              activeOpacity={0.7}
            >
              <Card style={styles.bookmarkCard}>
                <View style={styles.bookmarkContent}>
                  <View
                    style={[
                      styles.bookmarkNumberCircle,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.bookmarkNumberText}>
                      {bookmark.surahNumber}
                    </Text>
                  </View>
                  <View style={styles.bookmarkInfo}>
                    <Text
                      style={[
                        styles.bookmarkSurahName,
                        { color: colors.foreground },
                      ]}
                    >
                      {bookmark.surahNameArabic}
                    </Text>
                    <Text
                      style={[
                        styles.bookmarkSurahEnglish,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {bookmark.surahName} • Ayah {bookmark.ayahNumber}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.mutedForeground} />
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Button
          variant="ghost"
          size="icon"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.foreground} />
        </Button>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            {t.quranReading}
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.mutedForeground }]}
          >
            {activeTab === 'surah' && (t.selectSurah || 'Select a Surah')}
            {activeTab === 'bookmarks' && 'Your Saved Content'}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View
        style={[
          styles.tabsContainer,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'surah' && [
              styles.activeTab,
              { backgroundColor: colors.primary },
            ],
          ]}
          onPress={() => setActiveTab('surah')}
        >
          <BookOpen
            size={16}
            color={activeTab === 'surah' ? '#fff' : colors.mutedForeground}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'surah' ? '#fff' : colors.mutedForeground,
              },
            ]}
          >
            Surah
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'bookmarks' && [
              styles.activeTab,
              { backgroundColor: colors.primary },
            ],
          ]}
          onPress={() => setActiveTab('bookmarks')}
        >
          <Bookmark
            size={16}
            color={activeTab === 'bookmarks' ? '#fff' : colors.mutedForeground}
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'bookmarks' ? '#fff' : colors.mutedForeground,
              },
            ]}
          >
            Saved
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'surah' && renderSurahTab()}
      {activeTab === 'bookmarks' && renderBookmarksTab()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.xs,
  },
  activeTab: {
    borderRadius: borderRadius.xl,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahCard: {
    marginBottom: spacing.md,
  },
  lockedCard: {
    opacity: 0.75,
  },
  continueBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: '#7ec4cf',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    zIndex: 1,
  },
  continueBadgeText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  surahCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  surahNumberContainer: {
    position: 'relative',
  },
  surahNumberCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahNumberText: {
    color: '#fff',
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#6B7280',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surahInfo: {
    flex: 1,
  },
  surahNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  surahNameArabic: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    flex: 1,
  },
  surahNameEnglish: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  surahMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  revelationBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  revelationText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  verseCount: {
    fontSize: fontSize.xs,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressText: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  bookmarkCard: {
    marginBottom: spacing.md,
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bookmarkNumberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkNumberText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  bookmarkInfo: {
    flex: 1,
  },
  bookmarkSurahName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  bookmarkSurahEnglish: {
    fontSize: fontSize.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
