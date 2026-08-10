import { useEffect, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import { findActiveLrcIndex, isLrcFormat, parseLrc } from '@/lib/lrc'

interface SyncedLyricsProps {
  lyrics: string
  currentTime: number
  active: boolean
  onSeek?: (time: number) => void
  className?: string
}

const SyncedLyrics = ({
  lyrics,
  currentTime,
  active,
  onSeek,
  className,
}: SyncedLyricsProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLButtonElement | null)[]>([])

  const isLrc = useMemo(() => isLrcFormat(lyrics), [lyrics])
  const lines = useMemo(() => (isLrc ? parseLrc(lyrics) : []), [lyrics, isLrc])
  const activeIndex = useMemo(
    () => (active && isLrc ? findActiveLrcIndex(lines, currentTime) : -1),
    [active, isLrc, lines, currentTime]
  )

  useEffect(() => {
    if (activeIndex < 0) return
    const el = lineRefs.current[activeIndex]
    const container = containerRef.current
    if (!el || !container) return

    const top =
      el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2
    container.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth',
    })
  }, [activeIndex])

  if (!lyrics?.trim()) {
    return (
      <p className="text-muted-foreground py-12 text-center">暂无歌词</p>
    )
  }

  if (!isLrc) {
    return (
      <pre
        className={cn(
          'whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed text-base md:text-lg',
          className
        )}
      >
        {lyrics}
      </pre>
    )
  }

  if (lines.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center">暂无歌词</p>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative h-[360px] md:h-[420px] overflow-y-auto scroll-smooth [scrollbar-width:thin]',
        className
      )}
    >
      <div className="py-[160px] md:py-[180px] space-y-1">
        {lines.map((line, index) => {
          const isActive = index === activeIndex
          const isNear = Math.abs(index - activeIndex) <= 1
          return (
            <button
              key={`${line.time}-${index}`}
              type="button"
              ref={(el) => {
                lineRefs.current[index] = el
              }}
              onClick={() => onSeek?.(line.time)}
              className={cn(
                'block w-full text-center px-4 py-2.5 rounded-lg transition-all duration-300',
                onSeek && 'cursor-pointer hover:bg-white/5',
                isActive
                  ? 'text-primary text-lg md:text-xl font-semibold scale-[1.02]'
                  : isNear
                    ? 'text-foreground/70 text-base md:text-lg'
                    : 'text-muted-foreground/50 text-sm md:text-base'
              )}
            >
              {line.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SyncedLyrics
