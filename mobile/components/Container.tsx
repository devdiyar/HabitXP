import { ReactNode } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import useTheme from '@/hooks/useTheme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

export default function Container({ children, style }: Readonly<Props>) {
  const colors = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.centerContainer}>
        <View style={[styles.inner, style]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 16,
  },
});
