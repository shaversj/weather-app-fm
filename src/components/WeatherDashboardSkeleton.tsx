import loadingIcon from "/icon-loading.svg";

function StatPlaceholder({ label }: { label: string }) {
  return (
    <div className="max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-neutral-800 p-5 md:max-h-none md:max-w-none">
      <h3 className="text-preset-6 text-neutral-200">{label}</h3>
      <span className="text-preset-3 text-nowrap text-neutral-200">-</span>
    </div>
  );
}

export function WeatherDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-x-8 pt-12 lg:flex-row lg:justify-center">
      <section>
        <div className="grid h-[286px] w-full max-w-[800px] place-items-center rounded-4xl bg-neutral-800/95">
          <div className="flex flex-col items-center">
            <img alt="Loading" src={loadingIcon} />
            <p className="text-preset-6 text-white">Loading...</p>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-wrap gap-x-6 gap-y-4 md:flex-nowrap">
          <StatPlaceholder label="Feels Like" />
          <StatPlaceholder label="Humidity" />
          <StatPlaceholder label="Wind" />
          <StatPlaceholder label="Precipitation" />
        </div>

        <h2 className="text-preset-4 pt-12 text-neutral-200">Daily forecast</h2>
        <div className="flex flex-wrap gap-4 pt-5">
          {Array.from({ length: 7 }).map((_, index) => (
            <div className="h-[110px] min-w-[96px] flex-[1_1_100px] rounded-xl bg-neutral-800 lg:h-[110px]" key={index} />
          ))}
        </div>
      </section>

      <section className="z-0 mt-8 w-full max-w-[384px] rounded-xl bg-neutral-800 px-6 lg:mt-0">
        <div className="flex items-center justify-between pt-6">
          <h2 className="text-preset-5 text-neutral-200">Hourly forecast</h2>
          <div className="h-10 w-20 rounded-lg bg-neutral-600" />
        </div>
        <div className="space-y-4 pt-4 pb-6">
          {Array.from({ length: 7 }).map((_, index) => (
            <div className="h-[60px] rounded-lg bg-neutral-600" key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
