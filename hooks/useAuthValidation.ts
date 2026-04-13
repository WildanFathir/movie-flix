import {
  validateLoginInput,
  validatePasswordConfirmation,
  validateRegisterInput,
} from '@/utils/validators/auth';
import { useCallback, useState } from 'react';

export function useAuthValidation() {
  const [validationError, setValidationError] = useState('');

  const clearValidationError = useCallback(() => {
    setValidationError('');
  }, []);

  const validateLoginForm = useCallback((email: string, password: string) => {
    const error = validateLoginInput(email, password);
    setValidationError(error ?? '');
    return !error;
  }, []);

  const validateRegisterForm = useCallback(
    (name: string, email: string, password: string, confirmPassword: string) => {
      const baseError = validateRegisterInput(name, email, password);
      if (baseError) {
        setValidationError(baseError);
        return false;
      }

      const confirmError = validatePasswordConfirmation(password, confirmPassword);
      setValidationError(confirmError ?? '');
      return !confirmError;
    },
    [],
  );

  return {
    validationError,
    clearValidationError,
    validateLoginForm,
    validateRegisterForm,
  };
}
