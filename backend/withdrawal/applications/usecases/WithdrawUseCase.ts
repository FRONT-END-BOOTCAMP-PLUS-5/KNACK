import bcrypt from 'bcryptjs';
import { WithdrawRepository } from '@/backend/withdrawal/domains/repositories/WithdrawRepository';
import { WithdrawRequestDto, WithdrawResponseDto } from '@/backend/withdrawal/applications/dtos/WithdrawDto';

export class WithdrawUseCase {
  constructor(private withdrawRepository: WithdrawRepository) {}

  async execute(request: WithdrawRequestDto, userId: string): Promise<WithdrawResponseDto> {
    const { password } = request;

    // 사용자 정보 조회
    const user = await this.withdrawRepository.findById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 이미 탈퇴한 사용자인지 확인
    if (user.deletedAt !== null || !user.isActive) {
      throw new Error('이미 탈퇴한 사용자입니다.');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('비밀번호가 올바르지 않습니다.');
    }

    // 회원탈퇴 처리
    const withdrawResult = await this.withdrawRepository.withdrawUser(userId);

    return {
      success: true,
      message: '회원탈퇴가 완료되었습니다.',
      user: {
        id: withdrawResult.id,
        email: withdrawResult.email,
        deletedAt: withdrawResult.deletedAt,
        isActive: withdrawResult.isActive,
      },
    };
  }
}



