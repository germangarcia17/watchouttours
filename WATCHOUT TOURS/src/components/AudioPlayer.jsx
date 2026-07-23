import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function AudioPlayer({ src, playerId, playingId, setPlayingId, label = 'audio' }) {
  const { t } = useTranslation()
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const playing = playingId === playerId
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    const onLoaded = () => setDuration(audio.duration)
    const onTime = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setPlayingId(null)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [setPlayingId])

  // Cuando otro player empieza, pausar este
  useEffect(() => {
    const audio = audioRef.current
    if (playingId !== playerId) {
      audio.pause()
    }
  }, [playingId, playerId])

  function togglePlay() {
    const audio = audioRef.current
    if (playing) {
      audio.pause()
      setPlayingId(null)
    } else {
      audio.play()
      setPlayingId(playerId)
    }
  }

  function handleProgressClick(e) {
    const bar = progressRef.current
    const rect = bar.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = ratio * duration
  }

  function handleProgressKeyDown(e) {
    const audio = audioRef.current
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      audio.currentTime = Math.min(duration, currentTime + 5)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      audio.currentTime = Math.max(0, currentTime - 5)
    }
    if (e.key === 'Home') {
      e.preventDefault()
      audio.currentTime = 0
    }
    if (e.key === 'End') {
      e.preventDefault()
      audio.currentTime = duration
    }
  }

  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  /* Tiempo legible para lectores de pantalla ("1 minuto y 5 segundos") */
  function speakTime(s) {
    if (!s || isNaN(s)) return t('audioPlayer.seconds', { count: 0 })
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    if (m === 0) return t('audioPlayer.seconds', { count: sec })
    return t('audioPlayer.minutesSeconds', {
      minutes: t('audioPlayer.minutes', { count: m }),
      seconds: t('audioPlayer.seconds', { count: sec }),
    })
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        className="audio-player__btn"
        onClick={togglePlay}
        aria-label={`${playing ? t('audioPlayer.pause') : t('audioPlayer.play')}: ${label}`}
      >
        {playing ? (
          /* Pause icon */
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          /* Play icon */
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        )}
      </button>

      <div className="audio-player__controls">
        <div
          className="audio-player__progress-track"
          ref={progressRef}
          onClick={handleProgressClick}
          role="slider"
          aria-label={t('audioPlayer.progress', { label })}
          aria-valuenow={Math.round(currentTime)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration) || 0}
          aria-valuetext={t('audioPlayer.valueText', { current: speakTime(currentTime), total: speakTime(duration) })}
          tabIndex={0}
          onKeyDown={handleProgressKeyDown}
        >
          <div className="audio-player__progress-fill" style={{ width: `${progress}%` }} />
          <div className="audio-player__progress-thumb" style={{ left: `${progress}%` }} />
        </div>

        <div className="audio-player__time" aria-hidden="true">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
