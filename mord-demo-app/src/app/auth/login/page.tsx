import { redirect } from "next/navigation";

import { getUserFromSession } from "@/lib/auth";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const user = await getUserFromSession();
  if (user) {
    redirect(user.onboarded ? "/dashboard" : "/auth/onboarding");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <LoginForm />
    </main>
  );
}

