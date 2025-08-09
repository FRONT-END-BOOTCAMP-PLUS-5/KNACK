import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      nickname: string;
      roles: string[];
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    nickname: string;
    roles: string[];
    deletedAt?: Date | null;
    isActive?: boolean;
  }

  interface Profile {
    picture?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    nickname: string;
    roles: string[];
  }
}