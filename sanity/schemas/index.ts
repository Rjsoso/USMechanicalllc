import ourServices from './ourServices'
import navLink from '../schemaTypes/navLink'
import service from '../schemaTypes/service'
import serviceWithImage from '../schemaTypes/serviceWithImage'
import serviceItem from '../schemaTypes/serviceItem'
import serviceItemWithImage from '../schemaTypes/serviceItemWithImage'
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
// import servicesPage from './pages/services' // REMOVED: Unused
// import companyInformation from '../schemaTypes/companyInformation' // Replaced by contact schema
import companyStats from '../schemaTypes/companyStats'
import companyInfo from '../schemaTypes/companyInfo' // Added: Missing from exports
import portfolioCategory from '../schemaTypes/portfolioCategory'
import portfolioProject from '../schemaTypes/portfolioProject'
import recognitionProject from '../schemaTypes/recognitionProject'
import expandableServiceBox from '../schemaTypes/expandableServiceBox'
import cardNav from '../schemaTypes/cardNav'
import logoLoop from '../schemaTypes/logoLoop'

export const schemaTypes = [
    ourServices,
    navLink,
    service,
    serviceWithImage,
    serviceItem,
    serviceItemWithImage,
    office,
    affiliate,
    formSettings,
    stat,
    headerSection,
    heroSection,
    aboutAndSafety,
    // servicesSection, // Replaced by ourServices
    // contactSection, // Replaced by contact schema
    contact,
    // servicesPage, // REMOVED: Unused
    // companyInformation, // Replaced by contact schema
    companyStats,
    companyInfo, // Added: Missing from exports
    portfolioCategory,
    portfolioProject,
    recognitionProject,
    expandableServiceBox,
    cardNav,
    logoLoop,
]
