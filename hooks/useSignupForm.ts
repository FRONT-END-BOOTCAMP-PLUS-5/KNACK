import { useState, useCallback, useEffect } from 'react';
import { SignupFormData, SignupErrors, AgreementState } from '@/types/auth';
import { validateSignupForm, validateSignupEmail, validateSignupPassword, validateName, validateNickname } from '@/utils/auth/validation';
import { useDuplicateCheck } from './useDuplicateCheck';

export const useSignupForm = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    nickname: '',
    password: '',
  });

  const [errors, setErrors] = useState<SignupErrors>({});

  const [agreements, setAgreements] = useState<AgreementState>({
    all: false,
    age: false,
    terms: false,
    privacy: false,
  });

  const { isCheckingEmail, isCheckingNickname, duplicateErrors, checkDuplicate, clearDuplicateErrors } = useDuplicateCheck();

  // 이메일이 변경될 때만 이메일 중복 검사 실행
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email) {
        checkDuplicate(formData.email, undefined);
      }
    }, 500); // 500ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [formData.email, checkDuplicate]);

  // 닉네임이 변경될 때만 닉네임 중복 검사 실행
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.nickname) {
        checkDuplicate(undefined, formData.nickname);
      }
    }, 500); // 500ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [formData.nickname, checkDuplicate]);

  // 중복 에러를 일반 에러에 병합
  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      ...duplicateErrors,
    }));
  }, [duplicateErrors]);

  const handleInputChange = useCallback((field: keyof SignupFormData) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // 실시간 유효성 검사
      let fieldError = '';
      switch (field) {
        case 'name':
          fieldError = validateName(value);
          break;
        case 'email':
          fieldError = validateSignupEmail(value);
          break;
        case 'nickname':
          fieldError = validateNickname(value);
          break;
        case 'password':
          fieldError = validateSignupPassword(value);
          break;
      }
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    }, []);

  const handleAgreementChange = useCallback((field: keyof AgreementState, checked: boolean) => {
    if (field === 'all') {
      setAgreements({
        all: checked,
        age: checked,
        terms: checked,
        privacy: checked,
      });
    } else {
      const newAgreements = { ...agreements, [field]: checked };
      const allChecked = newAgreements.age && newAgreements.terms && newAgreements.privacy;
      setAgreements({ ...newAgreements, all: allChecked });
    }
  }, [agreements]);

  const validateForm = useCallback(() => {
    const formErrors = validateSignupForm(formData);
    setErrors(formErrors);
    return Object.values(formErrors).every(error => !error);
  }, [formData]);

  const isFormValid = useCallback(() => {
    const hasNoErrors = !errors.name && !errors.email && !errors.nickname && !errors.password;
    const hasAllFields = formData.name && formData.email && formData.nickname && formData.password;
    const hasAllAgreements = agreements.age && agreements.terms && agreements.privacy;
    
    return hasNoErrors && hasAllFields && hasAllAgreements;
  }, [formData, errors, agreements]);

  const setSignupError = useCallback((message: string) => {
    setErrors(prev => ({ ...prev, signup: message }));
  }, []);

  const clearSignupError = useCallback(() => {
    setErrors(prev => ({ ...prev, signup: '' }));
  }, []);

  return {
    formData,
    errors,
    agreements,
    isCheckingEmail,
    isCheckingNickname,
    handleInputChange,
    handleAgreementChange,
    validateForm,
    isFormValid,
    setSignupError,
    clearSignupError,
  };
}; 