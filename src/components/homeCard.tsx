import "@/app/globals.css";
export default function HomeCard({id, gridSize, title, visibility, author, participants, slotEntries} : {id: string, gridSize: any, title: string, visibility: string, author: string, participants: [string]}) {
    const renderGridPreview = () => {
        const dim = Math.sqrt(gridSize);
        const centerIndex = gridSize % 2 === 1 ? Math.floor(gridSize / 2) : -1; // Only works for odd-sized square grids

        return (
            <div className="w-full overflow-hidden">
                <div
                className="grid gap-1 mt-2 mx-auto w-full"
                style={{ gridTemplateColumns: `repeat(${dim}, minmax(0, 1fr))`, maxWidth: '400px' }}
                >
                {Array.from({ length: gridSize }).map((_, i) => (
                    <div
                    key={i}
                    className={`aspect-square border flex justify-center items-center border-gray-400 ${
                        i === centerIndex
                        ? 'bg-secondary'
                        : slotEntries[i].status === true
                        ? 'bg-green-400 text-secondary'
                        : 'bg-white text-primary'
                    }`}
                    >
                    <p className="text-center text-[min(3vw,0.75rem)] leading-tight p-1 break-words w-full h-full overflow-hidden flex items-center justify-center text-wrap">
  {slotEntries[i].text}
</p>
                    </div>
                ))}
                </div>
            </div>
        );

    };
    return (
        <div className="p-4 border rounded-md space-y-4 max-w-xl mx-auto">
            <figure>
                {renderGridPreview()}
              {/* <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" /> */}
            </figure>
            <div className="card-body">
                {/* <h1>{id}</h1> */}
                <div className="card-actions justify-start">
                    <div className={visibility == "Public" ? "badge badge-soft badge-primary" : "badge badge-soft badge-secondary"}>{author}</div>
                    {participants.map(p => (
                        <div className="badge badge-soft badge-accent">{p}</div>
                    ))}
                </div>
                <h2 className="card-title">
                    {title}
                    <div className={visibility == "Public" ? "badge badge-primary" : "badge badge-secondary"}>{visibility}</div>
                </h2>
                <a className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-primary" href={`/my-cards/${id}`}>View Card</a>
            </div>
        </div>
    )
}
