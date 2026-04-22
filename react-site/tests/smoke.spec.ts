import { expect, test } from '@playwright/test'

/**
 * Smoke tests — these are the "if any of these fail, the site is broken"
 * checks. They run only in Chromium by default because webkit/firefox startup
 * adds a lot of noise for very little signal on a marketing site. If you do
 * want cross-browser coverage, remove the `test.skip` guards below.
 */

const isChromium = (browserName: string) => browserName === 'chromium'

test.describe('home page', () => {
  test('loads and shows the main header', async ({ page, browserName }) => {
    test.skip(!isChromium(browserName), 'chromium-only smoke test')

    const response = await page.goto('/')
    expect(response?.ok(), `home page returned ${response?.status()}`).toBeTruthy()

    // Title is set by SEO.jsx for `/`
    await expect(page).toHaveTitle(/US Mechanical/i)

    // Header logo / brand link renders
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
  })

  test('has a working skip-to-main-content link', async ({ page, browserName }) => {
    test.skip(!isChromium(browserName), 'chromium-only smoke test')

    await page.goto('/')

    // The skip link is hidden until focused; focus it.
    await page.keyboard.press('Tab')
    const skipLink = page.locator('.skip-to-main')
    await expect(skipLink).toBeFocused()

    // Clicking it should put focus in #main-content.
    await skipLink.click()
    const main = page.locator('#main-content')
    await expect(main).toBeVisible()
  })

  test('footer exposes Privacy, Terms, and Cookie preferences', async ({ page, browserName }) => {
    test.skip(!isChromium(browserName), 'chromium-only smoke test')

    await page.goto('/')
    const footer = page.locator('footer').first()
    await footer.scrollIntoViewIfNeeded()

    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
    await expect(footer.getByRole('link', { name: 'Terms of Service' })).toBeVisible()
    await expect(
      footer.getByRole('button', { name: /cookie preferences/i })
    ).toBeVisible()
  })
})

test.describe('navigation', () => {
  test('clicking the About link from the home page arrives at /about', async ({
    page,
    browserName,
  }) => {
    test.skip(!isChromium(browserName), 'chromium-only smoke test')

    await page.goto('/')

    // Desktop nav shows /about as a top-level link on wide viewports.
    await page.setViewportSize({ width: 1440, height: 900 })

    // Use the first visible About link from the desktop nav.
    const aboutLink = page.getByRole('link', { name: /^about$/i }).first()
    await aboutLink.click()

    await expect(page).toHaveURL(/\/about\/?$/)
    await expect(page.locator('#main-content')).toBeVisible()
  })
})

test.describe('qualifications page', () => {
  test('loads and exposes credentials content', async ({ page, browserName }) => {
    test.skip(!isChromium(browserName), 'chromium-only smoke test')

    const response = await page.goto('/qualifications')
    expect(response?.ok(), `/qualifications returned ${response?.status()}`).toBeTruthy()

    await expect(page).toHaveTitle(/qualifications/i)
    // The H1 renders immediately from the page (not dependent on Sanity).
    await expect(
      page.getByRole('heading', { level: 1, name: /qualifications/i })
    ).toBeVisible()
    // Primary CTA back to the contact form should always be present.
    await expect(
      page.getByRole('link', { name: /start a project inquiry/i })
    ).toBeVisible()
  })
})

test.describe('contact page', () => {
  test('renders the form with required fields', async ({ page, browserName }) => {
    test.skip(!isChromium(browserName), 'chromium-only smoke test')

    await page.goto('/contact')

    // Contact form has name, email, message, and a submit button.
    await expect(page.getByLabel(/^name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/message/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send|submit/i })).toBeVisible()
  })
})

test.describe('static endpoints', () => {
  test('/robots.txt is served with a Sitemap directive', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.ok()).toBeTruthy()
    const body = await res.text()
    expect(body.toLowerCase()).toContain('sitemap')
  })

  test('/sitemap.xml is served as XML', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.ok()).toBeTruthy()
    const body = await res.text()
    expect(body).toContain('<urlset')
  })

  test('/.well-known/security.txt is served', async ({ request }) => {
    const res = await request.get('/.well-known/security.txt')
    expect(res.ok()).toBeTruthy()
    const body = await res.text()

    // Vite's dev server falls through dotfile paths to index.html, so only
    // assert real contents when the response actually looks like plain text
    // (which is the case under `vite preview` and in production on Vercel).
    if (!body.trim().toLowerCase().startsWith('<!doctype')) {
      expect(body).toContain('Contact:')
      expect(body).toContain('Expires:')
    }
  })
})
