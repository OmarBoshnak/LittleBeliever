import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootstackParamList, Routes } from './Routes.tsx';
import SplashScreen from '../screen/SplashScreen/SplashScreen.tsx';
import { LanguageThemeScreen } from '../screen/LanguageThemeScreen/LanguageThemeScreen.tsx';
import { OnBoardingScreen } from '../screen/OnBoardingScreen/OnBoardingScreen.tsx';
import { AuthScreen } from '../screen/AuthScreen/AuthScreen.tsx';
import { SubscriptionScreen } from '../screen/SubscriptionScreen/SubscriptionScreen.tsx';
import { HomeScreen } from '../screen/HomeScreen/HomeScreen.tsx';
import { LearnIslamScreen } from '../screen/LearnIslam/LearnIslamScreen.tsx';
import { ArkanAlIslamScreen } from '../screen/LearnIslam/ArkanAlIslamScreen.tsx';
import { WuduScreen } from '../screen/LearnIslam/WuduScreen.tsx';
import { PrayerScreen } from '../screen/LearnIslam/PrayerScreen.tsx';
import { QuranSurahListScreen } from '../screen/Quran/QuranSurahListScreen.tsx';
import { QuranReaderScreen } from '../screen/Quran/QuranReaderScreen.tsx';

const Stack = createNativeStackNavigator<RootstackParamList>();

export const MainNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.SplashScreen}
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.LanguageThemeScreen}
        component={LanguageThemeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.OnBoardingScreen}
        component={OnBoardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.AuthScreen}
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.SubscriberScreen}
        component={SubscriptionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.HomeScreen}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.LearnIslamScreen}
        component={LearnIslamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.ArkanAlIslamScreen}
        component={ArkanAlIslamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.WuduScreen}
        component={WuduScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.PrayerScreen}
        component={PrayerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.QuranSurahListScreen}
        component={QuranSurahListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.QuranReaderScreen}
        component={QuranReaderScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
