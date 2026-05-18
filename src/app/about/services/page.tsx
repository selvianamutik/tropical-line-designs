import { listPublicServices } from "@/lib/public/services";

export default async function AboutServicesPage() {
  const services = await listPublicServices();

  return (
    <div className="flex flex-col gap-12 pb-24">
      <div>
        <h1 className="text-5xl font-medium text-black md:text-6xl">SERVICES</h1>
        <p className="mt-6 max-w-2xl font-inter text-lg font-light leading-relaxed text-neutral-600">
          Tropical Line Design provides focused landscape services from concept through implementation, shaped for
          hospitality, residential, and commercial environments.
        </p>
      </div>

      <div className="grid gap-5 border-y border-neutral-200 py-6">
        {services.map((service, index) => (
          <article key={service.id} className="grid gap-4 border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0 md:grid-cols-[88px_minmax(0,1fr)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
              {String(index + 1).padStart(2, "0")}
            </p>
            <div>
              <h2 className="text-2xl font-medium leading-tight text-black md:text-3xl">{service.title}</h2>
              {service.description ? (
                <p className="mt-3 max-w-2xl font-inter text-base font-light leading-7 text-neutral-600">
                  {service.description}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
