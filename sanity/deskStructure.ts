// deskStructure.ts
import { StructureBuilder } from 'sanity/structure'

export default function deskStructure(S: StructureBuilder): ReturnType<StructureBuilder['list']> {
  return S.list()
    .title('Content')
    .items([
      // Website sections in exact order of appearance (top to bottom):
      
      // 1. Card Navigation
      S.listItem()
        .title('1. Card Navigation')
        .child(
          S.editor()
            .id('cardNav')
            .schemaType('cardNav')
            .documentId('cardNav')
        ),

      // 2. Header Section
      S.listItem()
        .title('2. Header Section')
        .child(
          S.editor()
            .id('headerSection')
            .schemaType('headerSection')
            .documentId('headerSection')
        ),

      // 3. Hero Section
      S.listItem()
        .title('3. Hero Section')
        .child(
          S.editor()
            .id('heroSection')
            .schemaType('heroSection')
            .documentId('heroSection')
        ),

      // 4. About & Safety Section
      S.listItem()
        .title('4. About & Safety Section')
        .child(
          S.editor()
            .id('aboutAndSafety')
            .schemaType('aboutAndSafety')
            .documentId('aboutAndSafety')
        ),

      // 5. Company Stats
      S.listItem()
        .title('5. Company Stats')
        .child(
          S.editor()
            .id('companyStats')
            .schemaType('companyStats')
            .documentId('companyStats')
        ),

      // 6. Our Services Section (CardSwap)
      S.listItem()
        .title('6. Our Services Section (CardSwap) ⭐')
        .schemaType('ourServices')
        .child(S.documentTypeList('ourServices')),

      // 7. Portfolio
      S.listItem()
        .title('7. Portfolio')
        .child(
          S.list()
            .title('Portfolio')
            .items([
              S.listItem()
                .title('Categories')
                .child(
                  S.documentTypeList('portfolioCategory')
                    .title('Portfolio Categories')
                ),
              S.listItem()
                .title('Projects')
                .child(
                  S.documentTypeList('portfolioProject')
                    .title('Portfolio Projects')
                ),
            ])
        ),

      // 8. Logo Loop
      S.listItem()
        .title('8. Logo Loop')
        .child(
          S.editor()
            .id('logoLoop')
            .schemaType('logoLoop')
            .documentId('logoLoop')
        ),

      // 9. Contact Section
      S.listItem()
        .title('9. Contact Section')
        .child(
          S.editor()
            .id('contact')
            .schemaType('contact')
            .documentId('contact')
        ),

      // 10. Company Information (used by Footer)
      S.listItem()
        .title('10. Company Information (Footer)')
        .child(
          S.editor()
            .id('companyInfo')
            .schemaType('companyInfo')
            .documentId('companyInfo')
        ),

      // 11. Recognition Projects
      S.listItem()
        .title('11. Recognition Projects')
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
          S.editor()
            .id('formSettings')
            .schemaType('formSettings')
            .documentId('formSettings')
        ),
    ])
}
