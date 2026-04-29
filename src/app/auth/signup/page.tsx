import { redirect } from "next/navigation";

import { getUserFromSession } from "@/lib/auth";
import SignupForm from "@/components/auth/SignupForm";

export default async function SignupPage() {
  const user = await getUserFromSession();
  if (user) {
    redirect(user.onboarded ? "/dashboard" : "/auth/onboarding");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <SignupForm />
    </main>
  );
}

