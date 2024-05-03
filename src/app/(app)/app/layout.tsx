import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { BackgroundPattern } from "@/components/background-pattern";
import { Toaster } from "@/components/ui/sonner";
import { PetContextProvider } from "@/contexts/pet-context-provider";
import { SearchContextProvider } from "@/contexts/search-context-provider";
import prisma from "@/lib/db";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const petData = await prisma.pet.findMany();

  return (
    <>
      <BackgroundPattern />

      <div className="flex flex-col max-w-[1050px] min-h-screen mx-auto px-4">
        <AppHeader />
        <SearchContextProvider>
          <PetContextProvider petData={petData}>{children}</PetContextProvider>
        </SearchContextProvider>
        <AppFooter />
      </div>

      <Toaster position="top-right" />
    </>
  );
}
