import StaggeredMenu from './StaggeredMenu';

const menuItems = [
  { label: 'About', ariaLabel: 'Learn about us', link: '#about' },
  { label: 'Services', ariaLabel: 'View our services', link: '#services' },
  { label: 'Portfolio', ariaLabel: 'View our portfolio', link: '#portfolio' },
  { label: 'Careers', ariaLabel: 'View careers', link: '#careers' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
];

export default function Header() {
  return (
    <>
      {/* Logo - Separate, positioned in top-left corner */}
      <div className="fixed top-4 left-4 z-50">
        <img
          src="/logo.png"
          alt="US Mechanical"
          className="h-32 md:h-40 w-auto object-contain transition-all duration-500"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* StaggeredMenu - positioned fixed */}
      <div className="fixed top-0 right-0 w-full h-screen z-50">
        <StaggeredMenu
          position="right"
          items={menuItems}
          displaySocials={false}
          displayItemNumbering={true}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          colors={['#1e1e22', '#35353c']}
          logoUrl=""
          accentColor="#003A70"
          isFixed={true}
          closeOnClickAway={true}
        />
      </div>
    </>
  );
}
