import { useState, useCallback } from 'react';
import { validateLoginForm } from '@/utils/auth/validation';
import { LoginFormErrors } from '@/types/auth';

export const useLoginValidation = () => {
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validateField = useCallback((field: 'email' | 'password', value: string) => {
    const { errors: fieldErrors } = validateLoginForm(
      field === 'email' ? value : '',
      field === 'password' ? value : ''
    );
    
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors[field],
    }));
  }, []);

  const clearError = useCallback((field: keyof LoginFormErrors) => {
    setErrors(prev => ({
      ...prev,
      [field]: undefined,
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setLoginError = useCallback((message: string) => {
    setErrors(prev => ({
      ...prev,
      login: message,
    }));
  }, []);

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors,
    setLoginError,
  };
}; 