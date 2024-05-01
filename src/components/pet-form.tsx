"use client";

import { usePetContext } from "@/lib/hooks";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { PetFormBtn } from "./pet-form-btn";
import { DEFAULT_PET_IMAGE_URL } from "@/lib/constants";
import { PetEssentials } from "@/lib/types";
import { useForm } from "react-hook-form";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmitted: () => void;
};

type TPetForm = {
  age: number;
  imageUrl: string;
  name: string;
  notes: string;
  ownerName: string;
};

export function PetForm({ actionType, onFormSubmitted }: PetFormProps) {
  const { handleAddPet, handleEditPet, selectedPet } = usePetContext();

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<TPetForm>();

  async function handlePetFormAction(formData: FormData) {
    const result = await trigger();
    if (!result) return;

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
            {...register("name", {
              required: "Name is required.",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters long.",
              },
            })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...register("ownerName", {
              required: "Owner's name is required.",
            })}
          />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            {...register("age", { required: "Age is required." })}
          />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes", { required: "Notes on pet are required." })}
          />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
