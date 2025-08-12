import { SocialLoginRepository } from '@/backend/auth/domains/repositories/SocialLoginRepository';
import { SocialLoginRequestDto, SocialLoginResponseDto } from '@/backend/auth/applications/dtos/SocialLoginDto';

export class SocialLoginUseCase {
  constructor(private socialLoginRepository: SocialLoginRepository) {}

  async execute(request: SocialLoginRequestDto): Promise<SocialLoginResponseDto> {
    const { provider, providerId, email, name, profileImage } = request;

    // 1. 기존 소셜 계정이 있는지 확인
    let existingUserAuth = await this.socialLoginRepository.findByProviderAndProviderId(provider, providerId);
    
    if (existingUserAuth) {
      // 기존 소셜 계정이 있으면 해당 사용자 반환 (기존 정보 그대로)
      const user = await this.socialLoginRepository.findUserById(existingUserAuth.userId);
      if (!user || user.deletedAt || !user.isActive) {
        throw new Error('탈퇴한 계정입니다.');
      }
      
      return {
        success: true,
        message: '소셜 로그인이 완료되었습니다.',
        user: {
          id: user.id,
          email: user.email,        // 기존 이메일 그대로
          name: user.name,          // 기존 이름 그대로
          nickname: user.nickname,  // 기존 닉네임 그대로
          roles: ['USER'],
          deletedAt: user.deletedAt,
          isActive: user.isActive,
        },
        isNewUser: false,
      };
    }

    // 2. 같은 이메일로 가입된 계정이 있는지 확인
    let existingUser = await this.socialLoginRepository.findUserByEmail(email);
    
    if (existingUser) {
      // 같은 이메일의 기존 계정이 있으면 소셜 계정 연결 (기존 정보 유지)
      await this.socialLoginRepository.createUserAuth({
        provider,
        providerId,
        userId: existingUser.id,
        passwordHash: '', // 소셜 로그인은 비밀번호 없음
      });
      
      return {
        success: true,
        message: '기존 계정과 소셜 계정이 연결되었습니다.',
        user: {
          id: existingUser.id,
          email: existingUser.email,        // 기존 이메일 그대로
          name: existingUser.name,          // 기존 이름 그대로
          nickname: existingUser.nickname,  // 기존 닉네임 그대로
          roles: ['USER'],
          deletedAt: existingUser.deletedAt,
          isActive: existingUser.isActive,
        },
        isNewUser: false,
      };
    }

    // 3. 새로운 사용자 생성 (새 사용자만)
    const newUser = await this.socialLoginRepository.createUser({
      email,
      name,
      nickname: name, // 소셜 로그인 시 이름을 닉네임으로 사용
      password: '', // 소셜 로그인은 비밀번호 없음
      profileImage,
    });

    // 4. 소셜 계정 정보 저장
    await this.socialLoginRepository.createUserAuth({
      provider,
      providerId,
      userId: newUser.id,
      passwordHash: '', // 소셜 로그인은 비밀번호 없음
    });

    return {
      success: true,
      message: '소셜 로그인으로 새로운 계정이 생성되었습니다.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        nickname: newUser.nickname,
        roles: ['USER'],
        deletedAt: newUser.deletedAt,
        isActive: newUser.isActive,
      },
      isNewUser: true,
    };
  }
}
