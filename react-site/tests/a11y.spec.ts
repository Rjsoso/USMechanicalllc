import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility smoke tests using axe-core. We assert zero *serious* or
 * *critical* violations on the most-visited pages. Less-severe issues
 * (minor, moderate) are logged but don't fail the build so we don't get
 * stuck on subjective calls like "is this contrast *exactly* 4.5:1".
 *
 * If a genuine regression happens (missing alt text, empty buttons,
 * keyboard trap, etc.) this will catch it.
 */

const PAGES: { path: string; name: string }[] = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/portfolio', name: 'portfolio' },
  { path: '/contact', name: 'contact' },
  { path: '/careers', name: 'careers' },
]

const isChromium = (browserName: string) => browserName === 'chromium'

for (const page of PAGES) {
  test(`a11y: ${page.name} (${page.path}) has no serious/critical violations`, async ({
    page: browserPage,
    browserName,
  }, testInfo) => {
    test.skip(!isChromium(browserName), 'chromium-only a11y test')

    await browserPage.goto(page.path, { waitUntil: 'domcontentloaded' })
    // Give Sanity-driven content a moment to hydrate so we audit the real DOM
    await browserPage.waitForLoadState('networkidle').catch(() => {
      // networkidle can flake on live-listening sockets; ignore
    })

    const results = await new AxeBuilder({ page: browserPage })
      // Only check WCAG 2.1 AA + best-practices — these are the levels most
      // regulators and large enterprises ask for.
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze()

    const serious = results.violations.filter((v) =>
      v.impact === 'serious' || v.impact === 'critical'
    )

    // Always attach the full violation set to the test so it's visible in
    // the HTML report regardless of pass/fail.
    await testInfo.attach(`axe-${page.name}.json`, {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    })

    if (serious.length > 0) {
      const summary = serious
        .map(
          (v) =>
            `• [${v.impact}] ${v.id}: ${v.help}\n  ${v.nodes.length} element(s)\n  ${v.helpUrl}`
        )
        .join('\n\n')
      expect(serious, `Accessibility violations on ${page.path}:\n\n${summary}`).toHaveLength(
        0
      )
    }
  })
}
