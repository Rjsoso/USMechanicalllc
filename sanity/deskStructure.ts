// deskStructure.ts
import { StructureBuilder } from 'sanity/structure'

export default function deskStructure(S: StructureBuilder) {
  return S.list()
    .title('Content')
    .items([
      // Website sections in order of appearance:
      
      // 1. Header Section
      S.listItem()
        .title('Header Section')
        .child(
          S.document()
            .schemaType('headerSection')
            .documentId('headerSection')
        ),

      // 2. Hero Section
      S.listItem()
        .title('Hero Section')
        .child(
          S.document()
            .schemaType('heroSection')
            .documentId('heroSection')
        ),

      // 3. About & Safety Section
      S.listItem()
        .title('About & Safety Section')
        .child(
          S.document()
            .schemaType('aboutAndSafety')
            .documentId('aboutAndSafety')
        ),

      // 4. Company Stats
      S.listItem()
        .title('Company Stats')
        .child(
          S.document()
            .schemaType('companyStats')
            .documentId('companyStats')
        ),

      // 5. Our Services Section (CardSwap)
      S.listItem()
        .title('Our Services Section (CardSwap)')
        .child(
          S.document()
            .schemaType('ourServices')
            .documentId('ourServices')
        ),

      S.divider(),

      // 6. Portfolio Projects
      S.listItem()
        .title('Portfolio Projects')
        .child(
          S.documentTypeList('portfolioProject')
            .title('Portfolio Projects')
        ),

      // 7. Contact Section
      S.listItem()
        .title('Contact Section')
        .child(
          S.document()
            .schemaType('contact')
            .documentId('contact')
        ),

      // Company Information (used by Footer)
      S.listItem()
        .title('Company Information')
        .child(
          S.document()
            .schemaType('companyInfo')
            .documentId('companyInfo')
        ),

      // 8. Recognition Projects
      S.listItem()
        .title('Recognition Projects')
        .child(
          S.documentTypeList('recognitionProject')
            .title('Recognition Projects')
        ),

      S.divider(),

      // Additional content types
      S.listItem()
        .title('Navigation Links')
        .child(
          S.documentTypeList('navLink')
            .title('Navigation Links')
        ),

      S.listItem()
        .title('Offices')
        .child(
          S.documentTypeList('office')
            .title('Offices')
        ),

      S.listItem()
        .title('Form Settings')
        .child(
          S.document()
            .schemaType('formSettings')
            .documentId('formSettings')
        ),
    ])
}
