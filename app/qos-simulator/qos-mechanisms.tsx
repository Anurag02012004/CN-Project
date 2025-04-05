"use client"

import { useEffect, useRef } from "react"

interface QoSMechanismsProps {
  isActive: boolean
  networkParams: {
    bandwidth: number
    latency: number
    jitter: number
    packetLoss: number
    priorityQueue: boolean
    networkType: string
    qosEnabled: boolean
    trafficShaping: string
    congestionAvoidance: string
    bufferSize: number
  }
}

export function QoSMechanisms({ isActive, networkParams }: QoSMechanismsProps) {
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

    // Draw QoS mechanisms
    const drawQoSMechanisms = () => {
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
      ctx.fillText("QoS Mechanisms Visualization", canvas.width / 2, 30)

      // Draw based on selected mechanism
      if (networkParams.trafficShaping !== "none") {
        drawTrafficShaping(networkParams.trafficShaping)
      } else if (networkParams.congestionAvoidance !== "none") {
        drawCongestionAvoidance(networkParams.congestionAvoidance)
      } else if (networkParams.priorityQueue) {
        drawPriorityQueue()
      } else {
        drawBasicQoS()
      }
    }

    const drawTrafficShaping = (type: string) => {
      const centerY = canvas.height / 2
      const startX = 100
      const endX = canvas.width - 100
      const bucketWidth = 120
      const bucketHeight = 160
      const bucketX = canvas.width / 2 - bucketWidth / 2
      const bucketY = centerY - bucketHeight / 2

      // Draw title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(
        type === "token" ? "Token Bucket Traffic Shaping" : "Leaky Bucket Traffic Shaping",
        canvas.width / 2,
        60,
      )

      // Draw bucket
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(bucketX, bucketY, bucketWidth, bucketHeight)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 2
      ctx.strokeRect(bucketX, bucketY, bucketWidth, bucketHeight)

      // Draw water level based on buffer size
      const waterHeight = (bucketHeight * networkParams.bufferSize) / 100
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(bucketX, bucketY + bucketHeight - waterHeight, bucketWidth, waterHeight)

      // Draw input flow
      ctx.beginPath()
      ctx.moveTo(startX, centerY - 50)
      ctx.lineTo(bucketX, centerY - 50)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw output flow
      ctx.beginPath()
      ctx.moveTo(bucketX + bucketWidth, centerY + 50)
      ctx.lineTo(endX, centerY + 50)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw packets
      if (isActive) {
        const time = Date.now() / 1000

        // Input packets (faster)
        for (let i = 0; i < 3; i++) {
          const offset = (time * 0.5 + i / 3) % 1
          const x = startX + (bucketX - startX) * offset

          ctx.beginPath()
          ctx.arc(x, centerY - 50, 8, 0, Math.PI * 2)
          ctx.fillStyle = "#ef4444"
          ctx.fill()
        }

        // Output packets (controlled rate)
        for (let i = 0; i < 2; i++) {
          const offset = (time * 0.3 + i / 2) % 1
          const x = bucketX + bucketWidth + (endX - bucketX - bucketWidth) * offset

          ctx.beginPath()
          ctx.arc(x, centerY + 50, 8, 0, Math.PI * 2)
          ctx.fillStyle = "#10b981"
          ctx.fill()
        }

        // For token bucket, draw tokens
        if (type === "token") {
          for (let i = 0; i < 3; i++) {
            const angle = time * 2 + i * ((Math.PI * 2) / 3)
            const radius = 30
            const x = bucketX + bucketWidth / 2 + Math.cos(angle) * radius
            const y = bucketY + bucketHeight / 2 + Math.sin(angle) * radius

            ctx.beginPath()
            ctx.arc(x, y, 6, 0, Math.PI * 2)
            ctx.fillStyle = "#f59e0b"
            ctx.fill()
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 1
            ctx.stroke()

            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 8px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("T", x, y)
          }
        }
      }

      // Draw explanation
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"

      if (type === "token") {
        ctx.fillText(
          "Token bucket allows bursts of traffic up to the bucket size",
          canvas.width / 2,
          centerY + bucketHeight / 2 + 60,
        )
        ctx.fillText(
          "Packets can only be sent when tokens are available",
          canvas.width / 2,
          centerY + bucketHeight / 2 + 80,
        )
      } else {
        ctx.fillText(
          "Leaky bucket enforces a constant output rate regardless of input rate",
          canvas.width / 2,
          centerY + bucketHeight / 2 + 60,
        )
        ctx.fillText(
          "Excess packets are buffered or dropped if the bucket overflows",
          canvas.width / 2,
          centerY + bucketHeight / 2 + 80,
        )
      }
    }

    const drawCongestionAvoidance = (type: string) => {
      const centerY = canvas.height / 2
      const queueX = 150
      const queueWidth = canvas.width - 300
      const queueHeight = 80
      const queueY = centerY - queueHeight / 2

      // Draw title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${type.toUpperCase()} Congestion Avoidance`, canvas.width / 2, 60)

      // Draw queue
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(queueX, queueY, queueWidth, queueHeight)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 2
      ctx.strokeRect(queueX, queueY, queueWidth, queueHeight)

      // Draw queue fill level
      const fillWidth = (queueWidth * networkParams.bufferSize) / 100

      // Different colors for different mechanisms
      let fillColor = "#3b82f6"
      switch (type) {
        case "red":
          fillColor = "#ef4444"
          break
        case "ecn":
          fillColor = "#8b5cf6"
          break
        case "codel":
          fillColor = "#f59e0b"
          break
      }

      ctx.fillStyle = fillColor
      ctx.fillRect(queueX, queueY, fillWidth, queueHeight)

      // Draw thresholds for RED
      if (type === "red") {
        const minThreshold = queueX + queueWidth * 0.3
        const maxThreshold = queueX + queueWidth * 0.7

        ctx.beginPath()
        ctx.moveTo(minThreshold, queueY - 10)
        ctx.lineTo(minThreshold, queueY + queueHeight + 10)
        ctx.strokeStyle = "#10b981"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(maxThreshold, queueY - 10)
        ctx.lineTo(maxThreshold, queueY + queueHeight + 10)
        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Min Threshold", minThreshold, queueY - 20)
        ctx.fillText("Max Threshold", maxThreshold, queueY - 20)
      }

      // Draw packets
      if (isActive) {
        const time = Date.now() / 1000
        const packetCount = 10

        for (let i = 0; i < packetCount; i++) {
          const offset = (time * 0.2 + i / packetCount) % 1
          const x = queueX + queueWidth * offset

          // Skip some packets based on congestion avoidance algorithm
          let drawPacket = true

          if (type === "red") {
            // RED drops packets probabilistically between min and max thresholds
            const minThreshold = queueX + queueWidth * 0.3
            const maxThreshold = queueX + queueWidth * 0.7

            if (x > minThreshold && x < maxThreshold) {
              // Probabilistic drop
              drawPacket = Math.random() > ((x - minThreshold) / (maxThreshold - minThreshold)) * 0.7
            } else if (x > maxThreshold) {
              // Drop all packets beyond max threshold
              drawPacket = false
            }
          } else if (type === "ecn") {
            // ECN marks packets instead of dropping
            drawPacket = true
          } else if (type === "codel") {
            // CoDel drops packets based on sojourn time
            drawPacket = Math.random() > 0.3
          }

          if (drawPacket) {
            ctx.beginPath()
            ctx.arc(x, centerY, 8, 0, Math.PI * 2)

            if (type === "ecn" && x > queueX + queueWidth * 0.6) {
              // Mark ECN packets
              ctx.fillStyle = "#8b5cf6"
              ctx.fill()
              ctx.strokeStyle = "#ffffff"
              ctx.lineWidth = 1
              ctx.stroke()

              // ECN mark
              ctx.fillStyle = "#ffffff"
              ctx.font = "bold 8px sans-serif"
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillText("E", x, centerY)
            } else {
              ctx.fillStyle = "#10b981"
              ctx.fill()
            }
          } else {
            // Draw dropped packet with X
            ctx.beginPath()
            ctx.arc(x, centerY, 8, 0, Math.PI * 2)
            ctx.fillStyle = "#ef444466"
            ctx.fill()

            ctx.beginPath()
            ctx.moveTo(x - 4, centerY - 4)
            ctx.lineTo(x + 4, centerY + 4)
            ctx.moveTo(x + 4, centerY - 4)
            ctx.lineTo(x - 4, centerY + 4)
            ctx.strokeStyle = "#ffffff"
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // Draw explanation
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"

      if (type === "red") {
        ctx.fillText(
          "Random Early Detection (RED) drops packets probabilistically",
          canvas.width / 2,
          centerY + queueHeight / 2 + 60,
        )
        ctx.fillText(
          "as the queue fills up, preventing congestion collapse",
          canvas.width / 2,
          centerY + queueHeight / 2 + 80,
        )
      } else if (type === "ecn") {
        ctx.fillText(
          "Explicit Congestion Notification (ECN) marks packets instead of dropping them",
          canvas.width / 2,
          centerY + queueHeight / 2 + 60,
        )
        ctx.fillText(
          "allowing endpoints to reduce their sending rate before packet loss occurs",
          canvas.width / 2,
          centerY + queueHeight / 2 + 80,
        )
      } else if (type === "codel") {
        ctx.fillText(
          "Controlled Delay (CoDel) targets buffer bloat by dropping packets",
          canvas.width / 2,
          centerY + queueHeight / 2 + 60,
        )
        ctx.fillText(
          "based on how long they've been in the queue, not just queue length",
          canvas.width / 2,
          centerY + queueHeight / 2 + 80,
        )
      }
    }

    const drawPriorityQueue = () => {
      const centerY = canvas.height / 2
      const queueX = 150
      const queueWidth = canvas.width - 300
      const queueHeight = 180
      const queueY = centerY - queueHeight / 2
      const laneHeight = queueHeight / 3

      // Draw title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Priority Queuing", canvas.width / 2, 60)

      // Draw queue lanes
      const laneColors = ["#3b82f6", "#8b5cf6", "#10b981"]
      const laneLabels = ["High Priority (VoIP)", "Medium Priority (Video)", "Low Priority (Data)"]

      for (let i = 0; i < 3; i++) {
        const laneY = queueY + i * laneHeight

        // Lane background
        ctx.fillStyle = `${laneColors[i]}22`
        ctx.fillRect(queueX, laneY, queueWidth, laneHeight)
        ctx.strokeStyle = laneColors[i]
        ctx.lineWidth = 2
        ctx.strokeRect(queueX, laneY, queueWidth, laneHeight)

        // Lane label
        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(laneLabels[i], queueX - 10, laneY + laneHeight / 2)
      }

      // Draw packets
      if (isActive) {
        const time = Date.now() / 1000

        // High priority packets (processed first)
        for (let i = 0; i < 3; i++) {
          const offset = (time * 0.5 + i / 3) % 1
          const x = queueX + queueWidth * offset
          const y = queueY + laneHeight / 2

          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fillStyle = "#3b82f6"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 8px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("H", x, y)
        }

        // Medium priority packets (processed second)
        for (let i = 0; i < 4; i++) {
          const offset = (time * 0.3 + i / 4) % 1
          const x = queueX + queueWidth * offset
          const y = queueY + laneHeight * 1.5

          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fillStyle = "#8b5cf6"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 8px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("M", x, y)
        }

        // Low priority packets (processed last)
        for (let i = 0; i < 5; i++) {
          const offset = (time * 0.15 + i / 5) % 1
          const x = queueX + queueWidth * offset
          const y = queueY + laneHeight * 2.5

          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fillStyle = "#10b981"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 8px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("L", x, y)
        }
      }

      // Draw explanation
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(
        "Priority Queuing processes high priority traffic first",
        canvas.width / 2,
        queueY + queueHeight + 30,
      )
      ctx.fillText(
        "ensuring critical applications like VoIP get preferential treatment",
        canvas.width / 2,
        queueY + queueHeight + 50,
      )
    }

    const drawBasicQoS = () => {
      const centerY = canvas.height / 2

      // Draw title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Basic QoS Concepts", canvas.width / 2, 60)

      // Draw QoS components
      const components = [
        { name: "Classification", description: "Identifies traffic types", x: canvas.width * 0.25, y: centerY - 80 },
        { name: "Marking", description: "Tags packets with priority", x: canvas.width * 0.5, y: centerY - 80 },
        { name: "Queuing", description: "Buffers packets based on priority", x: canvas.width * 0.75, y: centerY - 80 },
        { name: "Scheduling", description: "Determines transmission order", x: canvas.width * 0.25, y: centerY + 80 },
        { name: "Policing", description: "Enforces bandwidth limits", x: canvas.width * 0.5, y: centerY + 80 },
        { name: "Shaping", description: "Controls traffic flow rate", x: canvas.width * 0.75, y: centerY + 80 },
      ]

      for (const component of components) {
        // Component circle
        ctx.beginPath()
        ctx.arc(component.x, component.y, 40, 0, Math.PI * 2)
        ctx.fillStyle = "#3b82f6"
        ctx.fill()
        ctx.strokeStyle = "#1d4ed8"
        ctx.lineWidth = 2
        ctx.stroke()

        // Component name
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(component.name, component.x, component.y)

        // Component description
        ctx.fillStyle = "#1f2937"
        ctx.font = "12px sans-serif"
        ctx.fillText(component.description, component.x, component.y + 50)
      }

      // Draw connections
      ctx.beginPath()
      ctx.moveTo(components[0].x + 30, components[0].y - 30)
      ctx.lineTo(components[1].x - 30, components[1].y - 30)
      ctx.moveTo(components[1].x + 30, components[1].y - 30)
      ctx.lineTo(components[2].x - 30, components[2].y - 30)
      ctx.moveTo(components[2].x, components[2].y + 30)
      ctx.lineTo(components[5].x, components[5].y - 30)
      ctx.moveTo(components[5].x - 30, components[5].y + 30)
      ctx.lineTo(components[4].x + 30, components[4].y + 30)
      ctx.moveTo(components[4].x - 30, components[4].y + 30)
      ctx.lineTo(components[3].x + 30, components[3].y + 30)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw arrows on connections
      drawArrow(components[0].x + 30, components[0].y - 30, components[1].x - 30, components[1].y - 30)
      drawArrow(components[1].x + 30, components[1].y - 30, components[2].x - 30, components[2].y - 30)
      drawArrow(components[2].x, components[2].y + 30, components[5].x, components[5].y - 30)
      drawArrow(components[5].x - 30, components[5].y + 30, components[4].x + 30, components[4].y + 30)
      drawArrow(components[4].x - 30, components[4].y + 30, components[3].x + 30, components[3].y + 30)
    }

    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number) => {
      const headLength = 10
      const dx = toX - fromX
      const dy = toY - fromY
      const angle = Math.atan2(dy, dx)

      ctx.beginPath()
      ctx.moveTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
      ctx.lineTo(toX, toY)
      ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawQoSMechanisms()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawQoSMechanisms()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive, networkParams])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

