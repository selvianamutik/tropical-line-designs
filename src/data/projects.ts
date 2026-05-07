export type GalleryLayout = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

export type ProjectRecord = {
  slug: string;
  title: string;
  location: string;
  year: string;
  type: string;
  image: string; // thumbnail
  images?: string[]; // gallery photos (up to 4)
  galleryLayout?: GalleryLayout; // which template to use
  status?: string;
  architect?: string;
  landscapeConsultant?: string;
  client?: string;
  projectSize?: string;
  description?: string;
};

export const projects: ProjectRecord[] = [
  {
    slug: "sofitel-resort",
    title: "Sofitel Resort",
    location: "Nusa dua bali",
    year: "2012 - 2013",
    type: "Landscape Build",
    status: "Completed",
    client: "PT. Griya Pancaloka",
    galleryLayout: "A",
    image: "/sofitel/so-1.jpg",
    images: [
      "/sofitel/so-1.jpg",
      "/sofitel/so-2.png",
      "/sofitel/so-3.jpg",
      "/sofitel/so-4.jpg",
    ],
  },
  {
    slug: "bajo-well-water-villa",
    title: "Bajo Well Water Villa",
    location: "Labuan bajo",
    year: "2024",
    type: "Landscape design",
    status: "On progress",
    architect: "Han Awal & Partners",
    client: "PT. Surya Cahaya Properti",
    projectSize: "2.1 ha",
    galleryLayout: "B",
    description:
      "A villa landscape concept that frames terrain, water, and cultural gestures into a layered tropical sequence.",
    image:
      "/bajo-well/bw-3.jpg",
    images: [
      "/bajo-well/bw-3.jpg",
      "/bajo-well/bw-4.jpg",
      "/bajo-well/bw-1.jpg",
      "/bajo-well/bw-2.jpg",
    ],
  },
  {
    slug: "st-regis-bali",
    title: "St. Regis Bali",
    location: "Nusa Dua, Bali",
    year: "2008 - 2009",
    type: "Resort landscape",
    landscapeConsultant: "bensley design studio",
    client: "rajawali corp.",
    status: "Completed",
    projectSize: "9.0 ha",
    galleryLayout: "D",
    image:
      "/st-regis-bali/stb-1.png",
    images: [
      "/st-regis-bali/stb-1.png",
    ],
  },
  {
    slug: "radisson-blu",
    title: "Radisson Blu",
    location: "Uluwatu bali",
    year: "2016-2017",
    type: "Landscape build",
    status: "Completed",
    architect: "Intaran Design",
    client: "PT. Mitra Kencana Bakti",
    projectSize: "5.7 ha",
    galleryLayout: "F",
    description:
      "A hospitality-focused landscape build balancing arrival moments, guest circulation, and ocean-facing leisure zones.",
    image:
      "/radison-blu/rb-3.jpg",
    images: [
      "/radison-blu/rb-3.jpg",
      "/radison-blu/rb-1.jpg",
      "/radison-blu/rb-2.jpg",
    ],
  },
  {
    slug: "four-seasons-hotel",
    title: "Four Seasons Hotel",
    location: "Jakarta",
    year: "2015 - 2017",
    type: "Landscape build",
    status: "Completed",
    landscapeConsultant: "bensley design studio",
    client: "pt. Rajawali",
    projectSize: "1.2 ha",
    galleryLayout: "D",
    description:
      "A private estate with layered tropical planting, curated stone paths, and understated water features.",
    image:
      "/four-season/fs-1.jpg",
    images: [
      "/four-season/fs-1.jpg",
    ],
  },
  {
    slug: "anantara-hotel-and-resort",
    title: "Anantara Hotel & Resort",
    location: "Ubud bali",
    year: "2016",
    type: "Landscape Desain & Build",
    status: "ongoing",
    architect: "aboday",
    client: "wika reality",
    projectSize: "3.6 ha",
    galleryLayout: "E",
    description:
      "A boutique retreat with palm-framed sea views and a restrained material palette designed for calm luxury.",
    image:
      "/anantara/an-5.jpg",
    images: [
      "/anantara/an-5.jpg",
      "/anantara/an-2.png",
      "/anantara/an-4.jpg",
      "/anantara/an-3.jpg",
    ],
  },
  {
    slug: "st-regis-resort",
    title: "St. Regis Resort",
    location: "Jakarta",
    year: "2008 - 2009",
    type: "landscape build",
    status: "Completed",
    landscapeConsultant: "bensley design studio",
    client:"rajawali corp.",
    projectSize: "0.8 ha",
    galleryLayout: "D",
    image:
      "/st-regis-jakarta/stj-1.png",
    images: [
      "/st-regis-jakarta/stj-1.png",
    ],
  },
  {
    slug: "Ibu-kota-negara-indonesia",
    title: "Ibu Kota Nusantara",
    location: "kalimantan timur",
    year: "2023",
    type: "landscape build & design istana negara dan kantor presiden",
    status: "On Progress",
    projectSize: "1.6 ha",
    client: "kementrian PUPR",
    galleryLayout: "C",
    image:
      "/ikn/ikn-1.jpg",
    images: [
      "/ikn/ikn-1.jpg",
      "/ikn/ikn-2.jpg",
      "/ikn/ikn-3.jpg",
    ],
  },
  {
    slug: "alila-hotel-seminyak",
    title: "Alila Hotel Seminyak",
    location: "Seminyak Bali",
    year: "2014",
    type: "landscape build",
    status: "completed",
    projectSize: "12 ha",
    galleryLayout: "G",
    image:
      "/alila/al-1.jpg",
    images: [
      "/alila/al-1.jpg",
      "/alila/al-2.jpg",
      "/alila/al-3.jpg",
      "/alila/al-4.jpg",
    ],
  },
  {
    slug: "likupang-eco-family-resort",
    title: "Likupang Eco Family Resort",
    location: "likupang manado",
    year: "2021",
    type: "landscape desain",
    status: "ongoing",
    architect: "PWD architechts & wOW architects",
    client: "PT. bhineka panca wisata",
    projectSize: "40.8 ha",
    galleryLayout: "H",
    image:
      "/likupang-eco/le-1.jpg",
    images: [
      "/likupang-eco/le-1.jpg",
      "/likupang-eco/le-2.jpg",
      "/likupang-eco/le-3.jpg",
    ],
  },
  {
    slug: "shangri-la-hotel-and-villa",
    title: "Shangri-La Hotel & Villa",
    location: "nusa dua bali",
    year: "2015",
    type: "landscape build & design ",
    status: "On Going",
    architect: "department of architect",
    client: "PT. narendra interpacific indonesia",
    projectSize: "2.8 ha",
    galleryLayout: "I",
    image:
      "/shangri-la/sl-1.jpg",
    images: [
      "/shangri-la/sl-3.jpg",
      "/shangri-la/sl-2.jpg",
      "/shangri-la/sl-1.jpg",
    ],
  },
  {
    slug: "fairmont-sanur-beach-bali",
    title: "Fairmont Sanur Beach Bali",
    location: "sanur bali",
    year: "2011",
    type: "landscape build",
    status: "Completed",
    projectSize: "3.2 ha",
    galleryLayout: "J",
    image:
      "/fairmont/fm-2.jpg",
    images: [
      "/fairmont/fm-1.jpg",
      "/fairmont/fm-2.jpg",
      "/fairmont/fm-3.jpg",
    ],
  },
];
