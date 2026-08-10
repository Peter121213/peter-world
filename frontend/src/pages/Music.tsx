import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Play, Loader2, Mic2 } from 'lucide-react'
import { musicApi } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'
import type { MusicTrack } from '@/types'
import { cn } from '@/lib/utils'
import SyncedLyrics from '@/components/SyncedLyrics'

const MusicPage = () => {
  const { settings } = useSettings()
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [playback, setPlayback] = useState<{
    id: string | number | null
    currentTime: number
    isPlaying: boolean
  }>({ id: null, currentTime: 0, isPlaying: false })

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true)
        const res = await musicApi.getAll()
        const formatted = (res.tracks || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          artist: t.artist || 'Peter',
          audioUrl: t.audio_url,
          coverUrl: t.cover_url || '',
          lyrics: t.lyrics || '',
          duration: t.duration,
        }))
        setTracks(formatted)
        if (formatted.length > 0) {
          setSelectedId(formatted[0].id)
        }
      } catch (error) {
        console.error('获取音乐失败:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTracks()
  }, [])

  useEffect(() => {
    const onPlayback = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (!detail) return
      setPlayback({
        id: detail.id,
        currentTime: detail.currentTime || 0,
        isPlaying: Boolean(detail.isPlaying),
      })
    }
    window.addEventListener('musicPlayback', onPlayback)
    return () => window.removeEventListener('musicPlayback', onPlayback)
  }, [])

  const selected = tracks.find((t) => t.id === selectedId) || null
  const lyricsSynced =
    selected != null &&
    playback.id != null &&
    String(playback.id) === String(selected.id)

  const playTrack = (track: MusicTrack) => {
    window.dispatchEvent(
      new CustomEvent('playTrack', {
        detail: { id: track.id },
      })
    )
  }

  const seekLyrics = (time: number) => {
    if (!selected) return
    window.dispatchEvent(
      new CustomEvent('seekMusic', {
        detail: { id: selected.id, time },
      })
    )
  }

  return (
    <div className="pt-24 md:pt-28 pb-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Music className="w-5 h-5 text-accent mr-2" />
            <span className="text-accent text-sm font-medium tracking-wider uppercase">
              {settings?.musicBadge || 'Music'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {settings?.musicSectionTitle || '音乐陪伴'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto whitespace-pre-line">
            {(settings?.musicSectionDescription || '每一首歌都有它的心情').replace(/\\n/g, '\n')}
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        )}

        {!loading && tracks.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>还没有添加音乐～</p>
          </div>
        )}

        {!loading && tracks.length > 0 && (
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-2">
              {tracks.map((track, index) => (
                <motion.button
                  key={track.id}
                  type="button"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  onClick={() => setSelectedId(track.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors border',
                    selectedId === track.id
                      ? 'bg-primary/10 border-primary/40'
                      : 'bg-card/30 border-white/5 hover:border-white/15 hover:bg-white/5'
                  )}
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center">
                    {track.coverUrl ? (
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{track.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      playTrack(track)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation()
                        playTrack(track)
                      }
                    }}
                    className="p-2 rounded-full bg-primary/15 text-primary hover:bg-primary hover:text-white transition-colors flex-shrink-0"
                    title="播放"
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selected && (
                  <motion.div
                    key={String(selected.id)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-white/10 bg-card/40 overflow-hidden"
                  >
                    <div className="relative aspect-[16/9] md:aspect-[2/1] bg-black/20">
                      {selected.coverUrl ? (
                        <img
                          src={selected.coverUrl}
                          alt={selected.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <Music className="w-16 h-16 text-primary/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-4">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold mb-1">{selected.title}</h2>
                          <p className="text-muted-foreground">{selected.artist}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => playTrack(selected)}
                          className="btn-primary inline-flex items-center gap-2 flex-shrink-0"
                        >
                          <Play className="w-4 h-4" />
                          <span>播放</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2 text-accent">
                          <Mic2 className="w-4 h-4" />
                          <span className="text-sm font-medium tracking-wider uppercase">歌词</span>
                        </div>
                        {lyricsSynced && playback.isPlaying && (
                          <span className="text-xs text-muted-foreground">同步滚动中</span>
                        )}
                      </div>
                      <SyncedLyrics
                        lyrics={selected.lyrics || ''}
                        currentTime={lyricsSynced ? playback.currentTime : 0}
                        active={lyricsSynced}
                        onSeek={seekLyrics}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicPage
