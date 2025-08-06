export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  login?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  roles: string[];
}

export interface SocialLoginProvider {
  name: string;
  icon: string;
  label: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  nickname: string;
  password: string;
}

export interface SignupErrors {
  name?: string;
  email?: string;
  nickname?: string;
  password?: string;
  signup?: string;
}

export interface AgreementState {
  all: boolean;
  age: boolean;
  terms: boolean;
  privacy: boolean;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    nickname: string;
    createdAt: string;
  };
} 