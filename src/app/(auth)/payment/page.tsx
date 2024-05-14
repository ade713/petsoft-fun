import { H1 } from "@/components/h1";
import { PaymentBtn } from "@/components/payment-btn";

export default function Page() {
  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>

      <PaymentBtn />
    </main>
  );
}
