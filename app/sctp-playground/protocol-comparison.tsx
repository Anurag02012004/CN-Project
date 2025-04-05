"use client"

import { useEffect, useRef } from "react"

interface ProtocolComparisonProps {
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

export function ProtocolComparison({ isActive, sctpParams }: ProtocolComparisonProps) {
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

    // Draw protocol comparison
    const drawProtocolComparison = () => {
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
      ctx.fillText("Protocol Comparison: TCP vs UDP vs SCTP", canvas.width / 2, 30)

      // Draw protocol lanes
      const laneHeight = 120
      const laneSpacing = 20
      const startY = 60

      // TCP Lane
      drawProtocolLane(startY, laneHeight, "#3b82f6", "TCP", "Transmission Control Protocol", isActive)

      // UDP Lane
      drawProtocolLane(
        startY + laneHeight + laneSpacing,
        laneHeight,
        "#ef4444",
        "UDP",
        "User Datagram Protocol",
        isActive,
      )

      // SCTP Lane
      drawProtocolLane(
        startY + (laneHeight + laneSpacing) * 2,
        laneHeight,
        "#10b981",
        "SCTP",
        "Stream Control Transmission Protocol",
        isActive,
      )

      // Draw comparison table
      drawComparisonTable(startY + (laneHeight + laneSpacing) * 3 + 20)
    }

    const drawProtocolLane = (
      y: number,
      height: number,
      color: string,
      name: string,
      fullName: string,
      animate: boolean,
    ) => {
      const laneWidth = canvas.width - 100
      const startX = 50

      // Lane background
      ctx.fillStyle = `${color}22`
      ctx.fillRect(startX, y, laneWidth, height)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.strokeRect(startX, y, laneWidth, height)

      // Protocol name
      ctx.fillStyle = color
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(name, startX + 10, y + 25)

      // Protocol full name
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.fillText(fullName, startX + 60, y + 25)

      // Draw protocol behavior
      if (animate) {
        switch (name) {
          case "TCP":
            drawTcpBehavior(startX, y, laneWidth, height)
            break
          case "UDP":
            drawUdpBehavior(startX, y, laneWidth, height)
            break
          case "SCTP":
            drawSctpBehavior(startX, y, laneWidth, height)
            break
        }
      }
    }

    const drawTcpBehavior = (x: number, y: number, width: number, height: number) => {
      const time = Date.now() / 1000
      const centerY = y + height / 2

      // Draw sender and receiver
      drawEndpoint(x + 30, centerY, "#3b82f6", "Sender")
      drawEndpoint(x + width - 30, centerY, "#3b82f6", "Receiver")

      // Draw connection line
      ctx.beginPath()
      ctx.moveTo(x + 45, centerY)
      ctx.lineTo(x + width - 45, centerY)
      ctx.strokeStyle = "#3b82f688"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw data packets
      const packetCount = 3
      for (let i = 0; i < packetCount; i++) {
        const offset = (time * 0.3 + i / packetCount) % 1
        const packetX = x + 45 + (width - 90) * offset

        // Packet
        ctx.beginPath()
        ctx.arc(packetX, centerY, 10, 0, Math.PI * 2)
        ctx.fillStyle = "#3b82f6"
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 1
        ctx.stroke()

        // Packet number
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 10px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText((i + 1).toString(), packetX, centerY)
      }

      // Draw ACK packets
      for (let i = 0; i < packetCount; i++) {
        const offset = (time * 0.3 + i / packetCount) % 1
        const ackX = x + width - 45 - (width - 90) * offset

        // Only draw if packet has reached receiver
        const packetX = x + 45 + (width - 90) * offset
        if (packetX > x + width - 60) {
          // ACK packet
          ctx.beginPath()
          ctx.rect(ackX - 8, centerY + 15, 16, 10)
          ctx.fillStyle = "#93c5fd"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()

          // ACK label
          ctx.fillStyle = "#1e3a8a"
          ctx.font = "bold 8px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("ACK", ackX, centerY + 20)
        }
      }

      // TCP characteristics
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Connection-oriented, Reliable, Ordered Delivery", x + width / 2, y + height - 20)
      ctx.fillText("Single Stream, Head-of-Line Blocking", x + width / 2, y + height - 5)
    }

    const drawUdpBehavior = (x: number, y: number, width: number, height: number) => {
      const time = Date.now() / 1000
      const centerY = y + height / 2

      // Draw sender and receiver
      drawEndpoint(x + 30, centerY, "#ef4444", "Sender")
      drawEndpoint(x + width - 30, centerY, "#ef4444", "Receiver")

      // Draw connection line
      ctx.beginPath()
      ctx.moveTo(x + 45, centerY)
      ctx.lineTo(x + width - 45, centerY)
      ctx.strokeStyle = "#ef444488"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw data packets
      const packetCount = 5
      for (let i = 0; i < packetCount; i++) {
        const offset = (time * 0.5 + i / packetCount) % 1
        const packetX = x + 45 + (width - 90) * offset

        // Some packets are lost in UDP
        if (i !== 2) {
          // Skip packet #3 to simulate loss
          // Packet
          ctx.beginPath()
          ctx.arc(packetX, centerY, 10, 0, Math.PI * 2)
          ctx.fillStyle = "#ef4444"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()

          // Packet number
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 10px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText((i + 1).toString(), packetX, centerY)
        } else if (offset < 0.5) {
          // Show lost packet with X
          ctx.beginPath()
          ctx.arc(packetX, centerY, 10, 0, Math.PI * 2)
          ctx.fillStyle = "#ef444466"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(packetX - 5, centerY - 5)
          ctx.lineTo(packetX + 5, centerY + 5)
          ctx.moveTo(packetX + 5, centerY - 5)
          ctx.lineTo(packetX - 5, centerY + 5)
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }

      // UDP characteristics
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Connectionless, Unreliable, Unordered, Fast", x + width / 2, y + height - 20)
      ctx.fillText("Message-oriented, No Flow Control", x + width / 2, y + height - 5)
    }

    const drawSctpBehavior = (x: number, y: number, width: number, height: number) => {
      const time = Date.now() / 1000
      const centerY = y + height / 2

      // Draw sender and receiver
      drawEndpoint(x + 30, centerY, "#10b981", "Sender")
      drawEndpoint(x + width - 30, centerY, "#10b981", "Receiver")

      // Draw multiple streams if enabled
      const streamCount = sctpParams.multiStreamingEnabled ? Math.min(3, sctpParams.streamCount) : 1
      const streamSpacing = 15

      for (let stream = 0; stream < streamCount; stream++) {
        const streamY = centerY - streamSpacing + stream * streamSpacing

        // Stream line
        ctx.beginPath()
        ctx.moveTo(x + 45, streamY)
        ctx.lineTo(x + width - 45, streamY)
        ctx.strokeStyle = "#10b98188"
        ctx.lineWidth = 1
        ctx.stroke()

        // Stream label
        ctx.fillStyle = "#10b981"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(`Stream ${stream + 1}`, x + 50, streamY - 8)

        // Draw data packets on this stream
        const packetCount = 3
        for (let i = 0; i < packetCount; i++) {
          const offset = (time * 0.3 + i / packetCount + stream * 0.2) % 1
          const packetX = x + 45 + (width - 90) * offset

          // Packet
          ctx.beginPath()
          ctx.arc(packetX, streamY, 8, 0, Math.PI * 2)
          ctx.fillStyle = "#10b981"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()

          // Packet number
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 8px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText((i + 1).toString(), packetX, streamY)
        }
      }

      // Draw multi-homing if enabled
      if (sctpParams.multiHomingEnabled) {
        // Secondary path
        const secondaryY = centerY + 25

        ctx.beginPath()
        ctx.moveTo(x + 45, secondaryY)
        ctx.lineTo(x + width - 45, secondaryY)
        ctx.strokeStyle = "#10b98144"
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])

        // Path label
        ctx.fillStyle = "#10b981"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Backup Path", x + width / 2, secondaryY + 10)

        // Heartbeat packets
        if (Math.floor(time) % sctpParams.heartbeatInterval === 0) {
          const heartbeatX = x + 45 + (width - 90) * 0.3

          // Heartbeat packet
          ctx.beginPath()
          ctx.arc(heartbeatX, secondaryY, 6, 0, Math.PI * 2)
          ctx.fillStyle = "#8b5cf6"
          ctx.fill()

          // Heartbeat label
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 6px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("HB", heartbeatX, secondaryY)
        }
      }

      // SCTP characteristics
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"

      let features = "Connection-oriented, Configurable Reliability"
      if (sctpParams.multiStreamingEnabled) features += ", Multi-streaming"
      if (sctpParams.multiHomingEnabled) features += ", Multi-homing"

      ctx.fillText(features, x + width / 2, y + height - 20)
      ctx.fillText("Message-oriented, No Head-of-Line Blocking", x + width / 2, y + height - 5)
    }

    const drawEndpoint = (x: number, y: number, color: string, label: string) => {
      // Endpoint circle
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      // Endpoint label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label[0], x, y)

      // Full label below
      ctx.fillStyle = "#1f2937"
      ctx.font = "10px sans-serif"
      ctx.fillText(label, x, y + 25)
    }

    const drawComparisonTable = (y: number) => {
      const tableWidth = canvas.width - 100
      const startX = 50
      const rowHeight = 30
      const colWidth = tableWidth / 4

      // Table header
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(startX, y, tableWidth, rowHeight)

      // Header text
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.fillText("Feature", startX + colWidth / 2, y + rowHeight / 2)
      ctx.fillText("TCP", startX + colWidth * 1.5, y + rowHeight / 2)
      ctx.fillText("UDP", startX + colWidth * 2.5, y + rowHeight / 2)
      ctx.fillText("SCTP", startX + colWidth * 3.5, y + rowHeight / 2)

      // Table grid
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1

      // Vertical lines
      for (let i = 0; i <= 4; i++) {
        ctx.beginPath()
        ctx.moveTo(startX + colWidth * i, y)
        ctx.lineTo(startX + colWidth * i, y + rowHeight * 6)
        ctx.stroke()
      }

      // Horizontal lines
      for (let i = 0; i <= 6; i++) {
        ctx.beginPath()
        ctx.moveTo(startX, y + rowHeight * i)
        ctx.lineTo(startX + tableWidth, y + rowHeight * i)
        ctx.stroke()
      }

      // Table content
      const features = ["Connection", "Reliability", "Ordering", "Multi-streaming", "Multi-homing"]

      // Adjust SCTP values based on parameters
      const sctpReliability = [
        "Unreliable",
        "Partially Reliable",
        "Timed Reliability",
        "Semi-Reliable",
        "Fully Reliable",
      ][sctpParams.reliabilityLevel]
      const sctpOrdering = sctpParams.orderedDelivery ? "Configurable order" : "Unordered"
      const sctpMultiStreaming = sctpParams.multiStreamingEnabled ? "Yes" : "No (disabled)"
      const sctpMultiHoming = sctpParams.multiHomingEnabled ? "Yes" : "No (disabled)"

      const values = [
        ["Connection-oriented", "Connectionless", "Connection-oriented"],
        ["Reliable", "Unreliable", sctpReliability],
        ["Strict order", "No order", sctpOrdering],
        ["No", "No", sctpMultiStreaming],
        ["No", "No", sctpMultiHoming],
      ]

      // Fill table
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      for (let row = 0; row < features.length; row++) {
        // Feature name
        ctx.fillStyle = "#1f2937"
        ctx.fillText(features[row], startX + colWidth / 2, y + rowHeight * (row + 1) + rowHeight / 2)

        // TCP value
        ctx.fillStyle = values[row][0].includes("No") ? "#ef4444" : "#3b82f6"
        ctx.fillText(values[row][0], startX + colWidth * 1.5, y + rowHeight * (row + 1) + rowHeight / 2)

        // UDP value
        ctx.fillStyle = values[row][1].includes("No") || values[row][1].includes("Unreliable") ? "#ef4444" : "#3b82f6"
        ctx.fillText(values[row][1], startX + colWidth * 2.5, y + rowHeight * (row + 1) + rowHeight / 2)

        // SCTP value
        ctx.fillStyle = values[row][2].includes("No") ? "#ef4444" : "#10b981"
        ctx.fillText(values[row][2], startX + colWidth * 3.5, y + rowHeight * (row + 1) + rowHeight / 2)
      }
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawProtocolComparison()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawProtocolComparison()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, sctpParams])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

