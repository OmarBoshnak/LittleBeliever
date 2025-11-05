export type Verse = {
  arabic: string;
  transliteration: string;
  translation: string;
  tafsir: string;
  audioUrl?: string;
};

export type Surah = {
  id: number;
  name: string;
  nameArabic: string;
  juz: number;
  revelationPlace: 'meccan' | 'medinan';
  verses: Verse[];
  locked?: boolean;
};

export type SurahPreview = Pick<
  Surah,
  'id' | 'name' | 'nameArabic' | 'juz' | 'locked' | 'verses'
>;

export type JuzGroup = {
  id: number;
  title: string;
  surahs: SurahPreview[];
};

const SURAH_DATA: Surah[] = [
  {
    id: 1,
    name: 'Al-Fatiha',
    nameArabic: 'الفاتحة',
    juz: 1,
    revelationPlace: 'meccan',
    locked: false,
    verses: [
      {
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Bismillah ir-Rahman ir-Raheem',
        translation:
          'In the name of Allah, the Most Gracious, the Most Merciful',
        tafsir:
          "We begin every recitation by remembering Allah's beautiful names and mercy.",
        audioUrl: 'https://example.com/audio/001_001.mp3',
      },
      {
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: "Alhamdu lillahi Rabbil 'aalameen",
        translation: 'All praise is due to Allah, Lord of all the worlds',
        tafsir: 'A reminder to be thankful – Allah cares for everything in the universe.',
        audioUrl: 'https://example.com/audio/001_002.mp3',
      },
      {
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Ar-Rahman ir-Raheem',
        translation: 'The Most Gracious, the Most Merciful',
        tafsir: 'Allah is always kind and forgiving – He loves us very much!',
        audioUrl: 'https://example.com/audio/001_003.mp3',
      },
      {
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: "Maliki yawmid-deen",
        translation: 'Master of the Day of Judgment',
        tafsir: 'Allah is the fair Judge who will reward our good deeds.',
        audioUrl: 'https://example.com/audio/001_004.mp3',
      },
      {
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
        translation: 'You alone we worship and You alone we ask for help',
        tafsir: 'We rely only on Allah and show our devotion to Him.',
        audioUrl: 'https://example.com/audio/001_005.mp3',
      },
      {
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdinas-siratal mustaqeem',
        translation: 'Guide us to the straight path',
        tafsir: 'We ask Allah to help us stay on the right path every day.',
        audioUrl: 'https://example.com/audio/001_006.mp3',
      },
      {
        arabic:
          'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration:
          "Siratal ladhina an'amta 'alayhim ghayril maghdubi 'alayhim wala-d-dalleen",
        translation:
          'The path of those who You have blessed, not of those who earned Your anger nor of those who went astray',
        tafsir:
          'We want to follow the footsteps of good people whom Allah loves.',
        audioUrl: 'https://example.com/audio/001_007.mp3',
      },
    ],
  },
  {
    id: 112,
    name: 'Al-Ikhlas',
    nameArabic: 'الإخلاص',
    juz: 30,
    revelationPlace: 'meccan',
    locked: false,
    verses: [
      {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'Qul Huwa Allahu Ahad',
        translation: 'Say: He is Allah, the One',
        tafsir: 'Allah is One – there is no one like Him. He is special and unique!',
        audioUrl: 'https://example.com/audio/112_001.mp3',
      },
      {
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteration: 'Allah us-Samad',
        translation: 'Allah, the Eternal, Absolute',
        tafsir:
          "Allah doesn't need anything, but we all need Him. He is always there for us.",
        audioUrl: 'https://example.com/audio/112_002.mp3',
      },
      {
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: 'Lam yalid wa lam yoolad',
        translation: 'He neither begets nor is born',
        tafsir:
          'Allah has no parents or children. He has always existed and always will!',
        audioUrl: 'https://example.com/audio/112_003.mp3',
      },
      {
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Wa lam yakun lahu kufuwan ahad',
        translation: 'And there is none comparable to Him',
        tafsir: 'There is no one else like Allah – He is truly unique.',
        audioUrl: 'https://example.com/audio/112_004.mp3',
      },
    ],
  },
  {
    id: 113,
    name: 'Al-Falaq',
    nameArabic: 'الفلق',
    juz: 30,
    revelationPlace: 'meccan',
    locked: true,
    verses: [
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteration: "Qul a'udhu bi Rabbil-falaq",
        translation: 'Say: I seek refuge in the Lord of daybreak',
        tafsir:
          'We ask Allah to protect us from bad things, especially when morning comes.',
        audioUrl: 'https://example.com/audio/113_001.mp3',
      },
      {
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transliteration: 'Min sharri ma khalaq',
        translation: 'From the evil of what He created',
        tafsir: 'Allah protects us from anything harmful that exists.',
        audioUrl: 'https://example.com/audio/113_002.mp3',
      },
      {
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliteration: 'Wa min sharri ghasiqin idha waqab',
        translation: 'And from the evil of darkness when it settles',
        tafsir: 'Even when it is dark and scary, Allah is our protector.',
        audioUrl: 'https://example.com/audio/113_003.mp3',
      },
    ],
  },
  {
    id: 114,
    name: 'An-Nas',
    nameArabic: 'الناس',
    juz: 30,
    revelationPlace: 'meccan',
    locked: true,
    verses: [
      {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: "Qul a'udhu bi Rabbin-nas",
        translation: 'Say: I seek refuge in the Lord of mankind',
        tafsir: 'We ask Allah, who is the Lord of all people, to keep us safe.',
        audioUrl: 'https://example.com/audio/114_001.mp3',
      },
      {
        arabic: 'مَلِكِ النَّاسِ',
        transliteration: 'Malikin-nas',
        translation: 'The King of mankind',
        tafsir: 'Allah lovingly rules over all people.',
        audioUrl: 'https://example.com/audio/114_002.mp3',
      },
    ],
  },
];

export const getSurahs = (): SurahPreview[] => {
  return SURAH_DATA.map(({ verses, ...rest }) => ({
    ...rest,
    verses,
  }));
};

export const getSurahById = (id: number): Surah | undefined => {
  return SURAH_DATA.find(surah => surah.id === id);
};

export const getSurahsByJuz = (): JuzGroup[] => {
  const groups = new Map<number, SurahPreview[]>();

  SURAH_DATA.forEach(surah => {
    const existing = groups.get(surah.juz) ?? [];
    existing.push({
      id: surah.id,
      name: surah.name,
      nameArabic: surah.nameArabic,
      juz: surah.juz,
      locked: surah.locked,
      verses: surah.verses,
    });
    groups.set(surah.juz, existing);
  });

  return Array.from(groups.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([juzNumber, surahs]) => ({
      id: juzNumber,
      title: `Juz ${juzNumber}`,
      surahs: surahs.sort((a, b) => a.id - b.id),
    }));
};

export const getSurahAudioSource = (
  surahId: number,
  verseIndex: number,
): string | undefined => {
  const surah = getSurahById(surahId);
  return surah?.verses?.[verseIndex]?.audioUrl;
};
