// app/forgot-password/page.tsx (or pages/forgot-password.tsx)
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ForgotPasswordForm />
    </div>
  );
}