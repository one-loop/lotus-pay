import StandaloneCheckoutSuccess from "@/components/checkout/StandaloneCheckoutSuccess";

type Props = Readonly<{
  params: { linkId: string };
}>;

export default function CheckoutSuccessPage({ params }: Props) {
  return <StandaloneCheckoutSuccess linkId={params.linkId} />;
}
