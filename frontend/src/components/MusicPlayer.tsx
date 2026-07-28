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
  const audioRef = useRef<HTMLAudioElement>(null)

  // 示例音乐数据
  const sampleTracks: MusicTrack[] = [
    {
      id: 1,
      title: '夏日微风',
      artist: 'Peter',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverUrl: '',
    },
    {
      id: 2,
      title: '星空漫步',
      artist: 'Peter',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      coverUrl: '',
    },
    {
      id: 3,
      title: '午后阳光',
      artist: 'Peter',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      coverUrl: '',
    },
  ]

  useEffect(() => {
    setTracks(sampleTracks)
  }, [])

  useEffect(() => {
    const handleToggleMusic = () => {
      setIsOpen((prev) => !prev)
    }
    window.addEventListener('toggleMusic', handleToggleMusic)
    return () => window.removeEventListener('toggleMusic', handleToggleMusic)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => handleNext()

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentIndex])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
    setIsPlaying(true)
    setTimeout(() => audioRef.current?.play(), 100)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
    setTimeout(() => audioRef.current?.play(), 100)
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

  const currentTrack = tracks[currentIndex]

  return (
    <>
      {/* 音乐按钮（收起状态） */}
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

      {/* 音乐播放器（展开状态） */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-40 w-80 glassmorphism rounded-2xl shadow-2xl transition-all duration-300 transform',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        )}
      >
        <audio ref={audioRef} src={currentTrack?.audioUrl} preload="metadata" />

        {/* 关闭按钮 */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 封面和信息 */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <Music className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{currentTrack?.title || '暂无音乐'}</h4>
              <p className="text-sm text-muted-foreground truncate">
                {currentTrack?.artist || ''}
              </p>
            </div>
          </div>

          {/* 进度条 */}
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

        {/* 控制按钮 */}
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

        {/* 音量控制 */}
        <div className="px-6 pb-4 flex items-center space-x-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 hover:text-primary transition-colors"
            aria-label={isMuted ? '取消静音' : '静音'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
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
