// deskStructure.ts
import { StructureBuilder } from '@sanity/structure'

export default function deskStructure() {
  return StructureBuilder.list()
    .title('Content')
    .items([
      // Singletons / single-doc types first:
      StructureBuilder.listItem()
        .title('Header Section')
        .child(
          StructureBuilder.document()
            .schemaType('headerSection')
            .documentId('headerSection')
        ),

      StructureBuilder.listItem()
        .title('Hero Section')
        .child(
          StructureBuilder.document()
            .schemaType('heroSection')
            .documentId('heroSection')
        ),

      StructureBuilder.listItem()
        .title('About & Safety Section')
        .child(
          StructureBuilder.document()
            .schemaType('aboutAndSafety')
            .documentId('aboutAndSafety')
        ),

      // Collections / repeating items
      StructureBuilder.divider(),

      StructureBuilder.listItem()
        .title('Portfolio Projects')
        .child(
          StructureBuilder.documentTypeList('portfolioProject')
            .title('Portfolio Projects')
        ),

      StructureBuilder.listItem()
        .title('Contact Section')
        .child(
          StructureBuilder.document()
            .schemaType('contactSection')
            .documentId('contactSection')
        ),

      StructureBuilder.listItem()
        .title('Company Information')
        .child(
          StructureBuilder.document()
            .schemaType('companyInformation')
            .documentId('companyInformation')
        ),

      // Recognition projects
      StructureBuilder.listItem()
        .title('Recognition Projects')
        .child(
          StructureBuilder.documentTypeList('recognitionProject')
            .title('Recognition Projects')
        ),
    ])
}

