import { useState, useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { musicApi } from '@/lib/api'
import type { MusicTrack } from '@/types'

const MusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [tracks, setTracks] = useState<MusicTrack[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const retryCountRef = useRef(0)

  useEffect(() => {
    fetchTracks()
  }, [])

  const fetchTracks = async () => {
    try {
      setLoading(true)
      const res = await musicApi.getAll()
      if (res.tracks && res.tracks.length > 0) {
        const formattedTracks = res.tracks.map((t: any) => ({
          id: t.id,
          title: t.title,
          artist: t.artist || 'Peter',
          audioUrl: t.audio_url,
          coverUrl: t.cover_url,
          lyrics: t.lyrics || '',
          duration: t.duration,
        }))
        setTracks(formattedTracks)
      } else {
        setTracks([])
      }
    } catch (error) {
      console.error('获取音乐列表失败:', error)
      setTracks([])
    } finally {
      setLoading(false)
    }
  }

  const currentTrack = tracks[currentIndex]

  // 统一的播放函数：加载音源并播放
  const playAudio = () => {
    const audio = audioRef.current
    if (!audio || !currentTrack?.audioUrl) return

    const nextSrc = currentTrack.audioUrl
    const absolute = new URL(nextSrc, window.location.origin).href
    const needReload = audio.src !== absolute

    if (needReload) {
      audio.src = nextSrc
      audio.load()
      setCurrentTime(0)
      setDuration(0)
    }

    const doPlay = () => {
      audio.play().then(() => {
        setIsPlaying(true)
        retryCountRef.current = 0
      }).catch((err) => {
        console.warn('播放失败:', err)
        setIsPlaying(false)
        // 失败后重试一次（可能是音源还没加载好）
        if (retryCountRef.current < 2) {
          retryCountRef.current++
          setTimeout(doPlay, 500)
        }
      })
    }

    if (needReload) {
      const onCanPlay = () => {
        audio.removeEventListener('canplay', onCanPlay)
        doPlay()
      }
      audio.addEventListener('canplay', onCanPlay)
      // 兜底：1秒后强制尝试播放
      setTimeout(() => {
        audio.removeEventListener('canplay', onCanPlay)
        doPlay()
      }, 1000)
    } else {
      doPlay()
    }
  }

  // 切歌时自动播放
  useEffect(() => {
    if (tracks.length === 0 || !currentTrack?.audioUrl) return
    // 只有用户已经交互过，或者已经在播放中，才自动播放
    if (hasInteracted || isPlaying) {
      playAudio()
    } else {
      // 还没交互过，先加载音源但不播放
      const audio = audioRef.current
      if (audio && currentTrack.audioUrl) {
        const absolute = new URL(currentTrack.audioUrl, window.location.origin).href
        if (audio.src !== absolute) {
          audio.src = currentTrack.audioUrl
          audio.load()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentTrack?.audioUrl, tracks.length])

  // 用户首次交互后自动播放
  useEffect(() => {
    if (hasInteracted || tracks.length === 0) return

    const handleFirstInteraction = () => {
      setHasInteracted(true)
      // 延迟一点播放，确保音频已加载
      setTimeout(() => playAudio(), 100)
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks.length, hasInteracted])

  useEffect(() => {
    const handleToggleMusic = () => {
      setIsOpen((prev) => !prev)
    }
    const handlePlayTrack = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (!detail?.id || tracks.length === 0) return
      const index = tracks.findIndex((t) => String(t.id) === String(detail.id))
      if (index < 0) return
      setHasInteracted(true)
      setCurrentIndex(index)
      setIsOpen(true)
    }
    window.addEventListener('toggleMusic', handleToggleMusic)
    window.addEventListener('playTrack', handlePlayTrack)
    return () => {
      window.removeEventListener('toggleMusic', handleToggleMusic)
      window.removeEventListener('playTrack', handlePlayTrack)
    }
  }, [tracks])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      const t = audio.currentTime
      setCurrentTime(t)
      const track = tracks[currentIndex]
      if (track) {
        window.dispatchEvent(
          new CustomEvent('musicPlayback', {
            detail: {
              id: track.id,
              currentTime: t,
              isPlaying: !audio.paused,
              duration: audio.duration || 0,
            },
          })
        )
      }
    }
    const handleLoadedMetadata = () => {
      if (!Number.isNaN(audio.duration)) setDuration(audio.duration)
    }
    const handleEnded = () => {
      // 自动下一首（切歌effect会自动播放，因为hasInteracted已经是true）
      setCurrentIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
    }
    const handlePlay = () => {
      setIsPlaying(true)
    }
    const handlePause = () => {
      setIsPlaying(false)
    }
    const handleError = () => {
      const err = audio.error
      console.error('音频加载错误:', {
        code: err?.code,
        message: err?.message,
        src: audio.src,
        currentSrc: audio.currentSrc,
      })
      setIsPlaying(false)
      // 自动重试一次
      if (retryCountRef.current < 2) {
        retryCountRef.current++
        console.warn(`第 ${retryCountRef.current} 次重试播放...`)
        setTimeout(() => playAudio(), 800)
      } else {
        console.error('播放失败次数过多，跳过当前歌曲')
        // 重试2次都失败，自动切到下一首
        setTimeout(() => {
          if (tracks.length > 1) {
            setCurrentIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
          }
        }, 1000)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
    }
  }, [currentIndex, tracks])

  useEffect(() => {
    const handleSeek = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (!audioRef.current || detail?.time == null) return
      setHasInteracted(true)

      if (detail.id != null) {
        const index = tracks.findIndex((t) => String(t.id) === String(detail.id))
        if (index >= 0 && index !== currentIndex) {
          setCurrentIndex(index)
          setIsOpen(true)
          // 等切歌 effect 加载后再 seek
          setTimeout(() => {
            if (!audioRef.current) return
            audioRef.current.currentTime = detail.time
            playAudio()
          }, 300)
          return
        }
      }

      audioRef.current.currentTime = detail.time
      playAudio()
      setIsOpen(true)
    }
    window.addEventListener('seekMusic', handleSeek)
    return () => window.removeEventListener('seekMusic', handleSeek)
  }, [tracks, currentIndex])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    setHasInteracted(true)
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) {
      audio.pause()
    } else {
      playAudio()
    }
  }

  const handlePrevious = () => {
    setHasInteracted(true)
    setCurrentIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setHasInteracted(true)
    setCurrentIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * duration
  }

  if (!loading && tracks.length === 0) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110',
          isOpen && 'hidden'
        )}
        aria-label="打开音乐播放器"
      >
        <Music className={cn('w-6 h-6', isPlaying && 'animate-pulse')} />
      </button>

      <div
        className={cn(
          'fixed bottom-6 right-6 z-40 w-80 glassmorphism rounded-2xl shadow-2xl transition-all duration-300 transform',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        )}
      >
        <audio ref={audioRef} preload="auto" />

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pb-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {currentTrack?.coverUrl ? (
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{currentTrack?.title || '暂无音乐'}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {currentTrack?.artist || ''}
              </p>
            </div>
          </div>

          <div
            className="h-1 bg-white/10 rounded-full cursor-pointer mb-2"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="px-6 pb-4 flex items-center justify-center space-x-6">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="上一首"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="下一首"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-4 flex items-center space-x-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 hover:text-primary transition-colors"
            aria-label={isMuted ? '取消静音' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value))
              setIsMuted(false)
            }}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary"
          />
        </div>
      </div>
    </>
  )
}

export default MusicPlayer
