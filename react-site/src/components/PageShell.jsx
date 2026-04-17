import Header from './Header'
import Footer from './Footer'

const DEFAULT_HEADER_OFFSET_PX = 180

export default function PageShell({
  children,
  Main = 'main',
  className = 'min-h-screen bg-white text-black',
  style,
  headerOffsetPx = DEFAULT_HEADER_OFFSET_PX,
  includeFooter = true,
  includeHeader = true,
  ...rest
}) {
  return (
    <>
      {includeHeader && <Header />}
      <Main
        className={className}
        style={{ paddingTop: `${headerOffsetPx}px`, ...style }}
        {...rest}
      >
        {children}
      </Main>
      {includeFooter && <Footer />}
    </>
  )
}

