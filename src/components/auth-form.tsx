import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { logIn, signUp } from "@/actions/actions";
import { AuthFormBtn } from "./auth-form-btn";

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

      <AuthFormBtn type={type} />
    </form>
  );
}
