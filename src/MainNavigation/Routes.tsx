export const Routes = {
  SplashScreen: 'SplashScreen',
  LanguageThemeScreen: 'LanguageThemeScreen',
  OnBoardingScreen: 'OnBoardingScreen',
  AuthScreen: 'AuthScreen',
  SubscriberScreen: 'SubscriberScreen',
  HomeScreen: 'HomeScreen',
  LearnIslamScreen: 'LearnIslamScreen',
  ArkanAlIslamScreen: 'ArkanAlIslamScreen',
  WuduScreen: 'WuduScreen',
  PrayScreen: 'PrayScreen',
  QuranIndexScreen: 'QuranIndexScreen',
  QuranReaderScreen: 'QuranReaderScreen',
} as const;

export type RootstackParamList = {
  SplashScreen: undefined;
  LanguageThemeScreen: undefined;
  OnBoardingScreen: undefined;
  AuthScreen: undefined;
  SubscriberScreen: undefined;
  HomeScreen: undefined;
  LearnIslamScreen: undefined;
  ArkanAlIslamScreen: undefined;
  WuduScreen: undefined;
  PrayScreen: undefined;
  QuranIndexScreen: undefined;
  QuranReaderScreen:
    | {
        surahNumber: number;
        surahName?: string;
        surahNameArabic?: string;
        juzNumber?: number;
        startAyah?: number;
        isSubscribed?: boolean;
      }
    | undefined;
};
