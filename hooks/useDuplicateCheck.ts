import { useState, useCallback } from 'react';
import { post } from '@/utils/requester';

interface DuplicateCheckResponse {
  success: boolean;
  errors: {
    email?: string;
    nickname?: string;
  };
  hasErrors: boolean;
}

export const useDuplicateCheck = () => {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [duplicateErrors, setDuplicateErrors] = useState<{
    email?: string;
    nickname?: string;
  }>({});

  const checkDuplicate = useCallback(async (email?: string, nickname?: string) => {
    if (!email && !nickname) return;

    // 이메일과 닉네임 각각의 검사 상태 설정
    if (email) setIsCheckingEmail(true);
    if (nickname) setIsCheckingNickname(true);
    
    setDuplicateErrors({});

    try {
      const response = await post<DuplicateCheckResponse>('/api/auth/check-duplicate', {
        email,
        nickname,
      });

      if (response.success && response.hasErrors) {
        setDuplicateErrors(response.errors);
      }
    } catch (error) {
      console.error('Duplicate check error:', error);
    } finally {
      // 각각의 검사 상태 해제
      if (email) setIsCheckingEmail(false);
      if (nickname) setIsCheckingNickname(false);
    }
  }, []);

  const clearDuplicateErrors = useCallback(() => {
    setDuplicateErrors({});
  }, []);

  return {
    isCheckingEmail,
    isCheckingNickname,
    duplicateErrors,
    checkDuplicate,
    clearDuplicateErrors,
  };
}; 