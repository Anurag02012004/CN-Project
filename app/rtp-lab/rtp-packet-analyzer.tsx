"use client"

import { useEffect, useRef, useState } from "react"

interface RtpPacketAnalyzerProps {
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

export function RtpPacketAnalyzer({ isActive, rtpParams }: RtpPacketAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedField, setSelectedField] = useState<string | null>(null)

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

    // RTP packet structure
    const rtpFields = [
      { name: "V.", bits: 2, color: "#3b82f6", description: "RTP version (2)" },
      { name: "P.", bits: 1, color: "#8b5cf6", description: "Padding bit" },
      { name: "E.", bits: 1, color: "#8b5cf6", description: "Extension bit" },
      { name: "C.C.", bits: 4, color: "#8b5cf6", description: "Contributing source count" },
      { name: "M", bits: 1, color: "#ef4444", description: "Marker bit" },
      { name: "P.", bits: 7, color: "#ef4444", description: "Format of the RTP payload" },
      {
        name: "S.",
        bits: 16,
        color: "#10b981",
        description: "Increments by one for each RTP packet sent",
      },
      {
        name: "T.",
        bits: 32,
        color: "#f59e0b",
        description: "Sampling instant of the first octet in the RTP data packet",
      },
      { name: "SSRC", bits: 32, color: "#ec4899", description: "Synchronization source identifier" },
      { name: "CSRC", bits: 32, color: "#6366f1", description: "Contributing source identifiers (optional)" },
      { name: "E.H.", bits: 32, color: "#6366f1", description: "Extension header (optional)" },
      { name: "Payload", bits: 64, color: "#0ea5e9", description: "RTP payload data" },
    ]

    // Add SRTP fields if security is enabled
    if (rtpParams.securityEnabled) {
      rtpFields.push(
        { name: "A.T.", bits: 32, color: "#14b8a6", description: "Authentication tag for integrity protection" },
        { name: "MKI", bits: 16, color: "#14b8a6", description: "Master Key Identifier (optional)" },
      )
    }

    // Calculate total bits
    const totalBits = rtpFields.reduce((sum, field) => sum + field.bits, 0)

    // Define these variables outside both functions so they're accessible to both
    const fieldHeight = 40
    const startY = 60

    // Draw RTP packet structure
    const drawRtpPacket = () => {
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
      ctx.fillText(rtpParams.securityEnabled ? "SRTP Packet Structure" : "RTP Packet Structure", canvas.width / 2, 30)

      // Draw packet fields
      const bitWidth = (canvas.width - 100) / totalBits

      let currentX = 50
      let currentBit = 0

      for (let i = 0; i < rtpFields.length; i++) {
        const field = rtpFields[i]
        const fieldWidth = field.bits * bitWidth

        // Draw field rectangle
        const isSelected = selectedField === field.name

        // Field background
        ctx.fillStyle = isSelected ? `${field.color}` : `${field.color}88`
        ctx.fillRect(currentX, startY, fieldWidth, fieldHeight)

        // Field border
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.strokeRect(currentX, startY, fieldWidth, fieldHeight)

        // Field name
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(field.name, currentX + fieldWidth / 2, startY + fieldHeight / 2)

        // Bit count
        ctx.fillStyle = "#1f2937"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`${field.bits} bits`, currentX + fieldWidth / 2, startY + fieldHeight + 15)

        // Bit positions
        ctx.fillStyle = "#6b7280"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`${currentBit}`, currentX, startY - 5)

        currentX += fieldWidth
        currentBit += field.bits
      }

      // Draw last bit position
      ctx.fillStyle = "#6b7280"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${currentBit}`, currentX, startY - 5)

      // Draw field description if selected
      if (selectedField) {
        const field = rtpFields.find((f) => f.name === selectedField)
        if (field) {
          const descY = startY + fieldHeight + 40

          ctx.fillStyle = field.color
          ctx.font = "bold 16px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(field.name, canvas.width / 2, descY)

          ctx.fillStyle = "#1f2937"
          ctx.font = "14px sans-serif"
          ctx.fillText(field.description, canvas.width / 2, descY + 25)

          // Draw animated packet flow
          if (isActive) {
            drawPacketFlow(field)
          }
        }
      }

      // Draw codec information
      drawCodecInfo()

      // Draw field selection instructions
      ctx.fillStyle = "#6b7280"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Click on a field to see details", canvas.width / 2, canvas.height - 20)
    }

    // Draw animated packet flow
    const drawPacketFlow = (field) => {
      const flowY = startY + fieldHeight + 80
      const flowHeight = 100

      // Draw flow line
      ctx.beginPath()
      ctx.moveTo(50, flowY + flowHeight / 2)
      ctx.lineTo(canvas.width - 50, flowY + flowHeight / 2)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw source and destination
      ctx.beginPath()
      ctx.arc(50, flowY + flowHeight / 2, 15, 0, Math.PI * 2)
      ctx.fillStyle = "#6366f1"
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Src", 50, flowY + flowHeight / 2)

      ctx.beginPath()
      ctx.arc(canvas.width - 50, flowY + flowHeight / 2, 15, 0, Math.PI * 2)
      ctx.fillStyle = "#6366f1"
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Dst", canvas.width - 50, flowY + flowHeight / 2)

      // Draw packets with highlighted field
      const packetTime = Date.now() / 1000
      for (let i = 0; i < 3; i++) {
        const offset = (packetTime + i) % 3
        const packetX = 80 + ((canvas.width - 160) * offset) / 3

        // Packet rectangle
        ctx.fillStyle = "#f3f4f6"
        ctx.fillRect(packetX - 25, flowY, 50, flowHeight)
        ctx.strokeStyle = "#9ca3af"
        ctx.lineWidth = 1
        ctx.strokeRect(packetX - 25, flowY, 50, flowHeight)

        // Highlight the selected field
        const fieldY = flowY + 10 + rtpFields.findIndex((f) => f.name === field.name) * 8
        ctx.fillStyle = field.color
        ctx.fillRect(packetX - 20, fieldY, 40, 6)

        // Field value (simulated)
        let value = ""
        switch (field.name) {
          case "Version":
            value = "2"
            break
          case "Sequence Number":
            value = (1000 + i).toString()
            break
          case "Timestamp":
            value = (Date.now() + i * 1000).toString().slice(-8)
            break
          case "SSRC":
            value = "0x12345678"
            break
          case "Payload Type":
            value = getPayloadTypeValue()
            break
          default:
            value = "..."
            break
        }

        ctx.fillStyle = "#1f2937"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(value, packetX, fieldY + 20)
      }
    }

    const getPayloadTypeValue = () => {
      switch (rtpParams.codecType) {
        case "opus":
          return "111"
        case "h264":
          return "96"
        case "vp8":
          return "97"
        default:
          return "0"
      }
    }

    const drawCodecInfo = () => {
      const infoY = canvas.height - 80
      const infoWidth = canvas.width - 100
      const infoHeight = 50
      const infoX = canvas.width / 2

      // Info box
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(infoX - infoWidth / 2, infoY, infoWidth, infoHeight)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(infoX - infoWidth / 2, infoY, infoWidth, infoHeight)

      // Codec title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Codec Information", infoX, infoY + 15)

      // Codec details
      let codecDetails = ""
      switch (rtpParams.codecType) {
        case "opus":
          codecDetails = "Opus: Audio codec (48kHz, stereo) - Payload Type: 111"
          break
        case "h264":
          codecDetails = "H.264: Video codec (AVC) - Payload Type: 96"
          break
        case "vp8":
          codecDetails = "VP8: Video codec (WebM) - Payload Type: 97"
          break
      }

      ctx.fillStyle = "#6b7280"
      ctx.font = "12px sans-serif"
      ctx.fillText(codecDetails, infoX, infoY + 35)
    }

    // Handle click events to select fields
    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (y >= startY && y <= startY + fieldHeight) {
        const bitWidth = (canvas.width - 100) / totalBits
        let currentX = 50

        for (const field of rtpFields) {
          const fieldWidth = field.bits * bitWidth
          if (x >= currentX && x <= currentX + fieldWidth) {
            setSelectedField(field.name === selectedField ? null : field.name)
            break
          }
          currentX += fieldWidth
        }
      }
    }

    canvas.addEventListener("click", handleCanvasClick)

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawRtpPacket()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawRtpPacket()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("click", handleCanvasClick)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, rtpParams, selectedField])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

