import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: '3vpl3hho', // your actual project ID
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: import.meta.env.PROD, // Only use CDN in production to avoid CORS issues in dev
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

