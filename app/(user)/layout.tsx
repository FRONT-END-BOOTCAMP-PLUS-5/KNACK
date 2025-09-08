import '@/styles/global.scss';
import LayoutWrapper from '@/app/(user)/LayoutWrapper';
import SessionProvider from '@/components/providers/SessionProvider';
import localFont from 'next/font/local';
import { createMetaData } from '@/utils/createMetaData';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

export const metadata = createMetaData();

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
