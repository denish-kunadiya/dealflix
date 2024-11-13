import Image from 'next/image';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 h-full w-full object-cover">
        <Image
          width={1440}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/auth-bg.jpg"
          alt=""
        />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-[#f9fafb] to-[#f9fafb00]" />
      </div>
      <div className="relative my-auto sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-3xl bg-slate-50 p-12 sm:p-16">
          <div className="flex w-full justify-center">
            <Image
              width={113}
              height={87}
              className="h-auto w-28"
              src="/images/logo.svg"
              alt="Logo"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
