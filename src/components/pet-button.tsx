"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { PetForm } from "./pet-form";
import { useState } from "react";

type PetButtonProps = {
  actionType: "add" | "edit" | "checkout";
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export function PetButton({
  actionType,
  children,
  disabled,
  onClick,
}: PetButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (actionType === "checkout") {
    return (
      <Button
        disabled={disabled}
        variant="secondary"
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild> 
        { actionType === "add" ? (
          <Button size="icon">
            <PlusIcon className="h-6 w-6"/>
          </Button>
        ) : (
          <Button variant="secondary">{children}</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionType === "add" ? "Add a new pet" : "Edit pet"}</DialogTitle>
        </DialogHeader>

        <PetForm actionType={actionType} onFormSubmitted={() => setIsFormOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
