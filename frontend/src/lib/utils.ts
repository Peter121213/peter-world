import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 压缩图片，避免超过 Vercel 请求体限制（约 4.5MB）导致 Request Entity Too Large
 */
export async function compressImage(
  file: File,
  options: { maxWidth?: number; maxBytes?: number; quality?: number } = {}
): Promise<File> {
  const maxWidth = options.maxWidth ?? 1200
  const maxBytes = options.maxBytes ?? 800 * 1024
  const quality = options.quality ?? 0.82

  if (!file.type.startsWith('image/')) {
    return file
  }

  // 已经很小则不处理
  if (file.size <= maxBytes && file.size <= 500 * 1024) {
    return file
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxWidth / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  let q = quality
  let blob: Blob | null = null
  for (let i = 0; i < 6; i++) {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', q)
    )
    if (!blob) break
    if (blob.size <= maxBytes) break
    q -= 0.12
  }

  if (!blob) return file

  const name = file.name.replace(/\.\w+$/, '') + '.jpg'
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() })
}
