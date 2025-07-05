import { StyleSheet, Text, TextStyle } from 'react-native';
import useTheme from '@/hooks/useTheme';
import { ReactNode } from 'react';

type TitleProps = {
  children: ReactNode;
  style?: TextStyle;
};

export default function Title({ children, style }: Readonly<TitleProps>) {
  const colors = useTheme();
  return (
    <Text style={[styles.text, { color: colors.title }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
