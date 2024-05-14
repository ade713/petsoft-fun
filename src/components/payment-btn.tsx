"use client";

import { createCheckoutSession } from "@/actions/actions";
import { Button } from "@/components/ui/button";

export function PaymentBtn() {
  async function handleButtonClick() {
    await createCheckoutSession();
  }

  return (
    <Button onClick={handleButtonClick}>Buy lifetime access for $299</Button>
  );
}
