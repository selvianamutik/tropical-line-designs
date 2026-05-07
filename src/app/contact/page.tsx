import Image from "next/image";
import { SiteNav } from "@/components/global/site-nav";
import { MapClient } from "@/components/contact/map-client";
import { ProjectsSimpleFooter } from "@/components/global/site-nav";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FDFBF7]">
      {/* Navbar will handle its own styling based on scroll/page */}
      <SiteNav />

      {/* Main Content dengan Map Layout & Text Info */}
      <section className="relative w-full pt-40 pb-24 flex flex-col items-center z-10">
        {/* Grey strip background that goes behind the map */}
        <div className="absolute top-[250px] inset-x-0 h-[300px] bg-[#e0ded6] -z-10" />

        {/* Map Container */}
        <div className="w-full max-w-5xl px-6 md:px-12 h-[500px]">
          <MapClient />
        </div>

        {/* Contact Information Cards */}
        <div className="w-full max-w-4xl px-8 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-[#383532]">
            {/* Location */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] tracking-widest uppercase font-semibold text-[#8a867f]">Location</h4>
              <div>
                <p className="font-medium text-lg leading-snug">Jl. Badak Agung VI No.8,</p>
                <p className="font-light text-sm mt-1 leading-relaxed font-inter text-neutral-600">
                  Sumerta Kelod, Kec. Denpasar Tim.<br/>
                  Kota Denpasar, Bali 80234
                </p>
              </div>
            </div>

            {/* General Inquiries */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] tracking-widest uppercase font-semibold text-[#8a867f]">General Inquiries</h4>
              <p className="font-light text-base text-neutral-800 font-inter">bali.tropicalline@gmail.com</p>
            </div>

            {/* Phone & Digital */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] tracking-widest uppercase font-semibold text-[#8a867f]">Call Our Studio</h4>
                <p className="font-light text-base text-neutral-800 font-inter">+62 361 245990</p>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-[10px] tracking-widest uppercase font-semibold text-[#8a867f]">Digital Presence</h4>
                <div className="flex gap-6 font-inter font-light text-sm">
                  <a href="#" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                    Instagram <span>↗</span>
                  </a>
                  <a href="#" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                    LinkedIn <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Image */}
      <section className="relative w-full h-[50vh] min-h-[400px]">
        {/* Soft gradient to blend with bg */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#FDFBF7] to-transparent z-10" />
        <Image
          src="/sofitel/so-1.jpg"
          alt="Coastal Resort"
          fill
          className="object-cover"
        />
      </section>

      <ProjectsSimpleFooter />
    </main>
  );
}
