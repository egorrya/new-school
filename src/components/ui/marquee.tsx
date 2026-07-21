export default function Marquee({ items }: { items: string[] }) {
  const marqueeItems = items.map((item) => item.trim()).filter(Boolean)

  if (marqueeItems.length === 0) {
    return null
  }

  const loopItems = [...marqueeItems, ...marqueeItems]

  return (
    <div className="overflow-hidden border-b-2 border-t-2 border-border bg-secondary-background text-foreground font-base">
      <div className="flex w-max min-w-full animate-marquee items-center whitespace-nowrap py-8">
        {loopItems.map((item, index) => {
          return (
            <span
              key={`${item}-${index}`}
              className="mx-4 text-3xl leading-none sm:text-4xl"
            >
              {item}
            </span>
          )
        })}
      </div>
    </div>
  )
}
