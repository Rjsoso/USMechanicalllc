import ourServices from '../schemas/ourServices'
import headerSection from './headerSection'
import navLink from './navLink'
import heroSection from './heroSection'
import aboutAndSafety from './aboutAndSafety'
// import contactSection from './contactSection' // Replaced by contact schema
import service from './service'
import serviceWithImage from './serviceWithImage'
import serviceItem from './serviceItem'
import serviceItemWithImage from './serviceItemWithImage'
// import servicesSection from './servicesSection' // REMOVED: Replaced by ourServices schema
import office from './office'
import affiliate from './affiliate'
import formSettings from './formSettings'
import stat from './stat'
import contact from '../schemas/pages/contact'
// import servicesPage from '../schemas/pages/services' // REMOVED: Unused
// import companyInformation from './companyInformation' // Replaced by contact schema
import companyStats from './companyStats'
import companyInfo from './companyInfo'
import portfolioCategory from './portfolioCategory'
import portfolioProject from './portfolioProject'
import recognitionProject from './recognitionProject'
import expandableServiceBox from './expandableServiceBox'
// import cardNav from './cardNav' // REMOVED: Merged into headerSection
import logoLoop from './logoLoop'

export const schema = {
  types: [
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
    // servicesSection, // REMOVED: Replaced by ourServices schema
    // contactSection, // Replaced by contact schema
    contact,
    // servicesPage, // REMOVED: Unused
    companyStats,
    companyInfo,
    portfolioCategory,
    portfolioProject,
    recognitionProject,
    expandableServiceBox,
    // cardNav, // REMOVED: Merged into headerSection
    logoLoop,
  ],
}

