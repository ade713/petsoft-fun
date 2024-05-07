"use client";

import { logOut } from "@/actions/actions";
import { Button } from "./ui/button";

export function SignOutBtn() {
  async function handleLogOut() {
    await logOut();
  }

  return <Button onClick={handleLogOut}>Sign out</Button>;
}
