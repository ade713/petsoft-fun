"use client";

import {
  AUTH_FORM_LOGIN_TYPE,
  LOGIN_BUTTON_TEXT,
  SIGN_UP_BUTTON_TEXT,
} from "@/lib/constants";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type AuthFormBtnProps = {
  type: "login" | "signup";
};

export function AuthFormBtn({ type }: AuthFormBtnProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {type === AUTH_FORM_LOGIN_TYPE ? LOGIN_BUTTON_TEXT : SIGN_UP_BUTTON_TEXT}
    </Button>
  );
}
