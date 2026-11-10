import { test, expect, getMatFormField } from '@tft/crispr-forms-testing';
import type { Page } from '@tft/crispr-forms-testing';

const FIELD = 'processedImage';
const INITIAL_FIELD = 'initialImage';

/** Builds a PNG big enough to trigger compression (the demo thresholds are 0.05 MB) */
async function createLargeImage(page: Page, size = 600): Promise<Buffer> {
  const base64 = await page.evaluate((size) => {
    // a noisy gradient: big as a PNG, but it compresses well as a JPEG
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
  }, size);
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
    // filesChanged fires exactly once, with the processed file
    const filesChanged = page.locator('[data-testid="files-changed-log"] li');
    await expect(filesChanged).toHaveCount(1);
    await expect(filesChanged).toHaveText(/^large\.png:\d+$/);
    const processedSize = Number(
      (await filesChanged.textContent()).split(':')[1]
    );
    expect(processedSize).toBeGreaterThan(0);
    expect(processedSize).toBeLessThan(image.length);
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
    // filesChanged does not fire for a failure
    await expect(
      page.locator('[data-testid="files-changed-log"] li')
    ).toHaveCount(0);
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
      page.locator('[data-testid="files-changed-log"] li')
    ).toHaveText(/^good\.png:\d+$/);
    await expect(
      getMatFormField(page, FIELD).locator(
        '[data-testid="image-processing-failed"]'
      )
    ).toHaveCount(0);
    await expect(getMatFormField(page, FIELD).locator('img')).toBeVisible();
  });

  test('cancels an in-flight compression and reports idle when the field is destroyed', async ({
    page,
  }) => {
    const image = await createLargeImage(page);
    // select the file and destroy the form in the same task, so that the form is
    // guaranteed to be destroyed before the compression has finished
    await page.evaluate(
      ({ base64, field }) => {
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const transfer = new DataTransfer();
        transfer.items.add(
          new File([bytes], 'large.png', { type: 'image/png' })
        );
        const input = document.querySelector<HTMLInputElement>(
          `[data-testid="${field}"] input[type="file"]`
        );
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        document
          .querySelector<HTMLButtonElement>(
            '[data-testid="toggle-processing-form"]'
          )
          .click();
      },
      { base64: image.toString('base64'), field: FIELD }
    );
    await expect(getMatFormField(page, FIELD)).toHaveCount(0);

    // give the in-flight compression time to finish, then make sure it had no effect
    await page.waitForTimeout(4000);
    // the destroyed field reports idle (with the form valid again) exactly once, and nothing afterwards
    await expect(page.locator('[data-testid="processing-log"] li')).toHaveText([
      'processing:INVALID',
      'idle:VALID',
    ]);
    await expect(
      page.locator('[data-testid="files-changed-log"] li')
    ).toHaveCount(0);
  });

  test('a superseded compression neither fails nor calls filesChanged', async ({
    page,
  }) => {
    const slow = await createLargeImage(page, 2000);
    const fast = await createLargeImage(page);
    await getFileInput(page).setInputFiles({
      name: 'slow.png',
      mimeType: 'image/png',
      buffer: slow,
    });
    await expect(
      getMatFormField(page, FIELD).locator('[data-testid="image-processing"]')
    ).toBeVisible();
    await getFileInput(page).setInputFiles({
      name: 'fast.png',
      mimeType: 'image/png',
      buffer: fast,
    });

    await expect(page.locator('[data-testid="processing-log"] li')).toHaveText(
      ['processing:INVALID', 'idle:VALID'],
      { timeout: 30000 }
    );
    await expect(
      page.locator('[data-testid="files-changed-log"] li')
    ).toHaveText(/^fast\.png:\d+$/);
    await expect(
      getMatFormField(page, FIELD).locator(
        '[data-testid="image-processing-failed"]'
      )
    ).toHaveCount(0);
  });

  test('never shows the previous image while the next one is being prepared', async ({
    page,
  }) => {
    const field = getMatFormField(page, FIELD);
    const first = await createLargeImage(page);
    await getFileInput(page).setInputFiles({
      name: 'first.png',
      mimeType: 'image/png',
      buffer: first,
    });
    await expect(field.locator('img')).toBeVisible({ timeout: 30000 });
    const firstSrc = await field.locator('img').getAttribute('src');
    expect(firstSrc).toMatch(/^data:image/);

    // record every src an img inside the field has from now on
    await page.evaluate((field) => {
      const seen: string[] = [];
      (window as any).__seenImageSrcs = seen;
      const root = document.querySelector(`[data-testid="${field}"]`);
      const record = () =>
        root.querySelectorAll('img').forEach((img) => {
          const src = img.getAttribute('src');
          if (src) seen.push(src);
        });
      new MutationObserver(record).observe(root, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['src'],
      });
    }, FIELD);

    const second = await createLargeImage(page, 800);
    await getFileInput(page).setInputFiles({
      name: 'second.png',
      mimeType: 'image/png',
      buffer: second,
    });
    await expect(page.locator('[data-testid="processing-log"] li')).toHaveCount(
      4,
      { timeout: 30000 }
    );
    await expect(field.locator('img')).toBeVisible();
    await expect
      .poll(async () => field.locator('img').getAttribute('src'))
      .not.toBe(firstSrc);

    const seen = await page.evaluate(
      () => (window as any).__seenImageSrcs as string[]
    );
    expect(seen.length).toBeGreaterThan(0);
    expect(seen).not.toContain(firstSrc);
  });
});

test.describe('Image Upload Field preview with an initial value', () => {
  const initialField = (page: Page) => getMatFormField(page, INITIAL_FIELD);
  const initialPreview = (page: Page) => initialField(page).locator('img');

  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/image-upload');
    await expect(initialField(page)).toBeVisible();
  });

  test('shows the initial image', async ({ page }) => {
    await expect(initialPreview(page)).toHaveAttribute(
      'src',
      /^data:image\/png;base64,/
    );
  });

  test('does not show the stale initial image after processing fails', async ({
    page,
  }) => {
    await expect(initialPreview(page)).toBeVisible();
    const corrupt = Buffer.alloc(120 * 1024);
    for (let i = 0; i < corrupt.length; i++)
      corrupt[i] = Math.floor(Math.random() * 256);

    await initialField(page).locator('input[type="file"]').setInputFiles({
      name: 'bad.jpg',
      mimeType: 'image/jpeg',
      buffer: corrupt,
    });

    await expect(
      initialField(page).locator('[data-testid="image-processing-failed"]')
    ).toBeVisible();
    await expect(initialPreview(page)).toHaveCount(0);
    await expect(initialField(page).locator('.drop-container')).toBeVisible();
  });

  test('does not show the stale initial image after clearing while processing', async ({
    page,
  }) => {
    await expect(initialPreview(page)).toBeVisible();
    const image = await createLargeImage(page, 2000);

    await initialField(page).locator('input[type="file"]').setInputFiles({
      name: 'large.png',
      mimeType: 'image/png',
      buffer: image,
    });
    await expect(
      initialField(page).locator('[data-testid="image-processing"]')
    ).toBeVisible();
    await initialField(page).locator('button', { hasText: 'CLEAR' }).click();

    await expect(
      initialField(page).locator('[data-testid="image-processing"]')
    ).toHaveCount(0);
    await expect(initialPreview(page)).toHaveCount(0);
    await expect(initialField(page).locator('.drop-container')).toBeVisible();
  });
});
