import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientBackgroundProps {
  colors: string[];
  locations?: number[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
  opacity?: number;
  children?: React.ReactNode;
}

const GradientBackground = ({
  colors,
  locations = [0, 0.5, 1],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  opacity = 0.5,
  children,
}: GradientBackgroundProps) => {
  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      start={start}
      end={end}
      style={[styles.gradient, style, { opacity: opacity }]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default GradientBackground;
