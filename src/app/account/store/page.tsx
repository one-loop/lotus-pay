import { getUserFromSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import StoreSettingsForm from "@/components/dashboard/StoreSettingsForm";

export default async function StorePage() {
  const user = await getUserFromSession();
  if (!user) redirect("/auth/login");

  return (
    <div className="grid gap-6">
      <StoreSettingsForm
        initial={{
          storeName: user.store.storeName,
          logoDataUrl: user.store.logoDataUrl,
          bannerDataUrl: user.store.bannerDataUrl,
        }}
      />
    </div>
  );
}

