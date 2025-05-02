import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactQueryClientProvider } from '@/components/providers/ReactQueryClientProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Container } from '@/components/ui/container';
import { ThemeDevSwitcher } from '@/components/ui/theme-dev-switcher';
import { cn } from '@/lib/utils';

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
    <html lang="en" className="focus:outline-none" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        "min-h-screen bg-background font-sans antialiased"
      )}>
        <ReactQueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Container as="main" className="flex min-h-screen flex-col">
              {children}
            </Container>
            {/* Theme Development Tool - Remove before production */}
            <ThemeDevSwitcher />
          </ThemeProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
