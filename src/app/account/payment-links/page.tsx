import { getUserFromSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import PaymentLinksManager from "@/components/dashboard/PaymentLinksManager";

export default async function PaymentLinksPage() {
  const user = await getUserFromSession();
  if (!user) redirect("/auth/login");

  return (
    <div className="grid gap-6">
      <PaymentLinksManager />
    </div>
  );
}

