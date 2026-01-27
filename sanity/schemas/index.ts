import ourServices from './ourServices'
import navLink from '../schemaTypes/navLink'
import drawerLink from '../schemaTypes/drawerLink'
import drawerSection from '../schemaTypes/drawerSection'
import office from '../schemaTypes/office'
import affiliate from '../schemaTypes/affiliate'
import formSettings from '../schemaTypes/formSettings'
import stat from '../schemaTypes/stat'
import headerSection from '../schemaTypes/headerSection'
import heroSection from '../schemaTypes/heroSection'
import aboutAndSafety from '../schemaTypes/aboutAndSafety'
// import contactSection from '../schemaTypes/contactSection' // Replaced by contact schema
// import servicesSection from '../schemaTypes/servicesSection' // Replaced by ourServices
import contact from './pages/contact'
import companyStats from '../schemaTypes/companyStats'
import portfolioCategory from '../schemaTypes/portfolioCategory'
import portfolioProject from '../schemaTypes/portfolioProject'
import portfolioSection from '../schemaTypes/portfolioSection'
// import cardNav from '../schemaTypes/cardNav' // REMOVED: Merged into headerSection
import logoLoop from '../schemaTypes/logoLoop'
import careers from '../schemaTypes/careers'

export const schemaTypes = [
    ourServices,
    navLink,
    drawerLink,
    drawerSection,
    office,
    affiliate,
    formSettings,
    stat,
    headerSection,
    heroSection,
    aboutAndSafety,
    contact,
    companyStats,
    portfolioCategory,
    portfolioProject,
    portfolioSection,
    // cardNav, // REMOVED: Merged into headerSection
    logoLoop,
    careers,
]
