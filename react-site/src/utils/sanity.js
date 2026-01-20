import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: "3vpl3hho",
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: true,
});

// Write-capable client for admin operations (uses token)
export const writeClient = createClient({
  projectId: "3vpl3hho",
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

// Helper function to fetch content from Sanity
export async function fetchContent(query, params = {}) {
  try {
    const data = await client.fetch(query, params);
    return data;
  } catch (error) {
    console.error("Error fetching from Sanity:", error);
    return null;
  }
}

// Queries for different sections
export const queries = {
  hero: `*[_type == "heroSection"][0]`,
  about: `*[_type == "aboutAndSafety"][0]`,
  safety: `*[_type == "aboutAndSafety"][0]`,
  contact: `*[_type == "contact"][0]`,
};
