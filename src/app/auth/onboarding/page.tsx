import { redirect } from "next/navigation";

import { getUserFromSession } from "@/lib/auth";
import OnboardingForm from "@/components/auth/OnboardingForm";

export default async function OnboardingPage() {
  const user = await getUserFromSession();
  if (!user) redirect("/auth/login");
  if (user.onboarded) redirect("/account");

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <OnboardingForm
        initial={{
          displayName: user.profile.displayName,
          website: user.profile.website,
          productCategory: user.profile.productCategory,
          country: user.profile.country,
        }}
      />
    </main>
  );
}

