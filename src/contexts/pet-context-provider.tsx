"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type PetContextProviderProps = {
  children: React.ReactNode;
  petData: Pet[];
};

type TPetContext = {
  numberOfPets: number;
  pets: Pet[];
  selectedPetId: string | null;
  selectedPet: Pet | undefined;
  handleAddPet: (newPet: Omit<Pet, 'id'>) => void;
  handleEditPet: (petId: string, newPetData: Omit<Pet, 'id'>) => void;
  handleChangeSelectedPetId: (id: string) => void,
  handleCheckoutPet: (id: string) => void,
};

export const PetContext = createContext<TPetContext | null>(null);

export function PetContextProvider({ petData, children }: PetContextProviderProps) {
  // state
  const [pets, setPets] = useState(petData);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find(pet => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers / actions
  function handleAddPet(newPet: Omit<Pet, 'id'>) {
    setPets(prev => [
      ...prev,
      {
      id:Date.now().toString(),
      ...newPet,
      },
    ]);
  }
  function handleEditPet(petId: string, newPetData: Omit<Pet, 'id'>) {
    setPets(prev => prev.map(pet => {
      if (pet.id === petId) {
        return {
          id: petId,
          ...newPetData,
        };
      }

      return pet;
    }));
  }
  function handleCheckoutPet(id: string) {
    setPets(prev => prev.filter(pet => pet.id !== id));
    setSelectedPetId(null);
  }
  function handleChangeSelectedPetId(id: string) {
    setSelectedPetId(id);
  }


  return (
    <PetContext.Provider
      value={{
        numberOfPets,
        pets,
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
