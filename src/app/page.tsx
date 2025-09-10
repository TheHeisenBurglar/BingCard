'use client';

import HomeCard from "@/components/homeCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchCards() {
      setLoading(true);
      const res = await fetch('/api/bingocard?type=public');
      const data = await res.json();
      setLoading(false)
      if (data.success) setCards(data.data)
    }
    fetchCards();
  }, [])
  return (
    <div className="p-4 w-full">
      <h1 className="w-full m-auto text-center text-2xl font-black">HOME PAGE</h1>
      {cards?.length === 0 && !loading ? (
        <div>
          <h1 className="alert alert-error alert-outline">Welcome to GridGO!, Looks like there are no cards available... :(</h1>
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="mt-10 space-y-2 grid gap-5 md:grid-cols-2 md:justifty-center lg:grid-cols-3 lg:justify-center">
              <div className="flex w-full flex-col gap-4 mt-10">
                <div className="skeleton h-100 w-full"></div>
                <div className="skeleton h-15 w-28"></div>
                <div className="skeleton h-15 w-full"></div>
                <div className="skeleton h-15 w-full"></div>
              </div>
              <div className="flex w-full flex-col gap-4 mt-10">
                <div className="skeleton h-100 w-full"></div>
                <div className="skeleton h-15 w-28"></div>
                <div className="skeleton h-15 w-full"></div>
                <div className="skeleton h-15 w-full"></div>
              </div>
              <div className="flex w-full flex-col gap-4 mt-10">
                <div className="skeleton h-100 w-full"></div>
                <div className="skeleton h-15 w-28"></div>
                <div className="skeleton h-15 w-full"></div>
                <div className="skeleton h-15 w-full"></div>
              </div>
            </div>

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
      )}
    </div>
  );
}
