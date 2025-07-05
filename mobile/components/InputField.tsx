import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { useState } from 'react';

type Props = {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  style?: object;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  editable?: boolean;
  onBlur?: () => void;
};

export default function InputField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  style,
  keyboardType,
  error,
  editable,
  onBlur,
}: Readonly<Props>) {
  const colors = useTheme();
  const [isSecure, setIsSecure] = useState(!!secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      {/* Label nur anzeigen, wenn vorhanden */}
      {label ? (
        <Text style={[styles.label, { color: colors.title }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBackground,
            paddingLeft: icon ? 10 : 14,
            opacity: editable === false ? 0.4 : 1,
          },
        ]}
      >
        {/* Icon nur anzeigen, wenn vorhanden */}
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={colors.subtitle}
            style={styles.icon}
          />
        )}

        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={[styles.input, { color: colors.inputText }]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          editable={editable}
          onBlur={onBlur}
        />

        {secureTextEntry && (
          <Ionicons
            name={isSecure ? 'eye-off' : 'eye'}
            size={20}
            color={colors.subtitle}
            onPress={() => setIsSecure(!isSecure)}
            style={{ marginLeft: 10 }}
          />
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 14,
    borderRadius: 14,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});
