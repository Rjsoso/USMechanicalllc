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

  plugins: [
    deskTool({
      structure: deskStructure,
    }),
  ],

  schema: {

    types: schemaTypes,

  },

});

