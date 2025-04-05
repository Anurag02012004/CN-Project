"use client"

import { useEffect, useRef } from "react"

interface MultiStreamingDemoProps {
  isActive: boolean
  sctpParams: {
    bandwidth: number
    latency: number
    jitter: number
    packetLoss: number
    multiHomingEnabled: boolean
    multiStreamingEnabled: boolean
    pathCount: number
    streamCount: number
    heartbeatInterval: number
    congestionControl: string
    orderedDelivery: boolean
    reliabilityLevel: number
  }
}

export function MultiStreamingDemo({ isActive, sctpParams }: MultiStreamingDemoProps) {
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

    // Draw multi-streaming demo
    const drawMultiStreamingDemo = () => {
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
      ctx.fillText("SCTP Multi-Streaming Demonstration", canvas.width / 2, 30)

      // Draw comparison between TCP and SCTP
      drawProtocolComparison()

      // Draw multi-streaming visualization
      drawMultiStreamingVisualization()

      // Draw explanation
      drawExplanation()
    }

    const drawProtocolComparison = () => {
      const startY = 60
      const height = 180
      const width = canvas.width - 100

      // Section title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("TCP vs SCTP Multi-Streaming", canvas.width / 2, startY - 10)

      // Draw TCP side (left)
      const tcpX = canvas.width / 4
      const tcpY = startY + height / 2

      // TCP title
      ctx.fillStyle = "#3b82f6"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("TCP (Single Stream)", tcpX, startY + 15)

      // Draw SCTP side (right)
      const sctpX = (canvas.width * 3) / 4
      const sctpY = startY + height / 2

      // SCTP title
      ctx.fillStyle = "#10b981"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("SCTP (Multiple Streams)", sctpX, startY + 15)

      // Draw TCP connection
      drawTcpConnection(tcpX, tcpY, width / 3, height - 40)

      // Draw SCTP connection
      drawSctpConnection(sctpX, sctpY, width / 3, height - 40)
    }

    const drawTcpConnection = (x: number, y: number, width: number, height: number) => {
      // Connection background
      ctx.fillStyle = "#f3f4f688"
      ctx.fillRect(x - width / 2, y - height / 2, width, height)
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.strokeRect(x - width / 2, y - height / 2, width, height)

      // Single stream line
      ctx.beginPath()
      ctx.moveTo(x - width / 2, y)
      ctx.lineTo(x + width / 2, y)
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.stroke()

      // Stream label
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Single Stream", x, y - height / 2 + 15)

      // Draw packets
      if (isActive) {
        const time = Date.now() / 1000

        // Different message types
        const messageTypes = [
          { label: "IMG", color: "#ef4444" },
          { label: "TXT", color: "#3b82f6" },
          { label: "VID", color: "#8b5cf6" },
          { label: "DAT", color: "#10b981" },
        ]

        // Draw packets in sequence (head-of-line blocking)
        let blockedPacket = -1

        // Simulate packet loss blocking the stream
        if (Math.random() * 100 < sctpParams.packetLoss) {
          blockedPacket = Math.floor(Math.random() * 4)
        }

        for (let i = 0; i < 4; i++) {
          // If this packet is blocked, all subsequent packets are blocked too
          if (blockedPacket >= 0 && i >= blockedPacket) {
            const offset = 0.3 + blockedPacket / 10
            const packetX = x - width / 2 + width * offset

            // Blocked packet
            ctx.beginPath()
            ctx.arc(packetX, y, 10, 0, Math.PI * 2)
            ctx.fillStyle = messageTypes[i].color
            ctx.fill()
            ctx.strokeStyle = "#ef4444"
            ctx.lineWidth = 2
            ctx.stroke()

            // X mark
            ctx.beginPath()
            ctx.moveTo(packetX - 5, y - 5)
            ctx.lineTo(packetX + 5, y + 5)
            ctx.moveTo(packetX + 5, y - 5)
            ctx.lineTo(packetX - 5, y + 5)
            ctx.strokeStyle = "#ef4444"
            ctx.lineWidth = 2
            ctx.stroke()

            // Blocked label
            ctx.fillStyle = "#ef4444"
            ctx.font = "10px sans-serif"
            ctx.textAlign = "center"
            ctx.fillText("BLOCKED", packetX, y + 20)

            break
          }

          const offset = (time * 0.3 + i / 10) % 1
          const packetX = x - width / 2 + width * offset

          // Packet
          ctx.beginPath()
          ctx.arc(packetX, y, 10, 0, Math.PI * 2)
          ctx.fillStyle = messageTypes[i].color
          ctx.fill()

          // Packet label
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 8px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(messageTypes[i].label, packetX, y)
        }

        // Head-of-line blocking explanation
        if (blockedPacket >= 0) {
          ctx.fillStyle = "#ef4444"
          ctx.font = "bold 12px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("Head-of-Line Blocking", x, y + height / 2 - 15)
        }
      }
    }

    const drawSctpConnection = (x: number, y: number, width: number, height: number) => {
      // Connection background
      ctx.fillStyle = "#f3f4f688"
      ctx.fillRect(x - width / 2, y - height / 2, width, height)
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 2
      ctx.strokeRect(x - width / 2, y - height / 2, width, height)

      // Multiple stream lines
      const streamCount = sctpParams.multiStreamingEnabled ? Math.min(4, sctpParams.streamCount) : 1

      const streamSpacing = height / (streamCount + 1)

      for (let i = 0; i < streamCount; i++) {
        const streamY = y - height / 2 + streamSpacing * (i + 1)

        ctx.beginPath()
        ctx.moveTo(x - width / 2, streamY)
        ctx.lineTo(x + width / 2, streamY)
        ctx.strokeStyle = "#10b981"
        ctx.lineWidth = 2
        ctx.stroke()

        // Stream label
        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(`Stream ${i + 1}`, x - width / 2 + 10, streamY - 10)
      }

      // Draw packets
      if (isActive) {
        const time = Date.now() / 1000

        // Different message types
        const messageTypes = [
          { label: "IMG", color: "#ef4444" },
          { label: "TXT", color: "#3b82f6" },
          { label: "VID", color: "#8b5cf6" },
          { label: "DAT", color: "#10b981" },
        ]

        if (sctpParams.multiStreamingEnabled) {
          // Draw packets on separate streams
          for (let i = 0; i < streamCount; i++) {
            const streamY = y - height / 2 + streamSpacing * (i + 1)
            const messageType = messageTypes[i % messageTypes.length]

            // Simulate packet loss on this stream
            let blockedPacket = -1
            if (Math.random() * 100 < sctpParams.packetLoss) {
              blockedPacket = 1
            }

            for (let j = 0; j < 2; j++) {
              // If this packet is blocked but others continue
              if (blockedPacket >= 0 && j >= blockedPacket) {
                const offset = 0.3 + blockedPacket / 10
                const packetX = x - width / 2 + width * offset

                // Blocked packet
                ctx.beginPath()
                ctx.arc(packetX, streamY, 10, 0, Math.PI * 2)
                ctx.fillStyle = messageType.color
                ctx.fill()
                ctx.strokeStyle = "#ef4444"
                ctx.lineWidth = 2
                ctx.stroke()

                // X mark
                ctx.beginPath()
                ctx.moveTo(packetX - 5, streamY - 5)
                ctx.lineTo(packetX + 5, streamY + 5)
                ctx.moveTo(packetX + 5, streamY - 5)
                ctx.lineTo(packetX - 5, streamY + 5)
                ctx.strokeStyle = "#ef4444"
                ctx.lineWidth = 2
                ctx.stroke()

                break
              }

              const offset = (time * 0.3 + j / 10 + i / 5) % 1
              const packetX = x - width / 2 + width * offset

              // Packet
              ctx.beginPath()
              ctx.arc(packetX, streamY, 10, 0, Math.PI * 2)
              ctx.fillStyle = messageType.color
              ctx.fill()

              // Packet label
              ctx.fillStyle = "#ffffff"
              ctx.font = "bold 8px sans-serif"
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillText(messageType.label, packetX, streamY)
            }
          }

          // No head-of-line blocking explanation
          ctx.fillStyle = "#10b981"
          ctx.font = "bold 12px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("No Head-of-Line Blocking", x, y + height / 2 - 15)
        } else {
          // Single stream (like TCP)
          const streamY = y

          // Simulate packet loss blocking the stream
          let blockedPacket = -1
          if (Math.random() * 100 < sctpParams.packetLoss) {
            blockedPacket = Math.floor(Math.random() * 4)
          }

          for (let i = 0; i < 4; i++) {
            // If this packet is blocked, all subsequent packets are blocked too
            if (blockedPacket >= 0 && i >= blockedPacket) {
              const offset = 0.3 + blockedPacket / 10
              const packetX = x - width / 2 + width * offset

              // Blocked packet
              ctx.beginPath()
              ctx.arc(packetX, streamY, 10, 0, Math.PI * 2)
              ctx.fillStyle = messageTypes[i].color
              ctx.fill()
              ctx.strokeStyle = "#ef4444"
              ctx.lineWidth = 2
              ctx.stroke()

              // X mark
              ctx.beginPath()
              ctx.moveTo(packetX - 5, streamY - 5)
              ctx.lineTo(packetX + 5, streamY + 5)
              ctx.moveTo(packetX + 5, streamY - 5)
              ctx.lineTo(packetX - 5, streamY + 5)
              ctx.strokeStyle = "#ef4444"
              ctx.lineWidth = 2
              ctx.stroke()

              break
            }

            const offset = (time * 0.3 + i / 10) % 1
            const packetX = x - width / 2 + width * offset

            // Packet
            ctx.beginPath()
            ctx.arc(packetX, streamY, 10, 0, Math.PI * 2)
            ctx.fillStyle = messageTypes[i].color
            ctx.fill()

            // Packet label
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 8px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(messageTypes[i].label, packetX, streamY)
          }
        }
      }
    }

    const drawMultiStreamingVisualization = () => {
      const startY = 270
      const height = 180
      const width = canvas.width - 100
      const x = canvas.width / 2

      // Section title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("SCTP Association with Multiple Streams", x, startY - 10)

      // Draw SCTP endpoints
      const endpoint1X = x - width / 2 + 50
      const endpoint2X = x + width / 2 - 50
      const endpointY = startY + height / 2

      // Endpoint 1
      drawEndpoint(endpoint1X, endpointY, "Endpoint A")

      // Endpoint 2
      drawEndpoint(endpoint2X, endpointY, "Endpoint B")

      // Draw SCTP association
      ctx.beginPath()
      ctx.moveTo(endpoint1X + 30, endpointY)
      ctx.lineTo(endpoint2X - 30, endpointY)
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 3
      ctx.stroke()

      // Association label
      ctx.fillStyle = "#10b981"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("SCTP Association", x, endpointY - 55)

      // Draw streams
      if (sctpParams.multiStreamingEnabled) {
        const streamCount = Math.min(sctpParams.streamCount, 6)
        const streamSpacing = 15
        const streamStartY = endpointY - (streamCount * streamSpacing) / 2

        for (let i = 0; i < streamCount; i++) {
          const streamY = streamStartY + i * streamSpacing

          // Stream line
          ctx.beginPath()
          ctx.moveTo(endpoint1X + 30, streamY)
          ctx.lineTo(endpoint2X - 30, streamY)
          ctx.strokeStyle = "#10b98166"
          ctx.lineWidth = 1
          ctx.stroke()

          // Stream label
          ctx.fillStyle = "#1f2937"
          ctx.font = "10px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(`Stream ${i + 1}`, x, streamY - 8)

          // Draw packets if active
          if (isActive) {
            const time = Date.now() / 1000

            // Forward packets
            for (let j = 0; j < 2; j++) {
              const offset = (time * 0.3 + j / 5 + i / 10) % 1
              const packetX = endpoint1X + 30 + (endpoint2X - endpoint1X - 60) * offset

              // Skip if packet loss
              if (Math.random() * 100 < sctpParams.packetLoss) {
                continue
              }

              // Packet
              ctx.beginPath()
              ctx.arc(packetX, streamY, 5, 0, Math.PI * 2)
              ctx.fillStyle = "#10b981"
              ctx.fill()

              // Sequence number
              if (sctpParams.orderedDelivery) {
                ctx.fillStyle = "#ffffff"
                ctx.font = "bold 6px sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText((j + 1).toString(), packetX, streamY)
              }
            }

            // Backward acknowledgments
            if (time % 1 < 0.5) {
              const ackX = endpoint2X - 30 - (endpoint2X - endpoint1X - 60) * 0.7

              // ACK packet
              ctx.beginPath()
              ctx.rect(ackX - 6, streamY - 3, 12, 6)
              ctx.fillStyle = "#8b5cf6"
              ctx.fill()

              // ACK label
              ctx.fillStyle = "#ffffff"
              ctx.font = "bold 6px sans-serif"
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillText("ACK", ackX, streamY)
            }
          }
        }

        // Draw ordered/unordered delivery indicator
        ctx.fillStyle = "#1f2937"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(sctpParams.orderedDelivery ? "Ordered Delivery" : "Unordered Delivery", x, endpointY + 40)
      } else {
        // Show disabled message
        ctx.fillStyle = "#6b7280"
        ctx.font = "italic 14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Multi-streaming is disabled", x, endpointY + 20)
      }
    }

    const drawEndpoint = (x: number, y: number, label: string) => {
      // Endpoint circle
      ctx.beginPath()
      ctx.arc(x, y, 30, 0, Math.PI * 2)
      ctx.fillStyle = "#10b981"
      ctx.fill()
      ctx.strokeStyle = "#047857"
      ctx.lineWidth = 2
      ctx.stroke()

      // Endpoint label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x, y)
    }

    const drawExplanation = () => {
      const startY = 470

      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"

      if (sctpParams.multiStreamingEnabled) {
        ctx.fillText(
          "SCTP Multi-Streaming allows multiple independent message streams within a single connection",
          canvas.width / 2,
          startY,
        )
        ctx.fillText("This eliminates head-of-line blocking issues found in TCP", canvas.width / 2, startY + 20)
      } else {
        ctx.fillText(
          "Without multi-streaming, SCTP behaves similar to TCP with a single stream",
          canvas.width / 2,
          startY,
        )
        ctx.fillText("Enable multi-streaming to see the benefits", canvas.width / 2, startY + 20)
      }
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawMultiStreamingDemo()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawMultiStreamingDemo()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, sctpParams])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

