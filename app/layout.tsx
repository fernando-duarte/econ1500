import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactQueryClientProvider } from '@/components/providers/ReactQueryClientProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Econ 1500: The China Growth Game",
  description: "An interactive economics game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="min-h-screen bg-background">
              {children}
            </main>
          </ThemeProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
