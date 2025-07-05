export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
}

export function isSecurePassword(password: string): boolean {
  const regex = /^(?=.*[A-Z]).{8,}$/;
  return regex.test(password);
}

export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function validateLoginField(
  field: 'email' | 'password',
  value: string,
): string | undefined {
  if (field === 'email') {
    if (!isNotEmpty(value)) return 'Bitte Email eingeben';
    if (!isValidEmail(value)) return 'Bitte gültige E-Mail eingeben';
  }
  if (field === 'password') {
    if (!isNotEmpty(value)) return 'Bitte Passwort eingeben';
  }
  return undefined;
}
