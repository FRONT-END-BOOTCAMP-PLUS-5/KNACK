import bcrypt from 'bcryptjs';
import { LoginRepository } from '@/backend/login/domains/repositories/LoginRepository';
import { LoginRequestDto, LoginResponseDto } from '@/backend/login/applications/dtos/LoginDto';

export class LoginUseCase {
  constructor(private loginRepository: LoginRepository) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = request;

    // 사용자 찾기
    const login = await this.loginRepository.findByEmail(email);
    if (!login) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, login.password);
    if (!isPasswordValid) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    return {
      success: true,
      message: '로그인이 완료되었습니다.',
      user: {
        id: login.id,
        email: login.email,
        name: login.name,
        nickname: login.nickname,
        roles: ['USER'], // 기본 역할
      },
    };
  }
} 