// app/reset-password/page.tsx (or pages/reset-password.tsx)
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ResetPasswordForm />
    </div>
  );
}