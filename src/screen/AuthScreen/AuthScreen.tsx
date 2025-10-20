import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from '../../component/Button';
import { Input } from '../../component/Input';
import { Card } from '../../component/Card';
import { useTheme } from '../../theme/ThemeContext';
import { fontSize, fontWeight, spacing } from '../../theme/spacing';
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '../../firebase/config';
import {
  setError,
  setGuestMode,
  setLoading,
  setUser,
} from '../../redux/slices/authSlice';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useTwinkleAnimation } from '../../hooks/useAnimatedValue.ts';
import { Lock, Mail, Moon, Star, User } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootstackParamList, Routes } from '../../MainNavigation/Routes.tsx';
import { useNavigation } from '@react-navigation/core';
import GradientBackground from '../../component/GradientBackground.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

const AnimatedStar: React.FC<{
  size: number;
  color: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  delay: number;
}> = ({ size, color, top, left, right, bottom, delay }) => {
  const animatedStyle = useTwinkleAnimation(delay);
  return (
    <Animated.View
      style={[
        { top, left, right, bottom },
        animatedStyle, // ✅ apply animated style
      ]}
    >
      <Star size={size} color={color} fill={color} />
    </Animated.View>
  );
};

export const AuthScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const navigation = useNavigation<NavigationProps>();

  // UI state
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [loading, setLoadingState] = useState(false);

  // Sign Up form fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Log In form fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  /**
   * Handle Sign Up
   * Creates a new user account with Firebase
   */
  const handleSignUp = async () => {
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoadingState(true);
    dispatch(setLoading(true));

    try {
      const user = await signUpWithEmail(
        signUpEmail,
        signUpPassword,
        signUpName,
      );
      dispatch(setUser(user));

      navigation.replace(Routes.SubscriberScreen);
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  /**
   * Handle Log In
   * Signs in with existing credentials
   */
  const handleLogIn = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoadingState(true);
    dispatch(setLoading(true));

    try {
      const user = await signInWithEmail(loginEmail, loginPassword);
      dispatch(setUser(user));
      navigation.replace(Routes.SubscriberScreen);
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert('Log In Failed', error.message);
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  /**
   * Handle Continue as Guest
   * User can explore app without signing in
   */
  const handleContinueAsGuest = () => {
    dispatch(setGuestMode());
    navigation.replace(Routes.HomeScreen);
  };

  /**
   * Handle Google Sign In (Optional)
   * You'll need to implement Google Sign-In separately
   */
  const handleGoogleAuth = async () => {
    setLoadingState(true);
    dispatch(setLoading(true));

    try {
      const user = await signInWithGoogle();
      dispatch(setUser(user));
    } catch (error: any) {
      dispatch(setError(error.message));
      Alert.alert('Google Sign-In Failed', error.message);
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <GradientBackground colors={colors.gradient} />
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <AnimatedStar
            size={21}
            color={colors.secondary}
            delay={1000}
            top={40}
            left={50}
          />
          <AnimatedStar
            size={19}
            top={100}
            right={60}
            color={colors.accent}
            delay={1000}
          />

          <View
            style={[
              styles.iconStyle,
              { backgroundColor: `${colors.primary}1A` },
            ]}
          >
            <Moon size={48} color={colors.primary} />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {mode === 'signup' ? t.signUp : t.signIn}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {t.welcomeSubtitle}
          </Text>
        </View>
        <View style={styles.containerContent}>
          <Card style={styles.card}>
            {mode === 'signup' ? (
              // SIGN UP FORM
              <View style={styles.formContainer}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <User size={16} color={colors.primary} />
                  <Text
                    style={{
                      fontSize: fontSize.base,
                      color: colors.foreground,
                    }}
                  >
                    {t.yourName}
                  </Text>
                </View>
                <Input
                  placeholder={t.yourNamePlaceholder}
                  value={signUpName}
                  onChangeText={setSignUpName}
                  autoCapitalize="words"
                  style={styles.inputStyle}
                />
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <Mail size={16} color={colors.primary} />
                  <Text
                    style={{
                      fontSize: fontSize.base,
                      color: colors.foreground,
                    }}
                  >
                    {t.yourEmail}
                  </Text>
                </View>
                <Input
                  placeholder={t.emailPlaceholder}
                  value={signUpEmail}
                  onChangeText={setSignUpEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.inputStyle}
                />
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <Lock size={16} color={colors.primary} />
                  <Text
                    style={{
                      fontSize: fontSize.base,
                      color: colors.foreground,
                    }}
                  >
                    {t.password}
                  </Text>
                </View>

                <Input
                  placeholder={t.passwordPlaceholder}
                  value={signUpPassword}
                  onChangeText={setSignUpPassword}
                  secureTextEntry
                  style={styles.inputStyle}
                />

                <Button
                  onPress={handleSignUp}
                  disabled={loading}
                  loading={loading}
                  style={styles.primaryButton}
                >
                  {t.createAccount}
                </Button>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View
                    style={[styles.divider, { backgroundColor: colors.border }]}
                  />
                  <Text
                    style={[
                      styles.dividerText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    or
                  </Text>
                  <View
                    style={[styles.divider, { backgroundColor: colors.border }]}
                  />
                </View>

                {/* Google Button */}
                <Button
                  variant="outline"
                  onPress={handleGoogleAuth}
                  style={styles.buttonSpacing}
                >
                  Continue with Google
                </Button>

                {/* Guest Button */}
                <Button
                  variant="outline"
                  onPress={handleContinueAsGuest}
                  style={styles.buttonSpacing}
                >
                  {t.continueAsGuest}
                </Button>

                {/* Switch to Login */}
                <TouchableOpacity
                  onPress={() => setMode('login')}
                  style={styles.switchMode}
                >
                  <Text style={{ color: colors.mutedForeground }}>
                    {t.alreadyHaveAccount}{' '}
                    <Text style={{ color: colors.primary }}>{t.logInHere}</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // LOG IN FORM
              <View style={styles.formContainer}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <User size={16} color={colors.primary} />
                  <Text
                    style={{
                      fontSize: fontSize.base,
                      color: colors.foreground,
                    }}
                  >
                    {t.yourEmail}
                  </Text>
                </View>
                <Input
                  placeholder={t.emailPlaceholder}
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ borderRadius: 20 }}
                />
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                >
                  <Lock size={16} color={colors.primary} />
                  <Text
                    style={{
                      fontSize: fontSize.base,
                      color: colors.foreground,
                    }}
                  >
                    {t.password}
                  </Text>
                </View>
                <Input
                  placeholder={t.passwordPlaceholder}
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry
                  style={styles.inputStyle}
                />

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={{ color: colors.primary }}>
                    {t.forgotPassword}
                  </Text>
                </TouchableOpacity>

                <Button
                  onPress={handleLogIn}
                  disabled={loading}
                  loading={loading}
                  style={styles.primaryButton}
                >
                  {t.signInButton}
                </Button>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View
                    style={[styles.divider, { backgroundColor: colors.border }]}
                  />
                  <Text
                    style={[
                      styles.dividerText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    or
                  </Text>
                  <View
                    style={[styles.divider, { backgroundColor: colors.border }]}
                  />
                </View>

                {/* Google Button */}

                <Button
                  variant="outline"
                  onPress={handleGoogleAuth}
                  style={styles.buttonSpacing}
                >
                  {t.googleButton}
                </Button>

                {/* Guest Button */}
                <Button
                  variant="outline"
                  onPress={handleContinueAsGuest}
                  style={styles.buttonSpacing}
                >
                  {t.continueAsGuest}
                </Button>

                {/* Switch to Sign Up */}
                <TouchableOpacity
                  onPress={() => setMode('signup')}
                  style={styles.switchMode}
                >
                  <Text style={{ color: colors.mutedForeground }}>
                    {t.dontHaveAccount}{' '}
                    <Text style={{ color: colors.primary }}>
                      {t.signUpHere}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        </View>
        {/* Auth Card */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  iconStyle: {
    width: 90,
    height: 90,
    borderRadius: 100, // Perfect circle (width/2)
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,

    // Shadow for Android
    elevation: 5,
  },
  containerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  card: {
    padding: spacing.xl,
    borderWidth: 3,
  },
  formContainer: {
    gap: spacing.md,
    borderRadius: 50,
  },
  inputStyle: {
    borderRadius: 20,
    height: 50,
  },
  primaryButton: {
    marginTop: spacing.md,
    height: 50,
  },
  buttonSpacing: {
    height: 50,
    marginTop: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: fontSize.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.xs,
  },
  switchMode: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
