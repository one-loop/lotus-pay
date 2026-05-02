import StandaloneCheckoutPayment from "@/components/checkout/StandaloneCheckoutPayment";

type Props = Readonly<{
  params: { linkId: string };
}>;

export default function CheckoutPaymentPage({ params }: Props) {
  return <StandaloneCheckoutPayment linkId={params.linkId} />;
}
