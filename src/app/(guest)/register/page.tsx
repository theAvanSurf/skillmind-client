import { Suspense } from "react";
import RegisterForm from "@/features/auth/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
