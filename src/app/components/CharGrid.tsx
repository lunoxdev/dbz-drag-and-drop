import { type APIResult } from "../types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const CharGrid = () => {
  const fetchCharacters = async (): Promise<APIResult> => {
    const res = await fetch("https://dragonball-api.com/api/characters");
    return res.json();
  };

  const { error, isLoading, data } = useQuery<APIResult>({
    queryKey: ["characters"],
    queryFn: fetchCharacters,
  });

  return (
    <main className="font-sans flex justify-center items-center min-h-screen p-4 sm:p-8">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#a23_100%)]" />
      <section className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {isLoading && <p className="col-span-full text-center">Loading...</p>}
        {error && (
          <p className="col-span-full text-center">Error loading data</p>
        )}
        {data?.items.map((char) => (
          <div
            key={char.id}
            className="flex flex-col justify-between items-center space-y-5 w-20 sm:w-full p-4 hover:scale-105 transition-transform duration-300"
          >
            <Image src={char.image} alt={char.name} width={120} height={120} />
            <p className="bg-gradient-to-r from-red-700 via-red-400 to-red-700 inline-block text-transparent bg-clip-text font-bold text-base sm:text-2xl">
              {char.name}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
};

export default CharGrid;
