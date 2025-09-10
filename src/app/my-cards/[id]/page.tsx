"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function cardPage() {
  const params = useParams();
  const { id } = params;
  const [card, setCard] = useState<any>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchCard() {
      setLoading(true);
      const res = await fetch(`/api/bingocard?id=${id}`);
      const data = await res.json();
      setLoading(false)
      if (data.success) setCard(data.data[0]);
    }
    fetchCard();
  }, []);

  const renderGridPreview = () => {
    if (!card) return null;
    const gridSize = card.gridsize;

    const dim = Math.sqrt(gridSize);
    const centerIndex = gridSize % 2 === 1 ? Math.floor(gridSize / 2) : -1;

    return (
      <div
        className="grid gap-1 mt-2 w-full"
        style={{
          gridTemplateColumns: `repeat(${dim}, 1fr)`,
        }}
      >
        {Array.from({ length: gridSize }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square border border-gray-400 flex justify-center items-center overflow-hidden ${i === centerIndex
              ? "bg-primary text-accent pointer-events-none"
              : card?.slotEntries[i].status
                ? "bg-primary text-accent"
                : "bg-accent text-primary hover:bg-secondary hover:cursor-pointer hover:text-white"
              }`}
            onClick={() => handleSetStatus(i, true)}
          >
            <p className="text-center text-[min(2vw,0.75rem)] leading-tight p-1 break-words w-full h-full flex items-center justify-center text-wrap">
              {card?.slotEntries[i].text}
            </p>
          </div>
        ))}
      </div>
    );
  };


  const handleSetStatus = async (index: number, status: boolean) => {
    console.log(index, status);

    const updatedCard = {
      ...card,
      slotEntries: card.slotEntries.map((slot: any, i: number) =>
        i === index ? { ...slot, status } : slot
      ),
    };

    setCard(updatedCard);

    try {
      const res = await fetch(`/api/bingocard?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCard),
      });

      const data = await res.json();
      //   if (res.ok && data.success) {
      //     setCard(data.data[0]); // This assumes API returns updated card
      //   }
    } catch (error) {
      console.error("Error setting status: ", error);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex w-full max-w-xl m-auto flex-col gap-4 mt-10">
          <div className="skeleton h-100 w-full"></div>
          <div className="skeleton h-15 w-28"></div>
          <div className="skeleton h-15 w-full"></div>
          <div className="skeleton h-15 w-full"></div>
        </div>
      ) :
        card?.length === 0 ? (
          <h1>Error finding card</h1>
        ) : (
          <div className="card bg-base-100 max-w-xl w-full shadow-sm m-auto z-0 p-4">
            <figure>
              {renderGridPreview()}
              {/* <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" /> */}
            </figure>
            <div className="card-body">
              {/* <h1>{id}</h1> */}
              <div className="card-actions justify-start">
                <div
                  className={
                    card?.visibility == "Public"
                      ? "badge badge-soft badge-primary"
                      : "badge badge-soft badge-secondary"
                  }
                >
                  {card?.author}
                </div>
              </div>
              <h2 className="card-title">{card?.name}</h2>
            </div>
          </div>
        )}

    </div>
  );
}
