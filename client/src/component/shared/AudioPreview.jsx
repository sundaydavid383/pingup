import React, { useState, useRef, useEffect } from 'react'
import { Play, PauseCircle } from 'lucide-react'
import "../../styles/ui.css"

const AudioPreview = ({ audioURL, isUser }) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const setAudioDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)
    const handlePauseAll = (e) => {
      // If this player isn't the one that triggered the play, pause it
      if (e.detail !== audioURL) {
        audio.pause()
        setIsPlaying(false)
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', setAudioDuration)
    audio.addEventListener('ended', handleEnded)

    // Listen for global "pause-all" events
    window.addEventListener('pause-all-audio', handlePauseAll)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', setAudioDuration)
      audio.removeEventListener('ended', handleEnded)
      window.removeEventListener('pause-all-audio', handlePauseAll)
    }
  }, [audioURL])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      // Pause all other audio players before playing this one
      window.dispatchEvent(new CustomEvent('pause-all-audio', { detail: audioURL }))
      audio.play()
      setIsPlaying(true)
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div
      className={`flex w-full mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex items-center px-3 py-2 shadow max-w-xs gap-3 rounded-2xl transition-all duration-300`}
        style={{
          backgroundColor: isUser ? 'var(--primary)' : 'var(--bg-light)',
          color: 'var(--white)',
          border: `1px solid ${isUser ? 'var(--hover-dark)' : 'var(--input-border)'}`
        }}
      >
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center rounded-full transition"
          style={{
            backgroundColor: 'var(--hover-dark)',
            color: 'var(--white)',
          }}
        >
          {isPlaying ? <PauseCircle size={16} /> : <Play size={16} />}
        </button>

        {/* Progress Bar */}
        <div
          className="flex-1 h-2 rounded-full relative overflow-hidden"
          style={{
            backgroundColor: isUser
              ? 'rgba(255,255,255,0.3)'
              : 'rgba(255,255,255,0.15)',
          }}
        >
          <div
            className="h-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              backgroundColor: isUser
                ? 'var(--hover-light)'
                : 'var(--hover-dark)',
            }}
          />
        </div>

        {/* Time */}
        <span
          className="text-[10px]"
          style={{
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Hidden audio element */}
        <audio ref={audioRef} src={audioURL} style={{ display: 'none' }} />
      </div>
    </div>
  )
}

export default AudioPreview