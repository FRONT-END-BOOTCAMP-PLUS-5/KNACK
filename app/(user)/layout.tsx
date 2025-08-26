import type { Metadata } from 'next';
import '@/styles/global.scss';
import LayoutWrapper from '@/app/(user)/LayoutWrapper';
import SessionProvider from '@/components/providers/SessionProvider';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'KNACK',
  description: 'KNACK에서 다양한 상품을 확인해보세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
