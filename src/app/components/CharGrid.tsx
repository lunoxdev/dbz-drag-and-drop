import { type APIResult, type Item } from "../types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useEffect, useRef } from "react";
import { useCharStore } from "../stores/charStore";
import dbzlogo from "./../../../public/dbz-logo.png";
import { motion } from "motion/react";

const CharGrid = () => {
  const { characters, setCharacters } = useCharStore();
  // Ref to keep track of previous order
  const prevOrderRef = useRef<string>("");

  // Fetch
  const fetchCharacters = async (): Promise<APIResult> => {
    const res = await fetch("https://dragonball-api.com/api/characters");
    return res.json();
  };

  const { error, isLoading, data } = useQuery<APIResult>({
    queryKey: ["characters"],
    queryFn: fetchCharacters,
  });

  // Enable sort drag-and-drop with current characters
  // Based on doc https://drag-and-drop.formkit.com/#usage
  const [parentRef, items, setItems] = useDragAndDrop<HTMLDivElement, Item>(
    characters,
    { sortable: true }
  );

  // Effect to load initial data
  useEffect(() => {
    if (data?.items) {
      if (characters.length === 0) {
        // First load using API data
        setCharacters(data.items);
        setItems(data.items);
        // Update with initial order
        prevOrderRef.current = data.items.map((item) => item.id).join(",");
      } else {
        // Keep saved order
        setItems(characters);
        prevOrderRef.current = characters.map((item) => item.id).join(",");
      }
    }
  }, [data, setItems, setCharacters, characters]);

  // Effect to detect changes
  useEffect(() => {
    if (items.length > 0) {
      const currentOrder = items.map((item) => item.id).join(",");

      // Update store only if the order really changed
      if (currentOrder !== prevOrderRef.current) {
        setCharacters(items);
        prevOrderRef.current = currentOrder;
      }
    }
  }, [items, setCharacters]);

  return (
    <main className="font-sans flex flex-col justify-center items-center p-2 sm:p-8">
      {/* Grid List */}
      <Image
        src={dbzlogo}
        alt="Dragon Ball Z Logo"
        width={150}
        height={150}
        className="w-auto h-auto mb-1 sm:mb-3"
      />
      <section
        ref={parentRef}
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
      >
        {isLoading && <p className="col-span-full text-center">Loading...</p>}
        {error && (
          <p className="col-span-full text-center">Error loading data</p>
        )}
        {items.map((char, index) => (
          <motion.div
            key={char.id}
            data-label={char.name}
            className="flex flex-col justify-between items-center space-y-5 w-20 sm:w-full p-4 hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: index * 0.2,
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <Image
              src={char.image}
              alt={char.name}
              width={100}
              height={100}
              priority={true}
            />
            <p className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 inline-block text-transparent bg-clip-text font-bold text-base sm:text-2xl">
              {char.name}
            </p>
          </motion.div>
        ))}
      </section>
    </main>
  );
};

export default CharGrid;
