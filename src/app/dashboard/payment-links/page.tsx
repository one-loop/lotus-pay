import { redirect } from "next/navigation";

export default function DashboardPaymentLinksRedirectPage() {
  redirect("/dashboard/products");
}
