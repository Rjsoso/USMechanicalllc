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
          S.editor()
            .id('headerSection')
            .schemaType('headerSection')
            .documentId('headerSection')
        ),

      // 2. Hero Section
      S.listItem()
        .title('2. Hero Section')
        .child(
          S.editor()
            .id('heroSection')
            .schemaType('heroSection')
            .documentId('heroSection')
        ),

      // 3. About & Safety Section
      S.listItem()
        .title('3. About & Safety Section')
        .child(
          S.editor()
            .id('aboutAndSafety')
            .schemaType('aboutAndSafety')
            .documentId('aboutAndSafety')
        ),

      // 4. Company Stats
      S.listItem()
        .title('4. Company Stats')
        .child(
          S.editor()
            .id('companyStats')
            .schemaType('companyStats')
            .documentId('companyStats')
        ),

      // 5. Our Services Section
      S.listItem()
        .title('5. Our Services Section ⭐')
        .schemaType('ourServices')
        .child(S.documentTypeList('ourServices')),

      // 6. Portfolio
      S.listItem()
        .title('6. Portfolio')
        .child(
          S.list()
            .title('Portfolio')
            .items([
              S.listItem()
                .title('Portfolio Section Settings')
                .child(
                  S.editor()
                    .id('portfolioSection')
                    .schemaType('portfolioSection')
                    .documentId('portfolioSection')
                ),
              S.divider(),
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

      // 7. Logo Loop
      S.listItem()
        .title('7. Logo Loop')
        .child(
          S.editor()
            .id('logoLoop')
            .schemaType('logoLoop')
            .documentId('logoLoop')
        ),

      // 8. Careers Section
      S.listItem()
        .title('8. Careers Section')
        .child(
          S.editor()
            .id('careers')
            .schemaType('careers')
            .documentId('careers')
        ),

      // 9. Contact Page (includes company info for Footer)
      S.listItem()
        .title('9. Contact Page (Footer + Contact)')
        .child(
          S.editor()
            .id('contact')
            .schemaType('contact')
            .documentId('contact')
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
