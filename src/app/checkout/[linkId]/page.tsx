import StandaloneCheckout from "@/components/checkout/StandaloneCheckout";

type Props = Readonly<{
  params: { linkId: string };
}>;

export default function StandaloneCheckoutPage({ params }: Props) {
  return <StandaloneCheckout linkId={params.linkId} />;
}
