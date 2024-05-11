import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // API 경로(/api), 정적 파일(/_next/static), 이미지 최적화 파일(/_next/image), 그리고 확장자가 .png로 끝나는 모든 요청을 제외
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
