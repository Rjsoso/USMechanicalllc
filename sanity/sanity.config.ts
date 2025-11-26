import { defineConfig } from 'sanity';

import { deskTool } from 'sanity/desk';

import { visionTool } from '@sanity/vision';

import { schemaTypes } from './schemas';

import deskStructure from './deskStructure';



export default defineConfig({

  name: 'default',

  title: 'US Mechanical',
  
  projectId: '3vpl3hho',

  dataset: 'production',     // ✅ match what's in your Sanity project

  basePath: '/studio', // Add basePath for dashboard support

  plugins: [
    deskTool({
      structure: deskStructure,
    }),
    visionTool(), // Add Vision tool to query all documents
  ],

  schema: {

    types: schemaTypes,

  },

});

