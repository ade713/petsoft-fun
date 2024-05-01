"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { PetFormBtn } from "./pet-form-btn";
import { DEFAULT_PET_IMAGE_URL } from "@/lib/constants";
import { PetEssentials } from "@/lib/types";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmitted: () => void;
};

export function PetForm({ actionType, onFormSubmitted }: PetFormProps) {
  const { handleAddPet, handleEditPet, selectedPet } = usePetContext();

  async function handlePetFormAction(formData: FormData) {
    onFormSubmitted();

    const petData: PetEssentials = {
      age: parseInt(formData.get("age") as string),
      imageUrl: (formData.get("imageUrl") as string) || DEFAULT_PET_IMAGE_URL,
      name: formData.get("name") as string,
      notes: formData.get("notes") as string,
      ownerName: formData.get("ownerName") as string,
    };

    if (actionType === "add") {
      await handleAddPet(petData);
    } else if (actionType === "edit") {
      await handleEditPet(selectedPet!.id, petData);
    }
  }

  return (
    <form action={handlePetFormAction} className="flex flex-col">
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

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
