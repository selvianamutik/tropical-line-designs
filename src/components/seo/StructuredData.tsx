import Script from 'next/script';
import { absoluteUrl, ORGANIZATION_LOGO_PATH, SITE_URL } from '@/lib/seo';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'breadcrumb' | 'project';
  data?: Record<string, unknown>;
}

export function StructuredData({ type, data = {} }: StructuredDataProps) {
  const baseUrl = SITE_URL;
  const sameAs = [
    'https://www.instagram.com/tropicallinedesign/',
    data.instagramUrl,
    data.linkedinUrl,
  ].filter((value): value is string => typeof value === 'string' && value.length > 0);

  const schemas: Record<string, unknown> = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Tropical Line Designs',
      alternateName: 'TLD',
      url: baseUrl,
      logo: absoluteUrl(ORGANIZATION_LOGO_PATH),
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
      sameAs,
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
