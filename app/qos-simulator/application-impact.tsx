"use client"

import { useEffect, useRef } from "react"

interface ApplicationImpactProps {
  isActive: boolean
  networkParams: {
    bandwidth: number
    latency: number
    jitter: number
    packetLoss: number
    priorityQueue: boolean
  }
}

export function ApplicationImpact({ isActive, networkParams }: ApplicationImpactProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Calculate application quality scores based on network parameters
    const calculateQuality = () => {
      // VoIP quality (most affected by jitter and latency)
      const voipQuality = Math.max(
        0,
        100 - networkParams.jitter * 3 - networkParams.latency / 5 - networkParams.packetLoss * 5,
      )

      // Video streaming quality (most affected by bandwidth and packet loss)
      const videoQuality = Math.max(
        0,
        100 - (100 / networkParams.bandwidth) * 10 - networkParams.packetLoss * 4 - networkParams.jitter,
      )

      // Gaming quality (most affected by latency and jitter)
      const gamingQuality = Math.max(
        0,
        100 - networkParams.latency / 3 - networkParams.jitter * 2 - networkParams.packetLoss * 3,
      )

      // Web browsing quality (most affected by bandwidth and latency)
      const webQuality = Math.max(
        0,
        100 - (100 / networkParams.bandwidth) * 5 - networkParams.latency / 10 - networkParams.packetLoss * 2,
      )

      return { voipQuality, videoQuality, gamingQuality, webQuality }
    }

    const drawApplicationImpact = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#fdf2f8")
      gradient.addColorStop(1, "#fbcfe8")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Calculate quality scores
      const { voipQuality, videoQuality, gamingQuality, webQuality } = calculateQuality()

      // Draw application quality bars
      const barWidth = canvas.width * 0.7
      const barHeight = 40
      const startX = (canvas.width - barWidth) / 2
      const spacing = 60
      const startY = 50

      // VoIP Quality
      drawQualityBar(startX, startY, barWidth, barHeight, voipQuality, "VoIP Call", "#3b82f6")

      // Video Streaming Quality
      drawQualityBar(startX, startY + spacing, barWidth, barHeight, videoQuality, "Video Streaming", "#ef4444")

      // Gaming Quality
      drawQualityBar(startX, startY + spacing * 2, barWidth, barHeight, gamingQuality, "Online Gaming", "#8b5cf6")

      // Web Browsing Quality
      drawQualityBar(startX, startY + spacing * 3, barWidth, barHeight, webQuality, "Web Browsing", "#10b981")

      // Draw quality indicators
      const indicatorY = startY + spacing * 4 + 20
      const indicatorSpacing = canvas.width / 4

      // Poor
      drawQualityIndicator(indicatorSpacing * 0.5, indicatorY, "Poor", "#ef4444")

      // Fair
      drawQualityIndicator(indicatorSpacing * 1.5, indicatorY, "Fair", "#f59e0b")

      // Good
      drawQualityIndicator(indicatorSpacing * 2.5, indicatorY, "Good", "#10b981")

      // Excellent
      drawQualityIndicator(indicatorSpacing * 3.5, indicatorY, "Excellent", "#3b82f6")
    }

    const drawQualityBar = (
      x: number,
      y: number,
      width: number,
      height: number,
      quality: number,
      label: string,
      color: string,
    ) => {
      // Draw label
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(label, x - 10, y + height / 2 + 5)

      // Draw background bar
      ctx.fillStyle = "#e5e7eb"
      ctx.fillRect(x, y, width, height)

      // Draw quality bar
      const qualityWidth = (width * quality) / 100

      // Create gradient based on quality
      const barGradient = ctx.createLinearGradient(x, 0, x + width, 0)
      barGradient.addColorStop(0, `${color}`)
      barGradient.addColorStop(1, `${color}88`)
      ctx.fillStyle = barGradient
      ctx.fillRect(x, y, qualityWidth, height)

      // Draw border
      ctx.strokeStyle = "#9ca3af"
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, width, height)

      // Draw quality percentage
      ctx.fillStyle = quality > 50 ? "#ffffff" : "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${Math.round(quality)}%`, x + qualityWidth / 2, y + height / 2 + 5)

      // Draw quality status
      let status = "Poor"
      if (quality >= 75) status = "Excellent"
      else if (quality >= 50) status = "Good"
      else if (quality >= 25) status = "Fair"

      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(status, x + width + 10, y + height / 2 + 5)
    }

    const drawQualityIndicator = (x: number, y: number, label: string, color: string) => {
      // Draw circle
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x, y + 25)
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawApplicationImpact()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawApplicationImpact()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, networkParams])

  return <canvas ref={canvasRef} className="w-full h-[300px] rounded-md" />
}

