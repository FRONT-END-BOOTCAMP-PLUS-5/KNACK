import { NextRequest, NextResponse } from 'next/server';
import { PrUserRepository } from '@/backend/signup/repositories/PrUserRepository';

export async function POST(request: NextRequest) {
  try {
    const { email, nickname } = await request.json();

    const userRepository = new PrUserRepository();
    const errors: { email?: string; nickname?: string } = {};

    // 이메일 중복 검사
    if (email) {
      const existingUserByEmail = await userRepository.findByEmail(email);
      if (existingUserByEmail) {
        errors.email = '이미 존재하는 이메일입니다.';
      }
    }

    // 닉네임 중복 검사
    if (nickname) {
      const existingUserByNickname = await userRepository.findByNickname(nickname);
      if (existingUserByNickname) {
        errors.nickname = '이미 존재하는 닉네임입니다.';
      }
    }

    return NextResponse.json({
      success: true,
      errors,
      hasErrors: Object.keys(errors).length > 0,
    });
  } catch (error) {
    console.error('Duplicate check error:', error);
    return NextResponse.json(
      { success: false, message: '중복 검사 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 