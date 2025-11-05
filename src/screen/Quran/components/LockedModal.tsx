import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Lock } from 'lucide-react-native';

import { useTheme } from '../../../theme/ThemeContext.tsx';
import { useLanguage } from '../../../context/LanguageContext.tsx';
import { Button } from '../../../component/Button.tsx';
import { borderRadius, fontSize, fontWeight, spacing } from '../../../theme/spacing.ts';

interface LockedModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const LockedModal: React.FC<LockedModalProps> = ({
  visible,
  onClose,
  onUpgrade,
}) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.card }]}> 
          <LinearGradient
            colors={[`${colors.secondary}55`, `${colors.primary}33`]}
            style={styles.badge}
          >
            <Lock size={40} color={colors.primaryForeground} />
          </LinearGradient>
          <Text style={[styles.title, { color: colors.primary }]}>
            {t.lockedSurah}
          </Text>
          <Text
            style={[styles.description, { color: colors.foreground }]}
          >
            {t.unlockQuran}
          </Text>
          <View style={styles.actions}>
            <Button
              onPress={onUpgrade}
              style={{ backgroundColor: colors.primary }}
              textStyle={{ color: colors.primaryForeground }}
            >
              {t.upgradeToPremium}
            </Button>
            <Button
              onPress={onClose}
              variant="outline"
              textStyle={{ color: colors.foreground }}
            >
              {t.close}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  badge: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
});
