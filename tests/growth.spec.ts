import { test, expect } from '@playwright/test';

test('新增 Markdown 的封面、图片预览及目录', async ({ page }) => {
  test.skip(
    !process.env.YC_GROWTH_PATH,
    'Runs through npm run test:growth with temporary content.',
  );
  await page.goto(process.env.YC_GROWTH_PATH!);
  await expect(page.locator('.toc-list')).toContainText('又一次出发');
  await expect(page.locator('.story-cover img')).toBeVisible();
  await page.locator('.story-cover img').click();
  const dialog = page.getByRole('dialog', { name: '图片预览' });
  await expect(dialog).toBeVisible();
  await expect(page.locator('#image-caption')).toContainText('一起看过的星空');
  await expect(page.getByRole('button', { name: '上一张图片' })).toBeDisabled();
  await page.getByRole('button', { name: '下一张图片' }).click();
  await expect(page.locator('#image-caption')).toContainText('地平线上的光');
  await expect(page.getByRole('button', { name: '下一张图片' })).toBeDisabled();
  await page.getByRole('button', { name: '关闭图片预览' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('.prose .image-caption')).toHaveText('地平线上的光');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
