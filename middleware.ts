import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 보호된 경로들 (로그인이 필요한 경로)
  const protectedPaths = ['/my', '/cart'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  // 보호된 경로에 접근하려는 경우
  if (isProtectedPath) {
    try {
      // JWT 토큰 확인
      const token = await getToken({ req: request });
      
      if (!token) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Middleware error:', error);
      // 에러 발생 시 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
