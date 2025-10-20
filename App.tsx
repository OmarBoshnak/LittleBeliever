/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { MainNavigation } from './src/MainNavigation/MainNavigation.tsx';
import { ThemeProvider } from './src/theme/ThemeContext.tsx';
import { StatusBar } from 'react-native';
import { LanguageProvider } from './src/context/LanguageContext.tsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { configureGoogleSignIn } from './src/firebase/config.ts';
import { Provider } from 'react-redux';
import { store } from './src/redux/store.ts';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  useEffect(() => {
    // Initialize Google Sign-In when app starts
    configureGoogleSignIn();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <LanguageProvider>
              <NavigationContainer>
                <StatusBar
                  translucent
                  backgroundColor="transparent"
                  barStyle="dark-content"
                />
                <MainNavigation />
              </NavigationContainer>
            </LanguageProvider>
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
