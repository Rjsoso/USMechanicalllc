import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '3vpl3hho', // your actual project ID
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

