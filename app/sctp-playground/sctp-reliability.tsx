"use client"

import { useEffect, useRef } from "react"

interface SctpReliabilityProps {
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

export function SctpReliability({ isActive, sctpParams }: SctpReliabilityProps) {
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

    // Draw SCTP reliability visualization
    const drawSctpReliability = () => {
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
      ctx.fillText("SCTP Reliability Mechanisms", canvas.width / 2, 30)

      // Draw reliability spectrum
      drawReliabilitySpectrum()

      // Draw reliability demonstration
      drawReliabilityDemo()

      // Draw explanation
      drawExplanation()
    }

    const drawReliabilitySpectrum = () => {
      const startY = 60
      const height = 100
      const width = canvas.width - 100
      const x = canvas.width / 2

      // Section title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Protocol Reliability Spectrum", x, startY - 10)

      // Draw spectrum bar
      const barHeight = 30
      const barY = startY + height / 2

      // Spectrum background
      const gradient = ctx.createLinearGradient(x - width / 2, 0, x + width / 2, 0)
      gradient.addColorStop(0, "#ef4444") // Red (unreliable)
      gradient.addColorStop(0.5, "#f59e0b") // Yellow (partial)
      gradient.addColorStop(1, "#10b981") // Green (reliable)

      ctx.fillStyle = gradient
      ctx.fillRect(x - width / 2, barY - barHeight / 2, width, barHeight)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(x - width / 2, barY - barHeight / 2, width, barHeight)

      // Protocol markers
      const protocols = [
        { name: "UDP", position: 0.1, color: "#ef4444" },
        { name: "SCTP (Partial)", position: 0.5, color: "#f59e0b" },
        { name: "TCP", position: 0.9, color: "#10b981" },
        { name: "SCTP (Full)", position: 0.99, color: "#10b981" },
      ]

      for (const protocol of protocols) {
        const markerX = x - width / 2 + width * protocol.position

        // Marker line
        ctx.beginPath()
        ctx.moveTo(markerX, barY - barHeight / 2 - 5)
        ctx.lineTo(markerX, barY + barHeight / 2 + 5)
        ctx.strokeStyle = protocol.color
        ctx.lineWidth = 2
        ctx.stroke()

        // Protocol name
        ctx.fillStyle = protocol.color
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(protocol.name, markerX, barY + barHeight / 2 + 20)
      }

      // Current SCTP reliability level marker
      const reliabilityPosition = sctpParams.reliabilityLevel / 4
      const currentX = x - width / 2 + width * reliabilityPosition

      // Marker triangle
      ctx.beginPath()
      ctx.moveTo(currentX, barY - barHeight / 2 - 15)
      ctx.lineTo(currentX - 10, barY - barHeight / 2 - 5)
      ctx.lineTo(currentX + 10, barY - barHeight / 2 - 5)
      ctx.closePath()
      ctx.fillStyle = "#8b5cf6"
      ctx.fill()

      // Current level label
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Current Level: ${sctpParams.reliabilityLevel}`, currentX, barY - barHeight / 2 - 25)

      // Reliability labels
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Unreliable", x - width / 2, barY - barHeight / 2 - 10)

      ctx.textAlign = "right"
      ctx.fillText("Fully Reliable", x + width / 2, barY - barHeight / 2 - 10)
    }

    const drawReliabilityDemo = () => {
      const startY = 200
      const height = 200
      const width = canvas.width - 100
      const x = canvas.width / 2

      // Section title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Reliability Demonstration", x, startY - 10)

      // Draw sender and receiver
      const senderX = x - width / 2 + 50
      const receiverX = x + width / 2 - 50
      const centerY = startY + height / 2

      // Sender
      drawEndpoint(senderX, centerY, "Sender")

      // Receiver
      drawEndpoint(receiverX, centerY, "Receiver")

      // Connection line
      ctx.beginPath()
      ctx.moveTo(senderX + 30, centerY)
      ctx.lineTo(receiverX - 30, centerY)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw packets
      if (isActive) {
        drawPacketFlow(senderX, receiverX, centerY)
      }

      // Reliability mode label
      let reliabilityMode = ""
      switch (sctpParams.reliabilityLevel) {
        case 0:
          reliabilityMode = "Unreliable (No Retransmission)"
          break
        case 1:
          reliabilityMode = "Partially Reliable (Limited Retransmissions)"
          break
        case 2:
          reliabilityMode = "Timed Reliability (Time-Limited Retransmissions)"
          break
        case 3:
          reliabilityMode = "Semi-Reliable (Extended Retransmissions)"
          break
        case 4:
          reliabilityMode = "Fully Reliable (Guaranteed Delivery)"
          break
      }

      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(reliabilityMode, x, startY + height - 20)
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

    const drawPacketFlow = (senderX: number, receiverX: number, centerY: number) => {
      const time = Date.now() / 1000
      const packetCount = 5

      // Calculate max retransmissions based on reliability level
      const maxRetransmissions = sctpParams.reliabilityLevel * 2

      for (let i = 0; i < packetCount; i++) {
        const baseOffset = (time * 0.3 + i / packetCount) % 1
        const packetX = senderX + 30 + (receiverX - senderX - 60) * baseOffset

        // Determine if packet is lost
        const isLost = Math.random() * 100 < sctpParams.packetLoss

        if (isLost) {
          // Draw lost packet
          ctx.beginPath()
          ctx.arc(packetX, centerY, 10, 0, Math.PI * 2)
          ctx.fillStyle = "#ef444466"
          ctx.fill()
          ctx.strokeStyle = "#ef4444"
          ctx.lineWidth = 2
          ctx.stroke()

          // X mark
          ctx.beginPath()
          ctx.moveTo(packetX - 5, centerY - 5)
          ctx.lineTo(packetX + 5, centerY + 5)
          ctx.moveTo(packetX + 5, centerY - 5)
          ctx.lineTo(packetX - 5, centerY + 5)
          ctx.strokeStyle = "#ef4444"
          ctx.lineWidth = 2
          ctx.stroke()

          // Draw retransmissions based on reliability level
          if (sctpParams.reliabilityLevel > 0) {
            const retransmissionCount = Math.min(3, maxRetransmissions)

            for (let j = 0; j < retransmissionCount; j++) {
              // Retransmission offset (starts from packet loss position)
              const retransOffset = baseOffset - 0.1 + (j + 1) * 0.05

              if (retransOffset > 0 && retransOffset < 1) {
                const retransX = senderX + 30 + (receiverX - senderX - 60) * retransOffset
                const retransY = centerY - 15 + j * 10

                // Retransmission packet
                ctx.beginPath()
                ctx.arc(retransX, retransY, 8, 0, Math.PI * 2)
                ctx.fillStyle = "#8b5cf6"
                ctx.fill()

                // Retransmission label
                ctx.fillStyle = "#ffffff"
                ctx.font = "bold 8px sans-serif"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText("R" + (j + 1), retransX, retransY)

                // Connection to original packet
                ctx.beginPath()
                ctx.moveTo(packetX, centerY)
                ctx.lineTo(retransX, retransY)
                ctx.strokeStyle = "#8b5cf688"
                ctx.lineWidth = 1
                ctx.stroke()
              }
            }
          }
        } else {
          // Draw normal packet
          ctx.beginPath()
          ctx.arc(packetX, centerY, 10, 0, Math.PI * 2)
          ctx.fillStyle = "#10b981"
          ctx.fill()

          // Packet number
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 10px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText((i + 1).toString(), packetX, centerY)

          // Draw acknowledgment if packet reached more than halfway
          if (baseOffset > 0.5) {
            const ackOffset = 1 - baseOffset + 0.1
            const ackX = receiverX - 30 - (receiverX - senderX - 60) * ackOffset

            // ACK packet
            ctx.beginPath()
            ctx.rect(ackX - 8, centerY + 15, 16, 10)
            ctx.fillStyle = "#3b82f6"
            ctx.fill()

            // ACK label
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 8px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("ACK", ackX, centerY + 20)
          }
        }
      }

      // Draw reliability indicator
      let deliveryRate = 100 - sctpParams.packetLoss

      // Adjust delivery rate based on reliability level
      if (sctpParams.reliabilityLevel > 0) {
        // Each reliability level recovers a portion of the packet loss
        const recoveryFactor = sctpParams.reliabilityLevel / 4
        deliveryRate += sctpParams.packetLoss * recoveryFactor
        deliveryRate = Math.min(100, deliveryRate)
      }

      ctx.fillStyle = deliveryRate > 90 ? "#10b981" : deliveryRate > 70 ? "#f59e0b" : "#ef4444"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Delivery Rate: ${deliveryRate.toFixed(1)}%`, canvas.width / 2, centerY - 50)
    }

    const drawExplanation = () => {
      const startY = 430

      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"

      let explanationText = ""
      let detailText = ""

      switch (sctpParams.reliabilityLevel) {
        case 0:
          explanationText = "Unreliable mode: Packets are sent once with no retransmission attempts"
          detailText = "Similar to UDP, provides no delivery guarantees but has minimal overhead"
          break
        case 1:
          explanationText = "Partially Reliable: Limited number of retransmission attempts"
          detailText = "Balances reliability and overhead for time-sensitive applications"
          break
        case 2:
          explanationText = "Timed Reliability: Retransmissions continue until a time limit is reached"
          detailText = "Useful for data with expiration times, like real-time media"
          break
        case 3:
          explanationText = "Semi-Reliable: Extended retransmissions with higher persistence"
          detailText = "Good for important data that can tolerate some delay"
          break
        case 4:
          explanationText = "Fully Reliable: Guaranteed delivery with unlimited retransmissions"
          detailText = "Similar to TCP, ensures all data arrives but with higher overhead"
          break
      }

      ctx.fillText(explanationText, canvas.width / 2, startY)
      ctx.fillText(detailText, canvas.width / 2, startY + 20)

      // // Additional SCTP reliability features
      // ctx.fillStyle = "#10b981"
      // ctx.font = "bold 14px sans-serif"
      // ctx.fillText("SCTP Reliability Features", canvas.width / 2, startY + 50)

      // const features = [
      //   "Configurable reliability levels per message",
      //   "Heartbeat mechanism for path monitoring",
      //   "Selective acknowledgments for efficient recovery",
      //   "Message-oriented delivery preserves boundaries",
      // ]

      // ctx.fillStyle = "#1f2937"
      // ctx.font = "12px sans-serif"

      // for (let i = 0; i < features.length; i++) {
      //   ctx.fillText(features[i], canvas.width / 2, startY + 70 + i * 16)
      // }
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawSctpReliability()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawSctpReliability()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, sctpParams])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

