import { Session, User, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginUseCase } from "@/backend/login/applications/usecases/LoginUseCase";
import { PrLoginRepository } from "@/backend/login/repositories/PrLoginRepository";

export const authOptions = {
  providers: [
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