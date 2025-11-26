import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: '3vpl3hho', // your actual project ID
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Disable CDN to ensure fresh content after updates
  perspective: 'published', // Only fetch published content
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

