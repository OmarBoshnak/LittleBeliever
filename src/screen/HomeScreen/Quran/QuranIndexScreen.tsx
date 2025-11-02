import { useTheme } from '../../../theme/ThemeContext.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootstackParamList } from '../../../MainNavigation/Routes.tsx';
import { useNavigation } from '@react-navigation/core';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  getAllJuzMeta,
  getAllSurahs,
  SurahMeta,
} from '../../../api/quranApi.ts';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import GradientBackground from '../../../component/GradientBackground.tsx';
import SearchBar from '../../../component/SearchBar.tsx';
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from '../../../theme/spacing.ts';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import { ArrowLeft } from 'lucide-react-native';
import { Card } from '../../../component/Card.tsx';

type NavigationProp = NativeStackNavigationProp<RootstackParamList>;
const HEADER_GRADIENT = ['#c8e6f566', '#fdfcf866', '#f9d9a766'];

type Tab = 'surah' | 'juz';

const QuranIndexScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { t, isRTL, language } = useLanguage();
  const [tab, setTab] = useState<Tab>('surah');
  const [search, setSearch] = useState('');
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [juzsMeta, setJuzsMeta] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, j] = await Promise.all([getAllSurahs(), getAllJuzMeta()]);
        setSurahs(s);
        setJuzsMeta(j);
      } catch (error) {
        console.error('Failed to load Quran data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSurahs = useMemo(() => {
    if (!search.trim()) return surahs;

    if (language === 'ar') {
      // Arabic search
      return surahs.filter(s => s.name.includes(search.trim()));
    } else {
      // English search
      return surahs.filter(s =>
        s.englishName.toLowerCase().includes(search.toLowerCase().trim()),
      );
    }
  }, [search, surahs, language]);

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        color={colors.primary}
        size="large"
      />
    );

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <GradientBackground colors={HEADER_GRADIENT} opacity={0.8} />

      {/* Tabs */}
      <View style={{ paddingTop: insets.top + spacing.md }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}
        >
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

        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setTab('surah')}
            style={[
              styles.tabBtn,
              tab === 'surah' && {
                borderBottomColor: colors.primary,
                borderBottomWidth: 1,
              },
            ]}
          >
            <Text
              style={[
                styles.tabTxt,
                {
                  color:
                    tab === 'surah' ? colors.primary : colors.mutedForeground,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {language === 'ar' ? 'السور' : 'Surahs'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('juz')}
            style={[
              styles.tabBtn,
              tab === 'juz' && {
                borderColor: colors.primary,
                borderBottomWidth: 1,
              },
            ]}
          >
            <Text
              style={[
                styles.tabTxt,
                {
                  color:
                    tab === 'juz' ? colors.primary : colors.mutedForeground,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {language === 'ar' ? 'الأجزاء' : 'Juz'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Search */}
        <SearchBar
          textAlign={isRTL ? 'right' : 'left'}
          value={search}
          onChangeText={setSearch}
          placeholder={
            tab === 'surah'
              ? language === 'ar'
                ? 'ابحث عن سورة…'
                : 'Search surah…'
              : language === 'ar'
              ? 'ابحث داخل الجزء…'
              : 'Search inside Juz…'
          }
        />
      </View>

      {/* List */}
      {tab === 'surah' ? (
        <FlatList
          data={filteredSurahs}
          inverted={isRTL}
          keyExtractor={i => i.number.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { borderColor: colors.primary },
                isRTL && { alignItems: 'flex-end' },
              ]}
              onPress={() => {}}
            >
              <Card
                style={[
                  styles.surahCard,
                  { backgroundColor: `${colors.card}F5` },
                ]}
              >
                <View
                  style={[
                    styles.surahRow,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  <View
                    style={[
                      styles.surahInfo,
                      isRTL && { alignItems: 'flex-end' },
                    ]}
                  >
                    <Text
                      style={[styles.surahName, { color: colors.foreground }]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.en,
                        {
                          color: colors.foreground,
                          textAlign: isRTL ? 'right' : 'left',
                        },
                      ]}
                    >
                      {item.englishNameTranslation}
                    </Text>
                    <Text
                      style={[
                        styles.surahMeta,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {language === 'ar'
                        ? `${item.numberOfAyahs} آيات • ${
                            item.revelationType === 'Meccan' ? 'مكية' : 'مدنية'
                          }`
                        : `${item.numberOfAyahs} verses • ${item.revelationType}`}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={juzsMeta}
          inverted={isRTL}
          keyExtractor={i => i.juz.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                { borderColor: colors.primary },
                isRTL && { alignItems: 'flex-end' },
              ]}
            >
              <Text
                style={[
                  styles.en,
                  {
                    color: colors.primary,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {language === 'ar'
                  ? `الجزء ${item.juz} • ${item.ayahCount} آيات`
                  : `Juz ${item.juz} • ${item.ayahCount} ayahs`}
              </Text>

              <View
                style={[
                  styles.surahRow,
                  isRTL && { flexDirection: 'row-reverse' },
                ]}
              >
                {item.surahs.map((s: any) => (
                  <TouchableOpacity
                    key={s.number}
                    style={[
                      styles.pill,
                      {
                        borderColor: colors.border,
                        backgroundColor: `${colors.primary}10`,
                      },
                    ]}
                    onPress={() => {}}
                  >
                    <Text
                      style={{
                        color: colors.foreground,
                        textAlign: isRTL ? 'right' : 'left',
                      }}
                    >
                      {language === 'ar' ? s.name : s.englishName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomLeftRadius: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabTxt: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: 10,
    marginHorizontal: spacing.md,
  },
  ar: {
    fontSize: 20,
  },
  en: {
    fontSize: 14,
    marginVertical: spacing.sm,
  },
  surahRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  iconFlipped: {
    transform: [{ rotate: '180deg' }],
  },
  headerTextWrapper: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  surahCard: {
    borderWidth: 1,
    marginTop: spacing.sm,
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
});

export default QuranIndexScreen;
