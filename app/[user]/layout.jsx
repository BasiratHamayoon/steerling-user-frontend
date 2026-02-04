import UserHeader from '@/components/user/Header';
import UserFooter from '@/components/user/Footer';
import BackgroundAnimation from '@/components/user/BackgroundAnimation';
import WhatsAppButton from '@/components/user/WhatsAppButton';

export default function UserLayout({ children }) {
  return (
    <div className="relative">
      <BackgroundAnimation />
      <div className="min-h-screen flex flex-col relative z-10">
        <UserHeader />
        <main className="flex-grow">{children}</main>
        <UserFooter />
        <WhatsAppButton />
      </div>
    </div>
  );
}