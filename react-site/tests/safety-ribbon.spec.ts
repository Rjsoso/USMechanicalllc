import { expect, test } from '@playwright/test'

type Viewport = { width: number; height: number }

const viewports: { name: string; size: Viewport }[] = [
  { name: 'w1440', size: { width: 1440, height: 900 } },
  { name: 'w1920', size: { width: 1920, height: 1000 } },
  { name: 'w2560', size: { width: 2560, height: 1200 } },
]

for (const vp of viewports) {
  test.describe(vp.name, () => {
    test(`Safety ribbon does not overlap text (${vp.size.width}x${vp.size.height})`, async ({ page }) => {
      await page.setViewportSize(vp.size)
      await page.goto('/', { waitUntil: 'networkidle' })

      // Scroll to Safety section and wait for layout to settle
      await page.locator('#safety').scrollIntoViewIfNeeded()
      await page.waitForTimeout(250)

      const text = page.getByTestId('safety-text')
      const ribbon = page.getByTestId('safety-ribbon')

      await expect(text).toBeVisible()
      await expect(ribbon).toBeVisible()

      const textBox = await text.boundingBox()
      const ribbonBox = await ribbon.boundingBox()

      expect(textBox).toBeTruthy()
      expect(ribbonBox).toBeTruthy()

      // Horizontal non-overlap check:
      // Ribbon should start at/after the right edge of the text column.
      const textRight = (textBox?.x ?? 0) + (textBox?.width ?? 0)
      const ribbonLeft = ribbonBox?.x ?? 0

      // Allow a tiny tolerance for subpixel/layout rounding differences.
      expect(ribbonLeft).toBeGreaterThanOrEqual(textRight - 2)

      // Capture screenshot for manual review if needed (saved in test results)
      await page.screenshot({ path: `test-results/safety-${vp.name}-${test.info().project.name}.png` })
    })
  })
}

