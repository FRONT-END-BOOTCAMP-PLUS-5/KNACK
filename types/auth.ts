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