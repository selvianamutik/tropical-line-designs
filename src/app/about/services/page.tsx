import Image from "next/image";
import { listPublicServices } from "@/lib/public/services";

export const dynamic = "force-dynamic";

function isSupabaseStorageUrl(value: string) {
  return value.includes("/storage/v1/object/public/");
}

export default async function AboutServicesPage() {
  const services = await listPublicServices();

  return (
    <div className="flex flex-col gap-12 pb-24">
      <div>
        <h1 className="text-5xl font-medium text-black md:text-6xl">SERVICES</h1>
        <p className="mt-6 max-w-3xl font-inter text-lg font-light leading-relaxed text-neutral-600">
          Tropical Line Design focuses its landscape practice into design and build, carrying tropical landscape
          concepts from visual planning into built reality.
        </p>
      </div>

      <div className="grid gap-5 border-y border-neutral-200 py-6">
        {services.map((service, index) => (
          <article
            key={service.id}
            className="grid gap-4 border-b border-neutral-200 pb-6 last:border-b-0 last:pb-0 md:grid-cols-[88px_minmax(0,1fr)]"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
              {String(index + 1).padStart(2, "0")}
            </p>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div>
                <h2 className="text-2xl font-medium leading-tight text-black md:text-3xl">{service.title}</h2>
                {service.description ? (
                  <p className="mt-3 max-w-6xl font-inter text-base font-light leading-8 text-neutral-600">
                    {service.description}
                  </p>
                ) : null}
              </div>
              {service.images.length > 0 ? (
                <div className="grid w-56 grid-rows-2 gap-3">
                  {service.images.slice(0, 2).map((image, imageIndex) => (
                    <div
                      key={`${service.id}-${image}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-100"
                    >
                      <Image
                        src={image}
                        alt={`${service.title} service image ${imageIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 210px"
                        className="object-cover"
                        unoptimized={isSupabaseStorageUrl(image)}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
