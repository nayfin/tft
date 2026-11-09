import { test, expect, getMatFormField } from '@tft/crispr-forms-testing';
import type { Page } from '@tft/crispr-forms-testing';

const FIELD = 'processedImage';

/** Builds a PNG big enough to trigger compression (the demo thresholds are 0.05 MB) */
async function createLargeImage(page: Page): Promise<Buffer> {
  const base64 = await page.evaluate(() => {
    // a noisy gradient: big as a PNG, but it compresses well as a JPEG
    const size = 600;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < size * size; i++) {
      const x = i % size;
      const y = Math.floor(i / size);
      const noise = Math.floor(Math.random() * 24);
      imageData.data[i * 4] = ((x * 255) / size + noise) % 256;
      imageData.data[i * 4 + 1] = ((y * 255) / size + noise) % 256;
      imageData.data[i * 4 + 2] = ((x + y) * 128) / size + noise;
      imageData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  return Buffer.from(base64, 'base64');
}

function getFileInput(page: Page) {
  return getMatFormField(page, FIELD).locator('input[type="file"]');
}

test.describe('Image Upload Field processing state', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/image-upload');
    await expect(getMatFormField(page, FIELD)).toBeVisible();
  });

  test('reports processing (form invalid) while compressing, then idle (form valid)', async ({
    page,
  }) => {
    const image = await createLargeImage(page);
    // guard: the image must be large enough to be compressed
    expect(image.length).toBeGreaterThan(0.05 * 1024 * 1024);

    await getFileInput(page).setInputFiles({
      name: 'large.png',
      mimeType: 'image/png',
      buffer: image,
    });

    await expect(page.locator('[data-testid="processing-log"] li')).toHaveText(
      ['processing:INVALID', 'idle:VALID'],
      { timeout: 30000 }
    );
    // the compressed image is previewed once processing has finished
    await expect(getMatFormField(page, FIELD).locator('img')).toBeVisible();
    await expect(
      getMatFormField(page, FIELD).locator('[data-testid="image-processing"]')
    ).toHaveCount(0);
  });

  test('reports failed (form invalid) for a corrupt image and recovers on a valid one', async ({
    page,
  }) => {
    const corrupt = Buffer.alloc(120 * 1024);
    for (let i = 0; i < corrupt.length; i++)
      corrupt[i] = Math.floor(Math.random() * 256);

    await getFileInput(page).setInputFiles({
      name: 'bad.jpg',
      mimeType: 'image/jpeg',
      buffer: corrupt,
    });

    const log = page.locator('[data-testid="processing-log"] li');
    await expect(log).toHaveText(['processing:INVALID', 'failed:INVALID']);
    await expect(
      getMatFormField(page, FIELD).locator(
        '[data-testid="image-processing-failed"]'
      )
    ).toContainText('bad.jpg');
    // the field's own error message is displayed as well
    await expect(
      page.locator(
        `crispr-image-upload-field:has([data-testid="${FIELD}"]) p.tft-control-error`
      )
    ).toContainText('Unable to process');

    // selecting a valid image recovers the field
    const image = await createLargeImage(page);
    await getFileInput(page).setInputFiles({
      name: 'good.png',
      mimeType: 'image/png',
      buffer: image,
    });

    await expect(log).toHaveText(
      [
        'processing:INVALID',
        'failed:INVALID',
        'processing:INVALID',
        'idle:VALID',
      ],
      { timeout: 30000 }
    );
    await expect(
      getMatFormField(page, FIELD).locator(
        '[data-testid="image-processing-failed"]'
      )
    ).toHaveCount(0);
    await expect(getMatFormField(page, FIELD).locator('img')).toBeVisible();
  });
});
