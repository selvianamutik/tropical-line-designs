import Script from 'next/script';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'breadcrumb' | 'project';
  data?: Record<string, any>;
}

export function StructuredData({ type, data = {} }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tropicallinedesigns.com';

  const schemas: Record<string, any> = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Tropical Line Designs',
      alternateName: 'TLD',
      url: baseUrl,
      logo: `${baseUrl}/logo/logo.png`,
      description: 'Premier landscape architecture firm specializing in tropical resort, hotel, and villa design in Bali, Indonesia since 1990',
      foundingDate: '1990',
      founder: {
        '@type': 'Person',
        name: 'Tamyani Adi Kusumo',
        jobTitle: 'Principal',
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ID',
        addressRegion: 'Bali',
      },
      sameAs: [
        data.instagramUrl || '',
        data.linkedinUrl || '',
      ].filter(Boolean),
      areaServed: {
        '@type': 'Country',
        name: 'Indonesia',
      },
      serviceType: [
        'Landscape Architecture',
        'Landscape Design',
        'Landscape Construction',
        'Resort Landscape Design',
        'Hotel Landscape Design',
        'Villa Landscape Design',
        'Tropical Garden Design',
      ],
      knowsAbout: [
        'Tropical Landscape Architecture',
        'Resort Design',
        'Sustainable Landscape Design',
        'Balinese Architecture',
        'Hospitality Landscape Design',
      ],
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Tropical Line Designs',
      url: baseUrl,
      description: 'Landscape architecture and construction services for tropical resorts, hotels, and villas in Indonesia',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/projects?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.items || [],
    },
    project: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: data.title || '',
      description: data.description || '',
      image: data.image || '',
      creator: {
        '@type': 'Organization',
        name: 'Tropical Line Designs',
      },
      locationCreated: {
        '@type': 'Place',
        name: data.location || '',
      },
      dateCreated: data.year || '',
      genre: 'Landscape Architecture',
    },
  };

  const schema = schemas[type];

  if (!schema) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
