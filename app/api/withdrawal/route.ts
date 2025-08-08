import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { WithdrawUseCase } from '@/backend/withdrawal/applications/usecases/WithdrawUseCase';
import { PrWithdrawRepository } from '@/backend/withdrawal/repositories/PrWithdrawRepository';
import { WithdrawRequestDto } from '@/backend/withdrawal/applications/dtos/WithdrawDto';

export async function POST(request: NextRequest) {
  try {
    // 현재 로그인한 사용자 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body: WithdrawRequestDto = await request.json();
    const { password } = body;

    // 필수 필드 검증
    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 클린 아키텍처 UseCase 사용
    const withdrawRepository = new PrWithdrawRepository();
    const withdrawUseCase = new WithdrawUseCase(withdrawRepository);
    const result = await withdrawUseCase.execute({ password }, session.user.id);

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Withdraw error:', error);
    
    const errorMessage = error instanceof Error ? error.message : '회원탈퇴 중 오류가 발생했습니다.';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}



