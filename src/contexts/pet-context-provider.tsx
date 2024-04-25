"use client";

import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

type PetContextProviderProps = {
  children: React.ReactNode;
  petData: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void,
};

export const PetContext = createContext<TPetContext | null>(null);

export function PetContextProvider({ petData, children }: PetContextProviderProps) {
  const [pets, setPets] = useState(petData);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  function handleChangeSelectedPetId(id: string) {
    setSelectedPetId(id);
  }


  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleChangeSelectedPetId,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
