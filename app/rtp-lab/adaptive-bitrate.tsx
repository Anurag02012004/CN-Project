"use client"

import { useEffect, useRef } from "react"

interface AdaptiveBitrateProps {
  isActive: boolean
  rtpParams: {
    bandwidth: number
    latency: number
    jitter: number
    packetLoss: number
    rtcpInterval: number
    securityEnabled: boolean
    codecType: string
    adaptiveBitrate: boolean
    fecEnabled: boolean
    jitterBuffer: number
  }
}

export function AdaptiveBitrate({ isActive, rtpParams }: AdaptiveBitrateProps) {
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

    // Draw adaptive bitrate visualization
    const drawAdaptiveBitrate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#fdf2f8")
      gradient.addColorStop(1, "#fbcfe8")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 18px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Adaptive Bitrate Streaming", canvas.width / 2, 30)

      // Draw network conditions graph
      drawNetworkGraph()

      // Draw video quality visualization
      drawVideoQuality()

      // Draw explanation
      drawExplanation()
    }

    const drawNetworkGraph = () => {
      const graphX = 50
      const graphY = 70
      const graphWidth = canvas.width - 100
      const graphHeight = 120

      // Graph background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(graphX, graphY, graphWidth, graphHeight)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(graphX, graphY, graphWidth, graphHeight)

      // Graph title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Network Bandwidth Over Time", canvas.width / 2, graphY - 10)

      // Draw axes
      ctx.beginPath()
      ctx.moveTo(graphX, graphY + graphHeight)
      ctx.lineTo(graphX + graphWidth, graphY + graphHeight)
      ctx.moveTo(graphX, graphY)
      ctx.lineTo(graphX, graphY + graphHeight)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 1
      ctx.stroke()

      // Axis labels
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Time", graphX + graphWidth / 2, graphY + graphHeight + 15)

      ctx.save()
      ctx.translate(graphX - 15, graphY + graphHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.textAlign = "center"
      ctx.fillText("Bandwidth (Mbps)", 0, 0)
      ctx.restore()

      // Draw bandwidth line
      if (isActive) {
        const time = Date.now() / 1000
        const pointCount = 50

        // Network bandwidth fluctuation
        ctx.beginPath()
        for (let i = 0; i < pointCount; i++) {
          const x = graphX + (graphWidth / pointCount) * i

          // Simulate network fluctuation
          const fluctuation = Math.sin(time * 0.5 + i * 0.2) * 0.3 + Math.sin(time * 0.2 + i * 0.1) * 0.2
          const bandwidth = rtpParams.bandwidth * (1 + fluctuation)
          const normalizedBandwidth = Math.min(1, bandwidth / 20) // Normalize to 0-1 range
          const y = graphY + graphHeight - normalizedBandwidth * graphHeight

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw adaptive bitrate line if enabled
        if (rtpParams.adaptiveBitrate) {
          ctx.beginPath()
          for (let i = 0; i < pointCount; i++) {
            const x = graphX + (graphWidth / pointCount) * i

            // Simulate network fluctuation with delay
            const fluctuation = Math.sin(time * 0.5 + i * 0.2 - 0.5) * 0.3 + Math.sin(time * 0.2 + i * 0.1 - 0.5) * 0.2
            const bandwidth = rtpParams.bandwidth * (1 + fluctuation)

            // Adaptive bitrate follows network with some smoothing
            const adaptiveBitrate = Math.max(1, bandwidth * 0.9)
            const normalizedBitrate = Math.min(1, adaptiveBitrate / 20)
            const y = graphY + graphHeight - normalizedBitrate * graphHeight

            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
          ctx.strokeStyle = "#10b981"
          ctx.lineWidth = 2
          ctx.stroke()
        } else {
          // Fixed bitrate line
          ctx.beginPath()
          ctx.moveTo(graphX, graphY + graphHeight - (rtpParams.bandwidth / 20) * graphHeight)
          ctx.lineTo(graphX + graphWidth, graphY + graphHeight - (rtpParams.bandwidth / 20) * graphHeight)
          ctx.strokeStyle = "#ef4444"
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.stroke()
          ctx.setLineDash([])
        }

        // Legend
        const legendY = graphY + 20

        // Network bandwidth
        ctx.beginPath()
        ctx.moveTo(graphX + 20, legendY)
        ctx.lineTo(graphX + 50, legendY)
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText("Available Bandwidth", graphX + 55, legendY + 4)

        // Adaptive/Fixed bitrate
        ctx.beginPath()
        ctx.moveTo(graphX + graphWidth - 150, legendY)
        ctx.lineTo(graphX + graphWidth - 120, legendY)
        if (rtpParams.adaptiveBitrate) {
          ctx.strokeStyle = "#10b981"
          ctx.lineWidth = 2
          ctx.setLineDash([])
        } else {
          ctx.strokeStyle = "#ef4444"
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
        }
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(
          rtpParams.adaptiveBitrate ? "Adaptive Bitrate" : "Fixed Bitrate",
          graphX + graphWidth - 115,
          legendY + 4,
        )
      }
    }

    const drawVideoQuality = () => {
      const startY = 220
      const width = canvas.width - 100
      const height = 180
      const x = canvas.width / 2

      // Section title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Video Quality Comparison", x, startY)

      // Draw video frames
      const frameWidth = width / 2 - 20
      const frameHeight = height - 40

      // Fixed bitrate frame
      const fixedX = x - width / 2 + 10
      const fixedY = startY + 20

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(fixedX, fixedY, frameWidth, frameHeight)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(fixedX, fixedY, frameWidth, frameHeight)

      // Adaptive bitrate frame
      const adaptiveX = x + 10
      const adaptiveY = startY + 20

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(adaptiveX, adaptiveY, frameWidth, frameHeight)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(adaptiveX, adaptiveY, frameWidth, frameHeight)

      // Frame labels
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Fixed Bitrate", fixedX + frameWidth / 2, fixedY - 5)
      ctx.fillText("Adaptive Bitrate", adaptiveX + frameWidth / 2, adaptiveY - 5)

      // Draw video content
      if (isActive) {
        const time = Date.now() / 1000

        // Calculate current network conditions
        const networkFluctuation = Math.sin(time * 0.5) * 0.3 + Math.sin(time * 0.2) * 0.2
        const currentBandwidth = rtpParams.bandwidth * (1 + networkFluctuation)

        // Fixed bitrate quality (degrades when bandwidth is low)
        const fixedQuality =
          currentBandwidth < rtpParams.bandwidth ? Math.max(0.3, currentBandwidth / rtpParams.bandwidth) : 1

        // Adaptive bitrate quality (adjusts to available bandwidth)
        const adaptiveQuality = rtpParams.adaptiveBitrate
          ? Math.min(1, Math.max(0.6, (currentBandwidth / rtpParams.bandwidth) * 0.9))
          : fixedQuality

        // Draw fixed bitrate video content
        drawVideoContent(fixedX, fixedY, frameWidth, frameHeight, fixedQuality)

        // Draw adaptive bitrate video content
        drawVideoContent(adaptiveX, adaptiveY, frameWidth, frameHeight, adaptiveQuality)

        // Quality indicators
        ctx.fillStyle = fixedQuality > 0.7 ? "#10b981" : fixedQuality > 0.4 ? "#f59e0b" : "#ef4444"
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`Quality: ${Math.round(fixedQuality * 100)}%`, fixedX + frameWidth / 2, fixedY + frameHeight + 15)

        ctx.fillStyle = adaptiveQuality > 0.7 ? "#10b981" : adaptiveQuality > 0.4 ? "#f59e0b" : "#ef4444"
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(
          `Quality: ${Math.round(adaptiveQuality * 100)}%`,
          adaptiveX + frameWidth / 2,
          adaptiveY + frameHeight + 15,
        )

        // Bitrate indicators
        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(
          `Bitrate: ${rtpParams.bandwidth.toFixed(1)} Mbps`,
          fixedX + frameWidth / 2,
          fixedY + frameHeight + 35,
        )

        const adaptiveBitrateValue = rtpParams.adaptiveBitrate
          ? Math.max(1, currentBandwidth * 0.9).toFixed(1)
          : rtpParams.bandwidth.toFixed(1)
        ctx.fillText(`Bitrate: ${adaptiveBitrateValue} Mbps`, adaptiveX + frameWidth / 2, adaptiveY + frameHeight + 35)
      }
    }

    const drawVideoContent = (x: number, y: number, width: number, height: number, quality: number) => {
      // Draw video content with quality simulation
      const blockSize = Math.max(4, Math.round((1 - quality) * 20))
      const rows = Math.ceil(height / blockSize)
      const cols = Math.ceil(width / blockSize)

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const blockX = x + col * blockSize
          const blockY = y + row * blockSize
          const blockWidth = Math.min(blockSize, x + width - blockX)
          const blockHeight = Math.min(blockSize, y + height - blockY)

          // Simulate video content with varying colors
          const hue = (row * col) % 360
          const saturation = 50 + Math.sin(row / 5) * 20
          const lightness = 50 + Math.cos(col / 5) * 20

          // Apply quality degradation
          const adjustedLightness = lightness * (0.7 + quality * 0.3)
          const adjustedSaturation = saturation * quality

          ctx.fillStyle = `hsl(${hue}, ${adjustedSaturation}%, ${adjustedLightness}%)`
          ctx.fillRect(blockX, blockY, blockWidth, blockHeight)
        }
      }

      // Add artifacts for low quality
      if (quality < 0.7) {
        const artifactCount = Math.round((1 - quality) * 30)

        for (let i = 0; i < artifactCount; i++) {
          const artifactX = x + Math.random() * width
          const artifactY = y + Math.random() * height
          const artifactSize = Math.random() * 10 + 5

          ctx.fillStyle = `rgba(0, 0, 0, ${(1 - quality) * 0.5})`
          ctx.fillRect(artifactX, artifactY, artifactSize, artifactSize)
        }
      }
    }

    const drawExplanation = () => {
      const startY = 430

      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"

      if (rtpParams.adaptiveBitrate) {
        ctx.fillText(
          "Adaptive Bitrate Streaming dynamically adjusts video quality based on available bandwidth",
          canvas.width / 2,
          startY,
        )
        ctx.fillText("This ensures smooth playback even when network conditions change", canvas.width / 2, startY + 20)
      } else {
        ctx.fillText(
          "Fixed Bitrate Streaming uses the same quality regardless of network conditions",
          canvas.width / 2,
          startY,
        )
        ctx.fillText(
          "This can lead to buffering or quality issues when bandwidth is limited",
          canvas.width / 2,
          startY + 20,
        )
      }

      // Benefits list
      const benefits = [
        "Reduces buffering and stalling",
        "Optimizes bandwidth usage",
        "Improves user experience",
        "Adapts to changing network conditions",
      ]

      if (rtpParams.adaptiveBitrate) {
        ctx.fillStyle = "#10b981"
        ctx.font = "bold 14px sans-serif"
        ctx.fillText("Benefits of Adaptive Bitrate:", canvas.width / 2, startY + 50)

        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"

        for (let i = 0; i < benefits.length; i++) {
          ctx.fillText(benefits[i], canvas.width / 2, startY + 70 + i * 16)
        }
      }
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawAdaptiveBitrate()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawAdaptiveBitrate()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, rtpParams])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

