"use client";

import { createCheckoutSession } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export function PaymentBtn() {
  const [isPending, startTransition] = useTransition();

  async function handleButtonClick() {
    startTransition(async function () {
      await createCheckoutSession();
    });
  }

  return (
    <Button disabled={isPending} onClick={handleButtonClick}>
      Buy lifetime access for $299
    </Button>
  );
}
