export {};
const prose = document.querySelector<HTMLElement>('#story-content');
const progress = document.querySelector<HTMLElement>('#reading-progress');
if (prose && progress) {
  const updateProgress = () => {
    const rect = prose.getBoundingClientRect();
    const available = rect.height - window.innerHeight;
    progress.style.width = `${Math.max(0, Math.min(1, available > 0 ? -rect.top / available : rect.bottom <= window.innerHeight ? 1 : 0)) * 100}%`;
  };
  let scheduled = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          updateProgress();
          scheduled = false;
        });
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', updateProgress);
  window.addEventListener('load', updateProgress);
  updateProgress();
  let size = 17;
  try {
    size = Math.max(15, Math.min(23, Number(localStorage.getItem('yc-reader-size')) || 17));
  } catch {
    /* Storage can be disabled. */
  }
  const setSize = () => {
    prose.style.setProperty('--reader-size', `${size}px`);
    document.querySelector<HTMLButtonElement>('#font-smaller')!.disabled = size <= 15;
    document.querySelector<HTMLButtonElement>('#font-larger')!.disabled = size >= 23;
    document.querySelector('#font-status')!.textContent = `正文字号 ${size} 像素`;
    updateProgress();
  };
  for (const [id, delta] of [
    ['font-smaller', -1],
    ['font-larger', 1],
  ] as const) {
    document.getElementById(id)?.addEventListener('click', () => {
      size = Math.max(15, Math.min(23, size + delta));
      setSize();
      try {
        localStorage.setItem('yc-reader-size', String(size));
      } catch {
        /* Still works without storage. */
      }
    });
  }
  setSize();
}

document.querySelectorAll<HTMLButtonElement>('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        dialog.close();
    }
  });
});

const shareDialog = document.querySelector<HTMLDialogElement>('#share-dialog');
const shareInput = document.querySelector<HTMLInputElement>('#share-url');
const shareStatus = document.querySelector<HTMLElement>('#share-status');
document.querySelector('#share-button')?.addEventListener('click', () => {
  if (shareStatus) shareStatus.textContent = '';
  shareDialog?.showModal();
});
shareInput?.addEventListener('click', () => shareInput.select());
document.querySelector('#copy-link')?.addEventListener('click', async () => {
  if (!shareInput || !shareStatus) return;
  try {
    await navigator.clipboard.writeText(shareInput.value);
    shareStatus.textContent = '链接已复制，发给朋友吧。';
  } catch {
    shareInput.focus();
    shareInput.select();
    shareStatus.textContent = '请长按链接或使用 Ctrl / ⌘ + C 复制。';
  }
});
const nativeShare = document.querySelector<HTMLButtonElement>('#native-share');
if (nativeShare) {
  nativeShare.hidden = !navigator.share;
  nativeShare.addEventListener('click', async () => {
    try {
      await navigator.share({
        title: document.querySelector('h1')?.textContent ?? 'YouthClimb',
        url: shareInput?.value,
      });
    } catch (error) {
      if (shareStatus && !(error instanceof Error && error.name === 'AbortError'))
        shareStatus.textContent = '暂时无法唤起系统分享，可以复制链接。';
    }
  });
}

const gallery = [...document.querySelectorAll<HTMLImageElement>('.prose img, .story-cover img')];
const imageDialog = document.querySelector<HTMLDialogElement>('#image-dialog');
const preview = document.querySelector<HTMLImageElement>('#preview-image');
let current = 0;
const showImage = (index: number) => {
  const source = gallery[index];
  if (!source || !preview || !imageDialog) return;
  current = index;
  preview.src = source.currentSrc || source.src;
  preview.alt = source.alt;
  document.querySelector('#image-caption')!.textContent =
    `${source.alt ? source.alt + ' · ' : ''}${index + 1} / ${gallery.length}`;
  document.querySelector<HTMLButtonElement>('#image-prev')!.disabled = index === 0;
  document.querySelector<HTMLButtonElement>('#image-next')!.disabled = index === gallery.length - 1;
  if (!imageDialog.open) imageDialog.showModal();
};
gallery.forEach((img, index) => {
  const linked = img.closest('a');
  // Preserve intentional links; image-only links open in the gallery.
  if (linked && !/\.(avif|gif|jpe?g|png|svg|webp)([?#].*)?$/i.test(linked.href)) return;
  img.tabIndex = linked ? -1 : 0;
  if (!linked) {
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `预览图片：${img.alt || index + 1}`);
  }
  (linked ?? img).addEventListener('click', (event) => {
    event.preventDefault();
    showImage(index);
  });
  img.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showImage(index);
    }
  });
  if (img.alt && !img.closest('figure')?.querySelector('figcaption')) {
    const caption = document.createElement('span');
    caption.className = 'image-caption';
    caption.textContent = img.alt;
    (linked ?? img).after(caption);
  }
});
document.querySelector('#image-prev')?.addEventListener('click', () => showImage(current - 1));
document.querySelector('#image-next')?.addEventListener('click', () => showImage(current + 1));
imageDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showImage(current - 1);
  if (event.key === 'ArrowRight') showImage(current + 1);
});
