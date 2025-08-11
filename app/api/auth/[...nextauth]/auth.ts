import { Session, User, SessionStrategy, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import { LoginUseCase } from "@/backend/login/applications/usecases/LoginUseCase";
import { PrLoginRepository } from "@/backend/login/repositories/PrLoginRepository";
import { SocialLoginUseCase } from "@/backend/auth/applications/usecases/SocialLoginUseCase";
import { PrSocialLoginRepository } from "@/backend/auth/repositories/PrSocialLoginRepository";

// 카카오 프로필 타입 확장
interface KakaoProfile extends Profile {
  nickname?: string;
  account_email?: string;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
            async authorize(credentials) {
        try {
          const { email, password } = credentials ?? {};

          if (!email || !password) {
            console.log("Missing email or password");
            return null;
          }

          // 클린 아키텍처 UseCase 사용
          const loginRepository = new PrLoginRepository();
          const loginUseCase = new LoginUseCase(loginRepository);
          const result = await loginUseCase.execute({ email, password });

          // NextAuth User 객체 반환
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            nickname: result.user.nickname,
            roles: result.user.roles,
            deletedAt: result.user.deletedAt,
            isActive: result.user.isActive,
          };
        } catch (error) {
          console.error("Auth error:", error);
          
          // 탈퇴한 계정 에러인 경우 커스텀 에러 생성
          if (error instanceof Error && error.message.includes('탈퇴한 계정')) {
            throw new Error('WITHDRAWN_ACCOUNT_ERROR');
          }
          
          // 없는 아이디/틀린 비밀번호인 경우 커스텀 에러 생성
          if (error instanceof Error && error.message.includes('이메일 또는 비밀번호가 올바르지 않습니다')) {
            throw new Error('INVALID_CREDENTIALS_ERROR');
          }
          
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: { 
      user: AdapterUser | User; 
      account: Account | null; 
      profile?: Profile 
    }) {
      // 소셜 로그인인 경우
      if (account?.provider === 'google' || account?.provider === 'kakao') {
        console.log(`${account.provider} 로그인 시도:`, {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: profile?.email,
          name: profile?.name,
          // 카카오 전용 정보 로깅
          ...(account.provider === 'kakao' && {
            nickname: (profile as KakaoProfile)?.nickname,
            account_email: (profile as KakaoProfile)?.account_email,
          }),
        });
        
        // 카카오 로그인 시 더 자세한 디버깅
        if (account.provider === 'kakao') {
          console.log('=== 카카오 로그인 디버깅 ===');
          console.log('전체 profile 객체:', JSON.stringify(profile, null, 2));
          console.log('전체 account 객체:', JSON.stringify(account, null, 2));
          console.log('전체 user 객체:', JSON.stringify(user, null, 2));
          console.log('profile 타입:', typeof profile);
          console.log('profile 키들:', profile ? Object.keys(profile) : 'profile is undefined');
          console.log('=== 디버깅 끝 ===');
        }
        
        try {
          let email = '';
          let name = '';
          
          if (account.provider === 'google') {
            // 구글 로그인 - 기존 로직 그대로 유지
            email = profile?.email || '';
            name = profile?.name || '';
          } else if (account.provider === 'kakao') {
            // 카카오 로그인 - user 객체에 이미 올바른 정보가 들어있음
            console.log('카카오 user 객체:', {
              id: user.id,
              name: user.name,
              email: user.email
            });
            
            // user 객체의 정보를 그대로 사용 (기본값 없이)
            email = user.email;
            name = user.name;
            
            console.log('카카오 정보 매핑 결과:', {
              원본_email: user.email,
              원본_name: user.name,
              최종_email: email,
              최종_name: name
            });
          }
          
          // email과 name이 비어있으면 기본값 설정
          if (!email) {
            email = `${account.provider}_${account.providerAccountId}@${account.provider}.com`;
          }
          if (!name) {
            name = `${account.provider}사용자_${account.providerAccountId}`;
          }

          // 임시로 기존 사용자 체크 제거 (디버깅용)
          console.log('SocialLoginUseCase 실행 준비:', { email, name, provider: account.provider, providerId: account.providerAccountId });

          // 소셜 로그인 UseCase 실행 (항상 실행)
          const socialLoginRepository = new PrSocialLoginRepository();
          const socialLoginUseCase = new SocialLoginUseCase(socialLoginRepository);
          
          const result = await socialLoginUseCase.execute({
            provider: account.provider,
            providerId: account.providerAccountId,
            email: email,
            name: name,
            profileImage: profile?.picture,
          });
          
          console.log('소셜 로그인 결과:', result);
          
          // NextAuth user 객체에 필요한 정보 주입
          user.id = result.user.id;
          user.email = result.user.email;
          user.name = result.user.name;
          user.nickname = result.user.nickname;
          user.roles = result.user.roles;
          user.deletedAt = result.user.deletedAt;
          user.isActive = result.user.isActive;
          
          return true;
        } catch (error) {
          console.error('소셜 로그인 에러:', error);
          return false;
        }
      }
      
      // 기존 credentials 로그인은 그대로 진행
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.nickname = user.nickname;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.nickname = token.nickname;
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
};