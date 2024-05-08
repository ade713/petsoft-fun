import {
  AUTH_FORM_LOGIN_TYPE,
  LOGIN_BUTTON_TEXT,
  SIGN_UP_BUTTON_TEXT,
} from "@/lib/constants";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { logIn, signUp } from "@/actions/actions";

type AuthFormProps = {
  type: "login" | "signup";
};

export function AuthForm({ type }: AuthFormProps) {
  return (
    <form action={type === "login" ? logIn : signUp}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="mt-2 mb-4 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />
      </div>

      <Button>
        {type === AUTH_FORM_LOGIN_TYPE
          ? LOGIN_BUTTON_TEXT
          : SIGN_UP_BUTTON_TEXT}
      </Button>
    </form>
  );
}
