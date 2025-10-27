'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

export default function EverestCinematic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Scene transitions based on scroll
  const scene1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0])
  const scene2Opacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0])
  const scene3Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0])
  const scene4Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0])
  const scene5Opacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1])

  // Zoom and scale effects
  const scene1Scale = useTransform(scrollYProgress, [0, 0.25], [1, 1.5])
  const scene2Scale = useTransform(scrollYProgress, [0.25, 0.45], [1.2, 1])
  const scene4Scale = useTransform(scrollYProgress, [0.65, 0.85], [1, 0.8])

  // Color temperature shift
  const colorTemp = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ['hue-rotate(0deg) saturate(0.6)', 'hue-rotate(0deg) saturate(0.7)', 'hue-rotate(20deg) saturate(1.2)']
  )

  useEffect(() => {
    // Create ambient wind sound using Web Audio API
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()

      const createWindSound = () => {
        const bufferSize = 2 * audioContext.sampleRate
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
        const output = noiseBuffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1
        }

        const whiteNoise = audioContext.createBufferSource()
        whiteNoise.buffer = noiseBuffer
        whiteNoise.loop = true

        const bandpass = audioContext.createBiquadFilter()
        bandpass.type = 'bandpass'
        bandpass.frequency.value = 400
        bandpass.Q.value = 0.5

        const lowpass = audioContext.createBiquadFilter()
        lowpass.type = 'lowpass'
        lowpass.frequency.value = 1200

        const gainNode = audioContext.createGain()
        gainNode.gain.value = 0.08

        whiteNoise.connect(bandpass)
        bandpass.connect(lowpass)
        lowpass.connect(gainNode)
        gainNode.connect(audioContext.destination)

        whiteNoise.start()
        setAudioLoaded(true)
      }

      // Start on user interaction
      const startAudio = () => {
        if (!audioLoaded) {
          audioContext.resume().then(() => {
            createWindSound()
          })
        }
      }

      document.addEventListener('click', startAudio, { once: true })
      document.addEventListener('scroll', startAudio, { once: true })

      return () => {
        audioContext.close()
      }
    }
  }, [audioLoaded])

  return (
    <div ref={containerRef} className="relative bg-black" style={{ height: '600vh' }}>
      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* Fixed viewport container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ filter: colorTemp }}
        >
          {/* Scene 1: Wide establishing shot - predawn blue hour */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: scene1Opacity, scale: scene1Scale }}
          >
            <div className="relative w-full h-full bg-gradient-to-b from-[#1a2332] via-[#2a3744] to-[#3d4d5f]">
              {/* Mountain silhouette */}
              <svg className="absolute bottom-0 w-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#4a5a6f', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#e8f0ff', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path
                  d="M0,600 L200,350 L350,420 L600,100 L750,180 L900,380 L1200,200 L1200,600 Z"
                  fill="url(#mountainGrad)"
                  opacity="0.9"
                />
                <path
                  d="M0,600 L300,400 L450,450 L600,100 L800,250 L1200,300 L1200,600 Z"
                  fill="#d4e3f5"
                  opacity="0.6"
                />
              </svg>

              {/* Tiny climber figure */}
              <motion.div
                className="absolute"
                style={{ top: '35%', left: '50%', transform: 'translate(-50%, -50%)' }}
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className="w-1.5 h-3 bg-[#2a1810] rounded-sm opacity-80" />
              </motion.div>

              {/* Stars */}
              <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-white rounded-full"
                    style={{
                      top: `${Math.random() * 40}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.7 + 0.3
                    }}
                    animate={{
                      opacity: [Math.random() * 0.5, Math.random() * 1, Math.random() * 0.5]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Scene 2: Close-up of eyes and hands */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1e2938] to-[#2d3e52]"
            style={{ opacity: scene2Opacity, scale: scene2Scale }}
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-20">
              {/* Eyes close-up */}
              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <div className="flex gap-12">
                  {/* Left eye */}
                  <div className="relative w-24 h-16 bg-gradient-to-b from-[#d4a574] to-[#c4956a] rounded-full overflow-hidden shadow-2xl">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#3d2817] to-[#1a0f08] rounded-full">
                      <div className="absolute top-1/4 left-1/4 w-5 h-5 bg-black rounded-full">
                        <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full" />
                      </div>
                    </div>
                    {/* Frost on eyelashes */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-white/30 to-transparent" />
                  </div>

                  {/* Right eye */}
                  <div className="relative w-24 h-16 bg-gradient-to-b from-[#d4a574] to-[#c4956a] rounded-full overflow-hidden shadow-2xl">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#3d2817] to-[#1a0f08] rounded-full">
                      <div className="absolute top-1/4 left-1/4 w-5 h-5 bg-black rounded-full">
                        <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-white/30 to-transparent" />
                  </div>
                </div>
              </motion.div>

              {/* Hand gripping ice axe */}
              <motion.div
                className="relative"
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
              >
                <div className="relative w-64 h-32">
                  {/* Hand */}
                  <div className="absolute left-0 bottom-0 w-28 h-24 bg-gradient-to-br from-[#c4956a] to-[#8b6f47] rounded-tl-3xl rounded-bl-xl shadow-2xl">
                    {/* Fingers */}
                    <div className="absolute -top-4 left-4 w-12 h-20 bg-gradient-to-b from-[#c4956a] to-[#8b6f47] rounded-t-lg transform -rotate-12" />
                    <div className="absolute top-0 left-14 w-10 h-20 bg-gradient-to-b from-[#c4956a] to-[#8b6f47] rounded-t-lg" />
                    {/* Weathered texture */}
                    <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-transparent via-black/20 to-black/40 rounded-tl-3xl rounded-bl-xl" />
                  </div>
                  {/* Ice axe */}
                  <div className="absolute left-16 top-0 bottom-0 w-6 bg-gradient-to-b from-[#6b7c8f] to-[#4a5563] rounded transform rotate-45 shadow-xl" />
                  <div className="absolute left-24 -top-4 w-16 h-3 bg-gradient-to-r from-[#8a95a5] to-[#b8c5d6] rounded transform rotate-45 shadow-xl" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scene 3: Dynamic climbing sequences */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#2a3844] via-[#3d4d5f] to-[#4a5c70]"
            style={{ opacity: scene3Opacity }}
          >
            <div className="relative w-full h-full overflow-hidden">
              {/* Diagonal ice wall */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4e3f5]/80 to-[#a8c5dd]/60 transform -skew-y-12 origin-top-left shadow-2xl" />

              {/* Climbing figure - larger and more detailed */}
              <motion.div
                className="absolute"
                style={{ top: '60%', left: '45%' }}
                animate={{
                  y: [-40, -80, -120],
                  x: [-10, 0, 10],
                }}
                transition={{
                  duration: 4,
                  times: [0, 0.5, 1],
                  ease: 'easeInOut'
                }}
              >
                <div className="relative">
                  {/* Climber body */}
                  <div className="w-12 h-20 bg-gradient-to-b from-[#c4302b] to-[#8b1f1a] rounded-lg shadow-xl" />
                  {/* Head */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#c4956a] rounded-full shadow-lg">
                    <div className="absolute top-0 left-0 right-0 h-4 bg-[#2a1810] rounded-t-full" />
                  </div>
                  {/* Arms */}
                  <div className="absolute top-4 -left-3 w-3 h-12 bg-[#c4302b] rounded transform -rotate-45" />
                  <div className="absolute top-4 -right-3 w-3 h-12 bg-[#c4302b] rounded transform rotate-45" />
                  {/* Legs */}
                  <div className="absolute bottom-0 left-2 w-4 h-14 bg-[#1a1a2e] rounded" />
                  <div className="absolute bottom-0 right-2 w-4 h-14 bg-[#1a1a2e] rounded" />
                </div>
              </motion.div>

              {/* Snow particles */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/70 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, 200],
                    x: [-20, 20],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Scene 4: Summit moment - slow motion */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#2a3844] via-[#4a5c70] to-[#6b7c8f]"
            style={{ opacity: scene4Opacity, scale: scene4Scale }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Sun breaking through */}
              <motion.div
                className="absolute top-20 left-1/2 transform -translate-x-1/2"
                animate={{
                  scale: [0.8, 1.2, 1],
                  opacity: [0.5, 1, 0.9]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-radial from-[#ffd700] via-[#ffed4e] to-transparent rounded-full blur-2xl opacity-80" />
                  <div className="absolute inset-0 w-32 h-32 bg-gradient-radial from-[#fff9e6] to-transparent rounded-full blur-xl" />
                </div>
              </motion.div>

              {/* Climber planting flag */}
              <motion.div
                className="relative z-10"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <div className="relative">
                  {/* Flag pole */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-40 w-1 h-40 bg-gradient-to-t from-[#4a4a4a] to-[#8a8a8a]" />

                  {/* Flag */}
                  <motion.div
                    className="absolute left-1/2 -top-40 w-20 h-14 bg-gradient-to-br from-[#c4302b] to-[#8b1f1a]"
                    animate={{
                      scaleX: [1, 0.95, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    style={{ transformOrigin: 'left' }}
                  />

                  {/* Climber figure */}
                  <div className="w-16 h-24 bg-gradient-to-b from-[#c4302b] to-[#8b1f1a] rounded-lg shadow-2xl">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#c4956a] rounded-full shadow-lg">
                      <div className="absolute top-0 left-0 right-0 h-5 bg-[#2a1810] rounded-t-full" />
                      {/* Frozen tears */}
                      <motion.div
                        className="absolute bottom-1 left-2 w-1 h-2 bg-gradient-to-b from-white/80 to-blue-200/60 rounded-full"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* God rays */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-20 left-1/2 w-1 h-full bg-gradient-to-b from-[#ffd700]/20 to-transparent"
                    style={{
                      transformOrigin: 'top',
                      rotate: `${(i - 4) * 15}deg`,
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Scene 5: Panoramic vista - warm golden hour */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#ffa85c] via-[#ff8c42] to-[#e6694a]"
            style={{ opacity: scene5Opacity }}
          >
            <div className="relative w-full h-full overflow-hidden">
              {/* Multiple mountain layers */}
              <svg className="absolute bottom-0 w-full h-3/4" viewBox="0 0 1200 600" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#8a6f5e', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#fff5e6', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#6b5a4f', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#d4c5b9', stopOpacity: 0.9 }} />
                  </linearGradient>
                </defs>

                {/* Far mountains */}
                <path
                  d="M0,400 L150,350 L300,380 L500,300 L700,350 L900,320 L1200,380 L1200,600 L0,600 Z"
                  fill="#4a3f38"
                  opacity="0.4"
                />

                {/* Mid mountains */}
                <path
                  d="M0,500 L200,400 L400,450 L600,350 L800,420 L1000,380 L1200,450 L1200,600 L0,600 Z"
                  fill="url(#mountain2)"
                />

                {/* Near mountains */}
                <path
                  d="M0,600 L100,480 L300,520 L450,200 L600,280 L750,500 L900,450 L1200,520 L1200,600 Z"
                  fill="url(#mountain1)"
                />
              </svg>

              {/* Clouds */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                  style={{
                    top: `${20 + i * 12}%`,
                    left: `${i * 15}%`,
                    width: `${80 + i * 20}px`,
                    height: `${40 + i * 10}px`,
                  }}
                  animate={{
                    x: [0, 100],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 20 + i * 5,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              ))}

              {/* Title text */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, delay: 0.5 }}
              >
                <div className="text-center">
                  <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider mb-4"
                      style={{
                        textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,200,100,0.3)',
                        fontFamily: 'Georgia, serif'
                      }}>
                    EVEREST
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 tracking-widest"
                     style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    8,849 METERS
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0.3, 1], y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/70 text-sm tracking-wider">SCROLL</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <motion.div
              className="w-1.5 h-1.5 bg-white/70 rounded-full mx-auto"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
