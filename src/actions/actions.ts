"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// ----- USER ACTIONS -----

export async function logIn(formData: FormData) {
  await signIn("credentials", formData);

  redirect("/app/dashboard");
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );

  await prisma?.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

// ----- PET ACTIONS -----

export async function addPet(petData: unknown) {
  const validatedPetData = petFormSchema.safeParse(petData);
  if (!validatedPetData.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: validatedPetData.data,
    });
  } catch (error) {
    return {
      message: "Could not add pet...",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPetData = petFormSchema.safeParse(newPetData);
  if (!validatedPetData.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPetData.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet...",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet...",
    };
  }

  revalidatePath("/app", "layout");
}
