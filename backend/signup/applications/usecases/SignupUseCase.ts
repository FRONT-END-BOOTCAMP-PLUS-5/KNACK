import bcrypt from 'bcryptjs';
import { UserRepository } from '@/backend/signup/domains/repositories/UserRepository';
import { SignupRequestDto, SignupResponseDto } from '@/backend/signup/applications/dtos/SignupDto';

export class SignupUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: SignupRequestDto): Promise<SignupResponseDto> {
    const { name, email, nickname, password } = request;

    // 이메일 중복 확인
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);

    // 사용자 생성
    const user = await this.userRepository.create({
      name,
      email,
      nickname,
      password: hashedPassword,
    });

    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
    };
  }
} 