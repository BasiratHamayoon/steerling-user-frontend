import { AppProvider } from '@/context/AppContext';
import './globals.css';

export const metadata = {
  title: 'SteerFlux - Premium Steering Wheels',
  description: 'Best quality steering wheels for all vehicles',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}