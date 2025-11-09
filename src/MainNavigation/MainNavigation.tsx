import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootstackParamList, Routes } from './Routes.tsx';
import SplashScreen from '../screen/SplashScreen/SplashScreen.tsx';
import { LanguageThemeScreen } from '../screen/LanguageThemeScreen/LanguageThemeScreen.tsx';
import { OnBoardingScreen } from '../screen/OnBoardingScreen/OnBoardingScreen.tsx';
import { AuthScreen } from '../screen/AuthScreen/AuthScreen.tsx';
import { SubscriptionScreen } from '../screen/SubscriptionScreen/SubscriptionScreen.tsx';
import { HomeScreen } from '../screen/HomeScreen/HomeScreen.tsx';
import { ArkanAlIslamScreen } from '../screen/HomeScreen/LearnIslam/ArkanAlIslamScreen.tsx';
import { LearnIslamScreen } from '../screen/HomeScreen/LearnIslam/LearnIsalmScreen.tsx';
import { WuduScreen } from '../screen/HomeScreen/LearnIslam/WuduScreen.tsx';
import { PrayScreen } from '../screen/HomeScreen/LearnIslam/PrayScreen.tsx';
import { QuranReaderScreen } from '../screen/HomeScreen/Quran/QuranReadingScreen.tsx';
import { QuranIndexScreen } from '../screen/HomeScreen/Quran/QuranIndexScreen.tsx';

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
        name={Routes.PrayScreen}
        component={PrayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={Routes.QuranIndexScreen}
        component={QuranIndexScreen}
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
