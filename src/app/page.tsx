'use client';

import HomeCard from "@/components/homeCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    async function fetchCards() {
      const res = await fetch('/api/bingocard?type=public');
      const data = await res.json();
      if (data.success) setCards(data.data)
    }
    fetchCards();
  }, [])
  return (
    <div className="p-4 w-full">
      <h1 className="w-full m-auto text-center text-2xl font-black">HOME PAGE</h1>
      {cards?.length === 0 ? (
        <h1 className="alert alert-error alert-outline">Welcome to GridGO!, Looks like there are no cards available... :(</h1>
      ) : (
        <div className="mt-10 space-y-2 grid gap-5 md:grid-cols-2 md:justify-center lg:grid-cols-3 lg:justify-center">
          {cards?.map((f: any) => (
            <HomeCard
              id={f._id}
              gridSize={f.gridsize}
              title={f.name}
              visibility={f.public}
              author={f.author}
              participants={f.participants}
              slotEntries={f.slotEntries}
            />
          ))}
        </div>
      )}
    </div>
  );
}
