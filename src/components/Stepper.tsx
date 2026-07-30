export function Stepper({ current, total = 6 }: { current: number; total?: number }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center px-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
        const done = n <= current;
        return (
          <div key={n} className="flex flex-1 items-center last:flex-none">
            <div
              className={[
                "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold",
                done
                  ? "bg-brand-navy text-brand-navy-foreground"
                  : "bg-step-idle text-step-idle-foreground",
              ].join(" ")}
            >
              {n}
            </div>
            {n < total && (
              <div
                className={[
                  "h-1 w-full",
                  n < current ? "bg-brand-navy" : "bg-step-idle",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
