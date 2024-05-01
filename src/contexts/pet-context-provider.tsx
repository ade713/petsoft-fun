"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  children: React.ReactNode;
  petData: Pet[];
};

type TPetContext = {
  numberOfPets: number;
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | undefined;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet["id"], newPetData: PetEssentials) => Promise<void>;
  handleChangeSelectedPetId: (id: Pet["id"]) => void;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
};

export const PetContext = createContext<TPetContext | null>(null);

export function PetContextProvider({
  petData,
  children,
}: PetContextProviderProps) {
  // state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    petData,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload, id: Math.random().toString() }];
        case "edit":
          return state.map((pet) => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.newPetData };
            }
            return pet;
          });
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers / actions
  async function handleAddPet(newPet: PetEssentials) {
    setOptimisticPets({ action: "add", payload: newPet });

    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  }
  async function handleEditPet(petId: Pet["id"], newPetData: PetEssentials) {
    setOptimisticPets({ action: "edit", payload: { id: petId, newPetData } });

    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
  }
  async function handleCheckoutPet(petId: Pet["id"]) {
    setOptimisticPets({ action: "delete", payload: petId });

    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }

    setSelectedPetId(null);
  }
  function handleChangeSelectedPetId(id: Pet["id"]) {
    setSelectedPetId(id);
  }

  return (
    <PetContext.Provider
      value={{
        numberOfPets,
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        handleAddPet,
        handleEditPet,
        handleChangeSelectedPetId,
        handleCheckoutPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
