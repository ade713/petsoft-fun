import { Button } from "./ui/button";

type PetFormBtnProps = {
  actionType: "add" | "edit";
}

export function PetFormBtn({ actionType }: PetFormBtnProps) {  
  return (
    <Button
      className="mt-5 self-end"
      type="submit"
    >
      {actionType === "add" ? "Add a new pet" : "Edit pet"}
    </Button>
  );
}
