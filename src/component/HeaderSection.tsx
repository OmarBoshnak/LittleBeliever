import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { spacing } from '../theme/spacing.ts';
import GradientBackground from './GradientBackground.tsx';
import React from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootstackParamList } from '../MainNavigation/Routes.tsx';
import { useNavigation } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext.tsx';

type NavigationProps = NativeStackNavigationProp<RootstackParamList>;

type HeaderSectionProps = {
  children?: React.ReactNode;
  color: string[];
  style?: ViewStyle;
  opacity?: number;
};

export const HeaderSection = ({
  children,
  color,
  style,
  opacity,
}: HeaderSectionProps) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();

  return (
    <View
      style={[styles.header, { paddingTop: insets.top + spacing.md }, style]}
    >
      <GradientBackground
        colors={color}
        opacity={opacity}
        style={[StyleSheet.absoluteFillObject, styles.gradient, style]}
      />
      <TouchableOpacity
        accessibilityLabel={t.back ?? 'Go Back'}
        style={[styles.backButton, { backgroundColor: `${colors.card}80` }]}
        activeOpacity={0.85}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={20} color={colors.foreground} />
      </TouchableOpacity>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.xxl * 2,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  gradient: {
    top: 0,
    height: 369,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  backButton: {
    width: 48,
    height: 48,
    marginHorizontal: spacing.lg,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
