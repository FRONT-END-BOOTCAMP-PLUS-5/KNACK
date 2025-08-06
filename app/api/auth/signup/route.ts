import { NextRequest, NextResponse } from 'next/server';
import { SignupUseCase } from '@/backend/signup/applications/usecases/SignupUseCase';
import { PrUserRepository } from '@/backend/signup/repositories/PrUserRepository';
import { SignupRequestDto } from '@/backend/signup/applications/dtos/SignupDto';

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequestDto = await request.json();
    const { name, email, nickname, password } = body;

    // 필수 필드 검증
    if (!name || !email || !nickname || !password) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 클린 아키텍처 UseCase 사용
    const userRepository = new PrUserRepository();
    const signupUseCase = new SignupUseCase(userRepository);
    const result = await signupUseCase.execute({ name, email, nickname, password });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    
    const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
} 