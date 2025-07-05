import { StyleSheet, Text } from 'react-native';
import useTheme from '@/hooks/useTheme';
import { ReactNode } from 'react';

type SubtitleProps = {
  children: ReactNode;
};

export default function Subtitle({ children }: Readonly<SubtitleProps>) {
  const colors = useTheme();
  return (
    <Text style={[styles.text, { color: colors.subtitle }]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginBottom: 24,
  },
});
