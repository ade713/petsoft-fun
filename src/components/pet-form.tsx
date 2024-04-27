"use client";

import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const DEFAULT_PET_IMAGE_URL = "https://images.unsplash.com/photo-1545218553-cdb549f13f8a?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmitted: () => void;
};

export function PetForm({ actionType, onFormSubmitted }: PetFormProps) {
  const {
    handleAddPet,
    handleEditPet,
    selectedPet,
  } = usePetContext();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const petFormData = new FormData(e.currentTarget);
    const pet = {
      // cast input data as strings since typescript is not detecting `required` tag on input element
      name: petFormData.get("name") as string,
      ownerName: petFormData.get("ownerName") as string,
      imageUrl: petFormData.get("imageUrl") as string || DEFAULT_PET_IMAGE_URL,
      age: +(petFormData.get("age") as string),
      notes: petFormData.get("notes") as string,
    };

    if (actionType === "add") handleAddPet(pet);
    if (actionType === "edit") handleEditPet(selectedPet!.id, pet);

    onFormSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={actionType === "edit" ? selectedPet?.name : ""}
            required
            />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            type="text"
            defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="text"
            defaultValue={actionType === "edit" ? selectedPet?.imageUrl : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            defaultValue={actionType === "edit" ? selectedPet?.age : ""}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            defaultValue={actionType === "edit" ? selectedPet?.notes : ""}
            required
          />
        </div>
      </div>

      <Button className="mt-5 self-end" type="submit">
        {actionType === "add" ? "Add a new pet" : "Edit pet"}
      </Button>
    </form>
  );
}
