"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function AccessAppBtn() {
  const { update } = useSession();
  const router = useRouter();

  async function handleAccessButtonClick() {
    await update(true);
    router.push("/app/dashboard");
  }

  return <Button onClick={handleAccessButtonClick}>Access PetSoft</Button>;
}
