"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { checkAuth, getPetById } from "@/lib/server-utils";

// ----- USER ACTIONS -----

export async function logIn(formData: unknown) {
  if (!(formData instanceof FormData)) return { message: "Invalid form data." };

  await signIn("credentials", formData);

  redirect("/app/dashboard");
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function signUp(formData: unknown) {
  // validation
  if (!(formData instanceof FormData)) return { message: "Invalid form data." };

  // convert formData to a plain object
  const formDataEntries = Object.fromEntries(formData.entries());
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) return { message: "Invalid form data." };

  const { email, password } = validatedFormData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma?.user.create({
    data: {
      email,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

// ----- PET ACTIONS -----

export async function addPet(petData: unknown) {
  const session = await checkAuth();

  const validatedPetData = petFormSchema.safeParse(petData);
  if (!validatedPetData.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPetData.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Could not add pet...",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPetData = petFormSchema.safeParse(newPetData);
  if (!validatedPetData.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) return { message: "Pet not found..." };
  if (pet.userId !== session.user.id)
    return { message: "User not authorized..." };

  // database mutation
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
  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) return { message: "Pet not found..." };
  if (pet.userId !== session.user.id)
    return { message: "User not authorized..." };

  // database mutation
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
