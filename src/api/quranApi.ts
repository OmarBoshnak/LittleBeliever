import axios from 'axios';

const BASE = 'https://api.alquran.cloud/v1';

// ——— Types ———
export interface SurahMeta {
  number: number;
  name: string; // Arabic (e.g., "الفاتحة")
  englishName: string; // "Al-Faatiha"
  englishNameTranslation: string; // "The Opening"
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  juz: number;
  text: string; // Arabic text
  audio?: string; // audio URL (if fetched from audio edition)
  translation?: string;
}

export type ArabicEdition = 'quran-uthmani';

export type AudioEdition =
  | 'audio-mp3' // (API default audio stream)
  | 'ar.abdulbasitmurattal'
  | 'ar.abdullahbasfar'
  | 'ar.abdurrahmaansudais'
  | 'ar.abdulsamad'
  | 'ar.shaatree'
  | 'ar.ahmedajamy'
  | 'ar.alafasy'
  | 'ar.hanirifai'
  | 'ar.husary'
  | 'ar.husarymujawwad'
  | 'ar.hudhaify'
  | 'ar.ibrahimakhbar'
  | 'ar.mahermuaiqly'
  | 'ar.minshawi'
  | 'ar.minshawimujawwad'
  | 'ar.muhammadayyoub'
  | 'ar.muhammadjibreel'
  | 'ar.saoodshuraym'
  | 'en.walk';

export type TranslationEdition =
  | 'en.asad'
  | 'en.yusufali'
  | 'en.pickthall'
  | 'ar.muyassar';

// ——— Surahs ———
export const getAllSurahs = async (): Promise<SurahMeta[]> => {
  const res = await axios.get(`${BASE}/surah`);
  return res.data.data;
};

// Grab one surah in: Arabic + translation + audio (aligned by index)
export const getSurahFull = async (
  surahNumber: number,
  opts: {
    arabicEdition?: ArabicEdition;
    translationEdition?: TranslationEdition;
    audioEdition?: AudioEdition;
  },
): Promise<Ayah[]> => {
  const {
    arabicEdition = 'quran-uthmani',
    translationEdition = 'en.asad',
    audioEdition = 'audio-mp3',
  } = opts;
  // Combined editions returns array [AR, AUDIO, TRANSLATION]
  const res = await axios.get(
    `${BASE}/surah/${surahNumber}/editions/${arabicEdition},${audioEdition},${translationEdition}`,
  );
  const [ar, au, tr] = res.data.data;

  const out: Ayah[] = ar.ayahs.map((a: any, i: number) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    juz: a.juz,
    text: a.text,
    audio: au?.ayahs?.[i]?.audio,
    translation: tr?.ayahs?.[i]?.text,
  }));
  return out;
};

// ——— Juz ———
// AlQuranCloud has /juz/{n} returning ayahs scattered across surahs.
// We’ll return a compact structure for UI grouping.

export const getJuz = async (n: number) => {
  const res = await axios.get(`${BASE}/juz/${n}/quran-uthmani`);
  return res.data.data;
};

// Gather all 30 juz meta (lightweight for index screen)
// Gather all 30 juz meta (lightweight for index screen)
export const getAllJuzMeta = async () => {
  const tasks = Array.from({ length: 30 }, (_, i) => i + 1).map(async j => {
    const data = await getJuz(j);
    const uniqueSurahNumbers = [
      ...new Set(data.ayahs.map((a: any) => a.surah.number)),
    ];
    return {
      juz: j,
      surahCount: uniqueSurahNumbers.length,
      ayahCount: data.ayahs.length,
      surahs: uniqueSurahNumbers.map(num => ({
        number: num,
        name: data.surahs[String(num)]?.name ?? `سورة ${num}`,
        englishName: data.surahs[String(num)]?.englishName ?? `Surah ${num}`,
      })),
    };
  });
  return Promise.all(tasks);
};

// ——— Search ———

export async function searchQuran(query: string, lang: 'en' | 'ar' = 'en') {
  const res = await axios.get(
    `${BASE}/search/${encodeURIComponent(query)}/all/${lang}`,
  );
  // res.data.data.matches = [{ text, number, surah: {number, name, englishName } ...}]
  return res.data.data.matches || [];
}
