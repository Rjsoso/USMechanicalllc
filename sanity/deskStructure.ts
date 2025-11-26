// deskStructure.ts
import { StructureBuilder } from 'sanity/structure'

export default function deskStructure(S: StructureBuilder): ReturnType<StructureBuilder['list']> {
  return S.list()
    .title('Content')
    .items([
      // Website sections in exact order of appearance (top to bottom):
      
      // 1. Header Section
      S.listItem()
        .title('1. Header Section')
        .child(
          S.document()
            .schemaType('headerSection')
            .documentId('headerSection')
            .initialValueTemplate('headerSection.default')
        ),

      // 2. Hero Section
      S.listItem()
        .title('2. Hero Section')
        .child(
          S.document()
            .schemaType('heroSection')
            .documentId('heroSection')
            .initialValueTemplate('heroSection.default')
        ),

      // 3. About & Safety Section
      S.listItem()
        .title('3. About & Safety Section')
        .child(
          S.document()
            .schemaType('aboutAndSafety')
            .documentId('aboutAndSafety')
            .initialValueTemplate('aboutAndSafety.default')
        ),

      // 4. Company Stats
      S.listItem()
        .title('4. Company Stats')
        .child(
          S.document()
            .schemaType('companyStats')
            .documentId('companyStats')
            .initialValueTemplate('companyStats.default')
        ),

      // 5. Our Services Section (CardSwap)
      S.listItem()
        .title('5. Our Services Section (CardSwap) ⭐')
        .child(
          S.document()
            .schemaType('ourServices')
            .documentId('ourServices')
            .initialValueTemplate('ourServices.default')
        ),

      // 6. Portfolio Projects
      S.listItem()
        .title('6. Portfolio Projects')
        .child(
          S.documentTypeList('portfolioProject')
            .title('Portfolio Projects')
        ),

      // 7. Contact Section
      S.listItem()
        .title('7. Contact Section')
        .child(
          S.document()
            .schemaType('contact')
            .documentId('contact')
            .initialValueTemplate('contact.default')
        ),

      // 8. Company Information (used by Footer)
      S.listItem()
        .title('8. Company Information (Footer)')
        .child(
          S.document()
            .schemaType('companyInfo')
            .documentId('companyInfo')
            .initialValueTemplate('companyInfo.default')
        ),

      // 9. Recognition Projects
      S.listItem()
        .title('9. Recognition Projects')
        .child(
          S.documentTypeList('recognitionProject')
            .title('Recognition Projects')
        ),

      S.divider(),

      // Supporting content types
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
            .initialValueTemplate('formSettings.default')
        ),
    ])
}
