import { useState, useEffect, useCallback } from 'react'
import { vapi, ASSISTANT_ID } from '../lib/vapi'
import type { CallStatus, TranscriptMessage } from '../types'

export function useVapi() {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle')
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [volumeLevel, setVolumeLevel] = useState(0)

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus('active')
      setTranscript([])
    }

    const onCallEnd = () => {
      setCallStatus('ended')
      setTimeout(() => setCallStatus('idle'), 3000)
    }

    const onTranscript = (t: { role: 'user' | 'assistant'; transcript: string; transcriptType: string }) => {
      if (t.transcriptType === 'final') {
        setTranscript((prev) => [
          ...prev,
          { role: t.role, text: t.transcript, timestamp: Date.now() },
        ])
      }
    }

    const onVolumeLevel = (level: number) => {
      setVolumeLevel(level)
    }

    const onError = (err: Error) => {
      console.error('Vapi error:', err)
      setCallStatus('idle')
    }

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('transcript', onTranscript)
    vapi.on('volume-level', onVolumeLevel)
    vapi.on('error', onError)

    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('transcript', onTranscript)
      vapi.off('volume-level', onVolumeLevel)
      vapi.off('error', onError)
    }
  }, [])

  const startCall = useCallback(async () => {
    if (callStatus !== 'idle') return
    setCallStatus('connecting')
    try {
      await vapi.start(ASSISTANT_ID)
    } catch (err) {
      console.error('Failed to start call:', err)
      setCallStatus('idle')
    }
  }, [callStatus])

  const stopCall = useCallback(() => {
    vapi.stop()
    setCallStatus('ended')
  }, [])

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted
    vapi.setMuted(newMuted)
    setIsMuted(newMuted)
  }, [isMuted])

  return {
    callStatus,
    transcript,
    isMuted,
    volumeLevel,
    startCall,
    stopCall,
    toggleMute,
  }
}
