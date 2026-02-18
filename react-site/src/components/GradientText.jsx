// Color cycling via CSS animation — zero JS overhead after mount
export default function GradientText({ children }) {
  return (
    <span
      style={{
        display: 'inline',
        fontFamily: 'Rubik, sans-serif',
        fontWeight: 900,
        animation: 'gradientTextCycle 4s ease-in-out infinite',
      }}
    >
      {children}
    </span>
  )
}
