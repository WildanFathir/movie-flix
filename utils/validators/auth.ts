export function validateEmail(email: string): string | null {
  if (!email) return 'Email harus diisi';
  if (!email.includes('@')) return 'Email tidak valid';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password harus diisi';
  if (password.length < 6) return 'Password minimal 6 karakter';
  return null;
}

export function validateName(name: string): string | null {
  if (!name?.trim()) return 'Nama harus diisi';
  if (name.trim().length < 2) return 'Nama minimal 2 karakter';
  return null;
}

export function validateLoginInput(email: string, password: string): string | null {
  if (!email || !password) return 'Email dan password harus diisi';
  return validateEmail(email) || validatePassword(password);
}

export function validateRegisterInput(
  name: string,
  email: string,
  password: string,
): string | null {
  if (!name || !email || !password) return 'Semua field harus diisi';
  return validateName(name) || validateEmail(email) || validatePassword(password);
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) return 'Password tidak cocok';
  return null;
}
