import { StyleSheet, Text } from 'react-native';
import { ReactNode } from 'react';
import useTheme from '@/hooks/useTheme';

type LinkProps = {
  children: ReactNode;
};

export default function Link({ children }: Readonly<LinkProps>) {
  const colors = useTheme();
  return (
    <Text style={[styles.text, { color: colors.primary }]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
  },
});
