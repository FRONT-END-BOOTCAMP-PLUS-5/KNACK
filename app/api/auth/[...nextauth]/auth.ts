import { Session, User, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { LoginUseCase } from "@/backend/login/applications/usecases/LoginUseCase";
import { PrLoginRepository } from "@/backend/login/repositories/PrLoginRepository";
import { SocialLoginUseCase } from "@/backend/auth/applications/usecases/SocialLoginUseCase";
import { PrSocialLoginRepository } from "@/backend/auth/repositories/PrSocialLoginRepository";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    async signIn({ user, account, profile }: { user: any; account: any; profile: any }) {
      // 소셜 로그인인 경우
      if (account?.provider === 'google') {
        console.log('Google 로그인 시도:', {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: profile?.email,
          name: profile?.name,
        });
        
        try {
          // 소셜 로그인 UseCase 실행
          const socialLoginRepository = new PrSocialLoginRepository();
          const socialLoginUseCase = new SocialLoginUseCase(socialLoginRepository);
          
          const result = await socialLoginUseCase.execute({
            provider: account.provider,
            providerId: account.providerAccountId,
            email: profile?.email || '',
            name: profile?.name || '',
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