import { StyleSheet, Text, TextStyle } from 'react-native';
import useTheme from '@/hooks/useTheme';
import { ReactNode } from 'react';

type TextProps = {
  children: ReactNode;
  style?: TextStyle;
};

export default function NormalText({ children, style }: Readonly<TextProps>) {
  const colors = useTheme();
  return (
    <Text style={[styles.text, { color: colors.title }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});
