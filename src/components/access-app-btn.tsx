"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function AccessAppBtn() {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  async function handleAccessButtonClick() {
    await update(true);
    router.push("/app/dashboard");
  }

  const isDisabled = status === "loading" || session?.user.hasPaid;

  return (
    <Button disabled={isDisabled} onClick={handleAccessButtonClick}>
      Access PetSoft
    </Button>
  );
}
