import { Session, User } from "next-auth";
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
          };
        } catch (error) {
          console.error("Auth error:", error);
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
    strategy: 'jwt',
  },
};