import LoginForm from '@/components/(auth)/login/login-form';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold">Hi! Sign in to your account</h2>
      <div className="mt-12">
        <LoginForm />
      </div>
    </>
  );
}
