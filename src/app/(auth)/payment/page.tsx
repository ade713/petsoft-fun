import { H1 } from "@/components/h1";
import { PaymentBtn } from "@/components/payment-btn";

type PaymentPageParams = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function Page({ searchParams }: PaymentPageParams) {
  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>

      {!searchParams.success && <PaymentBtn />}

      {searchParams.success && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}
      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled. You can try again.
        </p>
      )}
    </main>
  );
}
