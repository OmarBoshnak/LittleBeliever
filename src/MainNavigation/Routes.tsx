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
  PrayerScreen: 'PrayerScreen',
  QuranSurahListScreen: 'QuranSurahListScreen',
  QuranReaderScreen: 'QuranReaderScreen',
} as const;

export type RootstackParamList = {
  SplashScreen: undefined;
  LanguageThemeScreen: undefined;
  OnBoardingScreen: undefined;
  AuthScreen: undefined;
  SubscriberScreen: undefined;
  HomeScreen: undefined;
  LearnIslamScreen: { isSubscribed?: boolean } | undefined;
  ArkanAlIslamScreen: { isSubscribed?: boolean } | undefined;
  WuduScreen: { isSubscribed?: boolean } | undefined;
  PrayerScreen: { isSubscribed?: boolean } | undefined;
  QuranSurahListScreen: { isSubscribed?: boolean } | undefined;
  QuranReaderScreen:
    | { surahId: number; isSubscribed?: boolean }
    | undefined;
};
