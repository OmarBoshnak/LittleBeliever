const BASE_URL = 'https://api.alquran.cloud/v1';

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  juz: number;
  text: string;
  audio?: string;
  translation?: string;
}

export type ArabicEdition = 'quran-uthmani';

export type AudioEdition =
  | 'audio-mp3'
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

type JsonResponse<T> = { data: T };

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const message = `Qur'an API request failed (${response.status})`;
    throw new Error(message);
  }

  const payload = (await response.json()) as JsonResponse<T>;
  return payload.data;
}

export const getAllSurahs = async (): Promise<SurahMeta[]> => {
  return fetchJson<SurahMeta[]>(`${BASE_URL}/surah`);
};

export const getSurahFull = async (
  surahNumber: number,
  opts: {
    arabicEdition?: ArabicEdition;
    translationEdition?: TranslationEdition;
    audioEdition?: AudioEdition;
  } = {},
): Promise<Ayah[]> => {
  const {
    arabicEdition = 'quran-uthmani',
    translationEdition = 'en.asad',
    audioEdition = 'audio-mp3',
  } = opts;

  const editions = `${arabicEdition},${audioEdition},${translationEdition}`;
  const data = await fetchJson<any>(
    `${BASE_URL}/surah/${surahNumber}/editions/${editions}`,
  );

  const [arabic, audio, translation] = data as [any, any, any];

  return arabic.ayahs.map((ayah: any, index: number) => ({
    number: ayah.number,
    numberInSurah: ayah.numberInSurah,
    juz: ayah.juz,
    text: ayah.text,
    audio: audio?.ayahs?.[index]?.audio,
    translation: translation?.ayahs?.[index]?.text,
  }));
};

export const getJuz = async (n: number) => {
  return fetchJson<any>(`${BASE_URL}/juz/${n}/quran-uthmani`);
};

export interface JuzMeta {
  juz: number;
  surahCount: number;
  ayahCount: number;
  surahs: {
    number: number;
    name: string;
    englishName: string;
  }[];
}

export const getAllJuzMeta = async (): Promise<JuzMeta[]> => {
  const tasks = Array.from({ length: 30 }, (_, index) => index + 1).map(
    async juzNumber => {
      const data = await getJuz(juzNumber);
      const uniqueSurahNumbers = [
        ...new Set(data.ayahs.map((ayah: any) => ayah.surah.number)),
      ];

      return {
        juz: juzNumber,
        surahCount: uniqueSurahNumbers.length,
        ayahCount: data.ayahs.length,
        surahs: uniqueSurahNumbers.map(number => ({
          number,
          name: data.surahs[String(number)]?.name ?? `سورة ${number}`,
          englishName:
            data.surahs[String(number)]?.englishName ?? `Surah ${number}`,
        })),
      } as JuzMeta;
    },
  );

  return Promise.all(tasks);
};

export interface SearchMatch {
  text: string;
  number: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
}

export const searchQuran = async (
  query: string,
  lang: 'en' | 'ar' = 'en',
): Promise<SearchMatch[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `${BASE_URL}/search/${encoded}/all/${lang}`;
    const data = await fetchJson<any>(url);
    return data.matches ?? [];
  } catch (error) {
    console.warn("Qur'an search failed", error);
    return [];
  }
};
