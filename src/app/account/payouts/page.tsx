import { getUserFromSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import PayoutsConnectForm from "@/components/dashboard/PayoutsConnectForm";

export default async function PayoutsPage() {
  const user = await getUserFromSession();
  if (!user) redirect("/auth/login");

  return (
    <div className="grid gap-6">
      <PayoutsConnectForm
        initial={{
          connected: user.payouts.connected,
          bankName: user.payouts.bank?.bankName,
          accountHolder: user.payouts.bank?.accountHolder,
          accountNumber: user.payouts.bank?.accountNumber,
          routingNumber: user.payouts.bank?.routingNumber,
          country: user.payouts.bank?.country ?? user.profile.country,
        }}
      />
    </div>
  );
}

