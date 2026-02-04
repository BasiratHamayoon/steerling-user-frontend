import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
  title: 'Steering Pro - Premium Steering Wheels',
  description: 'Best quality steering wheels for all vehicles',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}