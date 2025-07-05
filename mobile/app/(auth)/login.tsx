import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Container from '@/components/Container';
import Title from '@/components/Title';
import NormalText from '@/components/NormalText';
import { router } from 'expo-router';
import Link from '@/components/Link';
import PrimaryButton from '@/components/PrimaryButton';
import { ROUTES } from '@/routes';
import InputField from '@/components/InputField';
import useTheme from '@/hooks/useTheme';
import {
  isNotEmpty,
  isValidEmail,
  validateLoginField,
} from '@/utils/validators';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    server?: string;
  }>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>(
    { email: false, password: false },
  );
  const [loading, setLoading] = useState(false);
  const colors = useTheme();

  const getFieldError = (field: 'email' | 'password') =>
    touched[field] ? errors[field] : undefined;

  const handleChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    if (errors[field] || errors.server) {
      setErrors(prev => ({ ...prev, [field]: undefined, server: undefined }));
    }
  };

  const handleBlur = (field: 'email' | 'password', value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateLoginField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleLogin = async () => {
    const emailError = validateLoginField('email', email);
    const passwordError = validateLoginField('password', password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      const isUnauthorized = err?.response?.status === 401;
      const message = isUnauthorized
        ? 'Ungültige E-Mail oder Passwort'
        : 'Login fehlgeschlagen. Bitte überprüfe deine Eingaben';
      setErrors({ server: message });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = isValidEmail(email) && isNotEmpty(password);

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      keyboardShouldPersistTaps={'handled'}
      extraScrollHeight={20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container style={styles.container}>
          <Title style={styles.title}>Anmeldung</Title>

          <InputField
            label={'Email'}
            icon={'mail-outline'}
            value={email}
            onChangeText={text => handleChange('email', text)}
            onBlur={() => handleBlur('email', email)}
            placeholder={'Email'}
            error={getFieldError('email')}
          />
          <InputField
            label={'Passwort'}
            icon={'lock-closed-outline'}
            value={password}
            onChangeText={text => handleChange('password', text)}
            onBlur={() => handleBlur('password', password)}
            placeholder={'Passwort'}
            secureTextEntry={true}
            error={getFieldError('password')}
          />

          {errors.server && (
            <NormalText style={styles.serverError}>{errors.server}</NormalText>
          )}

          <PrimaryButton
            title={'Einloggen'}
            onPress={handleLogin}
            loading={loading}
            disabled={!canSubmit || loading}
          />

          <TouchableOpacity onPress={() => router.replace(ROUTES.REGISTER)}>
            <NormalText style={styles.signUpLink}>
              Noch keinen Account? <Link>Registrieren</Link>
            </NormalText>
          </TouchableOpacity>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 24,
  },
  serverError: { color: 'red', marginBottom: 12 },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orText: {
    marginHorizontal: 10,
    color: '#aaa',
  },
  signUpLink: { textAlign: 'center', marginTop: 24 },
});
