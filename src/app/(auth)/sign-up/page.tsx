import CreateUserForm from '@/components/(auth)/sign-up/create-user-form';

export default function SignUpPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold">Create an account</h2>
      <div className="mt-12">
        <CreateUserForm />
      </div>
    </>
  );
}
