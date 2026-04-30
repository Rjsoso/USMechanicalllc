// Color cycling via CSS animation — zero JS overhead after mount
export default function GradientText({ children }) {
  return (
    <span
      style={{
        display: 'inline',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        animation: 'gradientTextCycle 4s ease-in-out infinite',
      }}
    >
      {children}
    </span>
  )
}
