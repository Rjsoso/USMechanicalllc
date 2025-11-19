// deskStructure.ts
import { StructureBuilder } from 'sanity/structure'

export default function deskStructure(S: StructureBuilder) {
  return S.list()
    .title('Content')
    .items([
      // Singletons / single-doc types first:
      S.listItem()
        .title('Header Section')
        .child(
          S.document()
            .schemaType('headerSection')
            .documentId('headerSection')
        ),

      S.listItem()
        .title('Hero Section')
        .child(
          S.document()
            .schemaType('heroSection')
            .documentId('heroSection')
        ),

      S.listItem()
        .title('About & Safety Section')
        .child(
          S.document()
            .schemaType('aboutAndSafety')
            .documentId('aboutAndSafety')
        ),

      // Collections / repeating items
      S.divider(),

      S.listItem()
        .title('Portfolio Projects')
        .child(
          S.documentTypeList('portfolioProject')
            .title('Portfolio Projects')
        ),

      S.listItem()
        .title('Contact Section')
        .child(
          S.document()
            .schemaType('contactSection')
            .documentId('contactSection')
        ),

      S.listItem()
        .title('Company Information')
        .child(
          S.document()
            .schemaType('companyInformation')
            .documentId('companyInformation')
        ),

      // Recognition projects
      S.listItem()
        .title('Recognition Projects')
        .child(
          S.documentTypeList('recognitionProject')
            .title('Recognition Projects')
        ),
    ])
}

