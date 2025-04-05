"use client"

import { useEffect, useRef } from "react"

interface VoipStreamingProps {
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

export function VoipStreaming({ isActive, rtpParams }: VoipStreamingProps) {
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

    // Draw VoIP streaming simulation
    const drawVoipStreaming = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#fdf2f8")
      gradient.addColorStop(1, "#fbcfe8")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 18px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("VoIP & Streaming Simulation", canvas.width / 2, 30)

      // Draw caller and receiver
      const callerX = 100
      const receiverX = canvas.width - 100
      const centerY = canvas.height / 2

      // Caller
      drawPerson(callerX, centerY - 80, "Caller")

      // Receiver
      drawPerson(receiverX, centerY - 80, "Receiver")

      // Draw RTP packets flow
      drawRtpFlow(callerX, receiverX, centerY)

      // Draw RTCP reports flow
      drawRtcpFlow(callerX, receiverX, centerY + 100)

      // Draw audio waveform
      drawAudioWaveform(centerY + 200)

      // Draw jitter buffer visualization
      drawJitterBuffer(centerY - 20)
    }

    const drawPerson = (x: number, y: number, label: string) => {
      // Head
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, Math.PI * 2)
      ctx.fillStyle = "#6366f1"
      ctx.fill()

      // Body
      ctx.beginPath()
      ctx.moveTo(x, y + 20)
      ctx.lineTo(x, y + 60)
      ctx.strokeStyle = "#6366f1"
      ctx.lineWidth = 4
      ctx.stroke()

      // Arms
      ctx.beginPath()
      ctx.moveTo(x - 20, y + 40)
      ctx.lineTo(x + 20, y + 40)
      ctx.stroke()

      // Legs
      ctx.beginPath()
      ctx.moveTo(x, y + 60)
      ctx.lineTo(x - 15, y + 90)
      ctx.moveTo(x, y + 60)
      ctx.lineTo(x + 15, y + 90)
      ctx.stroke()

      // Label
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x, y + 110)
    }

    const drawRtpFlow = (startX: number, endX: number, y: number) => {
      // Flow line
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(endX, y)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // Flow label
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("RTP Packets", canvas.width / 2, y - 20)

      // Draw packets
      if (isActive) {
        const time = Date.now() / 1000
        const packetCount = 5

        for (let i = 0; i < packetCount; i++) {
          const offset = (time * 0.5 + i / packetCount) % 1

          // Apply jitter effect
          const jitterEffect = (Math.sin(time * 10 + i) * rtpParams.jitter) / 20
          const packetY = y + jitterEffect

          // Skip packet if packet loss occurs
          if (Math.random() * 100 < rtpParams.packetLoss) {
            continue
          }

          const x = startX + (endX - startX) * offset

          // Packet
          ctx.beginPath()
          ctx.arc(x, packetY, 8, 0, Math.PI * 2)
          ctx.fillStyle = "#3b82f6"
          ctx.fill()
          ctx.strokeStyle = "#2563eb"
          ctx.lineWidth = 2
          ctx.stroke()

          // Packet number
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 10px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText((i + 1).toString(), x, packetY)

          // Draw FEC packet if enabled
          if (rtpParams.fecEnabled && i % 3 === 0) {
            const fecX = x + 15
            const fecY = packetY - 10

            ctx.beginPath()
            ctx.arc(fecX, fecY, 6, 0, Math.PI * 2)
            ctx.fillStyle = "#8b5cf6"
            ctx.fill()
            ctx.strokeStyle = "#7c3aed"
            ctx.lineWidth = 1
            ctx.stroke()

            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 8px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("F", fecX, fecY)

            // Connection line
            ctx.beginPath()
            ctx.moveTo(x, packetY)
            ctx.lineTo(fecX, fecY)
            ctx.strokeStyle = "#8b5cf688"
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    const drawRtcpFlow = (startX: number, endX: number, y: number) => {
      // Flow line
      ctx.beginPath()
      ctx.moveTo(endX, y)
      ctx.lineTo(startX, y)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // Flow label
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("RTCP Reports", canvas.width / 2, y - 20)

      // Draw RTCP packets
      if (isActive) {
        const time = Date.now() / 1000

        // Only send RTCP packets at the specified interval
        if (Math.floor(time) % rtpParams.rtcpInterval === 0) {
          const packetCount = 2

          for (let i = 0; i < packetCount; i++) {
            const offset = (time * 0.2 + i / packetCount) % 1
            const x = endX - (endX - startX) * offset

            // RTCP packet
            ctx.beginPath()
            ctx.rect(x - 12, y - 8, 24, 16)
            ctx.fillStyle = "#8b5cf6"
            ctx.fill()
            ctx.strokeStyle = "#7c3aed"
            ctx.lineWidth = 2
            ctx.stroke()

            // RTCP label
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 10px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("RTCP", x, y)
          }
        }

        // Draw RTCP report info
        const reportX = canvas.width / 2
        const reportY = y + 40

        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"

        const jitter = Math.round(rtpParams.jitter)
        const packetLoss = Math.round(rtpParams.packetLoss)
        const roundTripTime = Math.round(rtpParams.latency * 1.2)

        ctx.fillText(
          `Jitter: ${jitter}ms | Packet Loss: ${packetLoss}% | Round Trip Time: ${roundTripTime}ms`,
          reportX,
          reportY,
        )
        ctx.fillText(
          `RTCP Interval: ${rtpParams.rtcpInterval}s | Codec: ${rtpParams.codecType.toUpperCase()}`,
          reportX,
          reportY + 20,
        )
      }
    }

    const drawAudioWaveform = (y: number) => {
      const waveformHeight = 60
      const waveformWidth = canvas.width - 200
      const startX = 100

      // Waveform background
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(startX, y - waveformHeight / 2, waveformWidth, waveformHeight)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(startX, y - waveformHeight / 2, waveformWidth, waveformHeight)

      // Waveform label
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Audio Waveform", canvas.width / 2, y - waveformHeight / 2 - 20)

      // Draw waveform
      if (isActive) {
        ctx.beginPath()
        ctx.moveTo(startX, y)

        for (let i = 0; i < waveformWidth; i++) {
          const x = startX + i

          // Create a more complex waveform based on multiple frequencies
          const amplitude =
            Math.sin(i * 0.05 + Date.now() / 200) * 15 +
            Math.sin(i * 0.02 + Date.now() / 300) * 5 +
            Math.sin(i * 0.1 + Date.now() / 100) * 3

          // Apply jitter effect to waveform
          const jitterEffect = ((Math.random() * 2 - 1) * rtpParams.jitter) / 10

          ctx.lineTo(x, y + amplitude + jitterEffect)
        }

        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw packet loss gaps if packet loss is high
        if (rtpParams.packetLoss > 5) {
          const gapCount = Math.floor(rtpParams.packetLoss / 2)

          for (let i = 0; i < gapCount; i++) {
            const gapX = startX + Math.random() * waveformWidth
            const gapWidth = 5 + Math.random() * 15

            ctx.fillStyle = "#f3f4f6"
            ctx.fillRect(gapX, y - waveformHeight / 2, gapWidth, waveformHeight)

            // Gap border
            ctx.strokeStyle = "#ef444444"
            ctx.lineWidth = 1
            ctx.strokeRect(gapX, y - waveformHeight / 2, gapWidth, waveformHeight)
          }
        }
      }
    }

    const drawJitterBuffer = (y: number) => {
      const bufferWidth = 200
      const bufferHeight = 40
      const bufferX = canvas.width - 150
      const bufferY = y

      // Buffer title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Jitter Buffer", bufferX, bufferY - 10)

      // Buffer background
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(bufferX - bufferWidth / 2, bufferY, bufferWidth, bufferHeight)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(bufferX - bufferWidth / 2, bufferY, bufferWidth, bufferHeight)

      // Buffer fill based on jitter buffer size
      const fillWidth = (bufferWidth * rtpParams.jitterBuffer) / 200
      ctx.fillStyle = "#3b82f688"
      ctx.fillRect(bufferX - bufferWidth / 2, bufferY, fillWidth, bufferHeight)

      // Buffer size label
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${rtpParams.jitterBuffer}ms`, bufferX, bufferY + bufferHeight / 2)

      // Draw packets in buffer
      if (isActive) {
        const time = Date.now() / 1000
        const packetCount = Math.floor(rtpParams.jitterBuffer / 20)

        for (let i = 0; i < packetCount; i++) {
          const offset = i / packetCount
          const x = bufferX - bufferWidth / 2 + offset * fillWidth

          // Packet
          ctx.beginPath()
          ctx.arc(x + 10, bufferY + bufferHeight / 2, 6, 0, Math.PI * 2)
          ctx.fillStyle = "#3b82f6"
          ctx.fill()
          ctx.strokeStyle = "#2563eb"
          ctx.lineWidth = 1
          ctx.stroke()

          // Packet number
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 8px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText((i + 1).toString(), x + 10, bufferY + bufferHeight / 2)
        }

        // Show buffer effect explanation
        let bufferEffect = ""

        if (rtpParams.jitterBuffer < 40) {
          bufferEffect = "Low buffer: Less delay, more audio gaps"
        } else if (rtpParams.jitterBuffer > 120) {
          bufferEffect = "High buffer: More delay, smoother audio"
        } else {
          bufferEffect = "Balanced buffer: Moderate delay and quality"
        }

        ctx.fillStyle = "#6b7280"
        ctx.font = "11px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(bufferEffect, bufferX, bufferY + bufferHeight + 15)
      }
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawVoipStreaming()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawVoipStreaming()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, rtpParams])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

