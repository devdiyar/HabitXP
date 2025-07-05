import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import useTheme from '@/hooks/useTheme';

type PrimaryButtonProps = {
  title: string;
  loading?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export default function PrimaryButton({
  title,
  loading = false,
  onPress,
  disabled,
}: Readonly<PrimaryButtonProps>) {
  const colors = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.primary, opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator color={colors.title} />
      ) : (
        <Text style={[styles.text, { color: colors.title }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
});
