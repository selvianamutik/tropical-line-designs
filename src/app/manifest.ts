import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tropical Line Designs',
    short_name: 'TLD',
    description: 'Premier landscape architecture firm specializing in tropical resort, hotel, and villa design in Bali, Indonesia since 1990',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdf9f1',
    theme_color: '#383532',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
