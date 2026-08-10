export interface LrcLine {
  time: number
  text: string
}

/** 判断文本是否包含 LRC 时间标签 */
export function isLrcFormat(raw: string): boolean {
  return /\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/.test(raw || '')
}

/**
 * 解析 LRC / 类 LRC 文本。
 * 支持 [mm:ss.xx]、[mm:ss.xxx]、同一行多个时间标签。
 */
export function parseLrc(raw: string): LrcLine[] {
  if (!raw?.trim()) return []

  const timeTag = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g
  const lines: LrcLine[] = []

  for (const line of raw.split(/\r?\n/)) {
    const matches = [...line.matchAll(timeTag)]
    if (matches.length === 0) continue

    const text = line.replace(timeTag, '').trim()
    if (!text) continue

    for (const m of matches) {
      const minutes = parseInt(m[1], 10)
      const seconds = parseInt(m[2], 10)
      const frac = (m[3] || '0').padEnd(3, '0').slice(0, 3)
      const time = minutes * 60 + seconds + parseInt(frac, 10) / 1000
      lines.push({ time, text })
    }
  }

  return lines.sort((a, b) => a.time - b.time)
}

/** 根据当前播放时间找出当前歌词行下标 */
export function findActiveLrcIndex(lines: LrcLine[], currentTime: number): number {
  if (lines.length === 0) return -1
  let active = -1
  for (let i = 0; i < lines.length; i++) {
    if (currentTime + 0.05 >= lines[i].time) {
      active = i
    } else {
      break
    }
  }
  return active
}
