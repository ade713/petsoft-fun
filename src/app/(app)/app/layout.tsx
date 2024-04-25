import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { BackgroundPattern } from "@/components/background-pattern";
import { PetContextProvider } from "@/contexts/pet-context-provider";
import { Pet } from "@/lib/types";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
  const response = await fetch("https://bytegrad.com/course-assets/projects/petsoft/api/pets");

  if (!response.ok) {
    throw new Error("Could not retrieve pet data");
  }
  const data: Pet[] = await response.json();

  return (
    <>
      <BackgroundPattern />

      <div className="flex flex-col max-w-[1050px] min-h-screen mx-auto px-4">
        <AppHeader />
        <PetContextProvider petData={data}>
          {children}
        </PetContextProvider>
        <AppFooter />
      </div>
    </>
  );
}
