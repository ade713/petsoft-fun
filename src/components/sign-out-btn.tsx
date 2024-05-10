"use client";

import { logOut } from "@/actions/actions";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { SIGN_OUT_BUTTON_TEXT } from "@/lib/constants";

export function SignOutBtn() {
  const [isPending, startTransition] = useTransition();

  async function handleLogOut() {
    startTransition(async function () {
      await logOut();
    });
  }

  return (
    <Button onClick={handleLogOut} disabled={isPending}>
      {SIGN_OUT_BUTTON_TEXT}
    </Button>
  );
}
