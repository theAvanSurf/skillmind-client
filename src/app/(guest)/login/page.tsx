import AuthLayout from "@/features/auth/components/AuthLayout";
import LoginForm from "@/features/auth/forms/LoginForm";

export default function LoginPage() {
  return (
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
  );
}