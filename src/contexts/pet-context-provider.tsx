"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  children: React.ReactNode;
  petData: Pet[];
};

type TPetContext = {
  numberOfPets: number;
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  handleAddPet: (newPet: Omit<Pet, 'id'>) => Promise<void>;
  handleEditPet: (petId: string, newPetData: Omit<Pet, 'id'>) => Promise<void>;
  handleChangeSelectedPetId: (id: string) => void,
  handleCheckoutPet: (id: string) => Promise<void>,
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
          return state.map(pet => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.newPetData };
            }
            return pet;
          });
        case "delete":
          return state.filter(pet => pet.id !== payload);
        default:
          return state;
      }
    },
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = optimisticPets.find(pet => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers / actions
  async function handleAddPet(newPet: Omit<Pet, 'id'>) {
    setOptimisticPets({ action: newPet, payload: newPet });

    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  }
  async function handleEditPet(petId: string, newPetData: Omit<Pet, 'id'>) {
    setOptimisticPets({ action: "edit", payload: { id: petId, newPetData } });

    const error = await editPet(petId, newPetData);
      if (error) {
        toast.warning(error.message);
        return;
      }
  }
  async function handleCheckoutPet(petId: string) {
    setOptimisticPets({ action: "delete", payload: petId });

    const error = await deletePet(petId);
    if (error) {
      toast.warning(error.message);
      return;
    }

    setSelectedPetId(null);
  }
  function handleChangeSelectedPetId(id: string) {
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
