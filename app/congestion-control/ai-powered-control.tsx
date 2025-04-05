"use client"

import { useEffect, useRef } from "react"

interface AiPoweredControlProps {
  isActive: boolean
}

export function AiPoweredControl({ isActive }: AiPoweredControlProps) {
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

    // Draw AI-powered congestion control
    const drawAiPoweredControl = () => {
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
      ctx.fillText("AI-Powered Congestion Control", canvas.width / 2, 30)

      // Draw network diagram
      drawNetworkDiagram()

      // Draw AI model
      drawAiModel()

      // Draw performance comparison
      drawPerformanceComparison()
    }

    const drawNetworkDiagram = () => {
      const startY = 70
      const height = 150

      // Network title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Network Environment", canvas.width / 2, startY - 10)

      // Draw sender and receiver
      const senderX = 100
      const receiverX = canvas.width - 100
      const centerY = startY + height / 2

      // Sender
      drawEndpoint(senderX, centerY, "#3b82f6", "Sender")

      // Receiver
      drawEndpoint(receiverX, centerY, "#10b981", "Receiver")

      // Network cloud
      drawNetworkCloud(canvas.width / 2, centerY, 150, 80)

      // Connection lines
      ctx.beginPath()
      ctx.moveTo(senderX + 25, centerY)
      ctx.lineTo(canvas.width / 2 - 150, centerY)
      ctx.moveTo(canvas.width / 2 + 150, centerY)
      ctx.lineTo(receiverX - 25, centerY)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw packets if active
      if (isActive) {
        drawPackets(senderX, receiverX, centerY)
      }
    }

    const drawEndpoint = (x: number, y: number, color: string, label: string) => {
      // Endpoint circle
      ctx.beginPath()
      ctx.arc(x, y, 25, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Endpoint label
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x, y)
    }

    const drawNetworkCloud = (x: number, y: number, width: number, height: number) => {
      // Cloud background
      ctx.beginPath()
      ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#f3f4f6"
      ctx.fill()
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.stroke()

      // Cloud label
      ctx.fillStyle = "#6b7280"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Network", x, y - 15)

      // Network conditions
      const time = Date.now() / 1000
      const congestion = Math.sin(time) * 0.4 + 0.5
      const congestionColor = getCongestionColor(congestion)

      ctx.fillStyle = "#6b7280"
      ctx.font = "12px sans-serif"
      ctx.fillText(`Congestion: `, x - 20, y + 10)

      ctx.fillStyle = congestionColor
      ctx.font = "bold 12px sans-serif"
      ctx.fillText(`${Math.round(congestion * 100)}%`, x + 30, y + 10)
    }

    const getCongestionColor = (congestion: number) => {
      if (congestion < 0.3) return "#10b981" // Green for low congestion
      if (congestion < 0.7) return "#f59e0b" // Yellow for medium congestion
      return "#ef4444" // Red for high congestion
    }

    const drawPackets = (senderX: number, receiverX: number, centerY: number) => {
      const time = Date.now() / 1000

      // Traditional TCP packets (top)
      const tcpY = centerY - 15
      const tcpPacketCount = 3

      for (let i = 0; i < tcpPacketCount; i++) {
        const offset = (time * 0.3 + i / tcpPacketCount) % 1
        const x = senderX + (receiverX - senderX) * offset

        // Packet
        ctx.beginPath()
        ctx.arc(x, tcpY, 6, 0, Math.PI * 2)
        ctx.fillStyle = "#3b82f6"
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 1
        ctx.stroke()

        // Packet label
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 8px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("T", x, tcpY)
      }

      // AI-powered packets (bottom)
      const aiY = centerY + 15
      const aiPacketCount = 5

      for (let i = 0; i < aiPacketCount; i++) {
        // AI adapts to network conditions
        const congestion = Math.sin(time) * 0.4 + 0.5
        const adaptiveSpeed = 0.3 + (1 - congestion) * 0.3

        const offset = (time * adaptiveSpeed + i / aiPacketCount) % 1
        const x = senderX + (receiverX - senderX) * offset

        // Packet
        ctx.beginPath()
        ctx.arc(x, aiY, 6, 0, Math.PI * 2)
        ctx.fillStyle = "#8b5cf6"
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 1
        ctx.stroke()

        // Packet label
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 8px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("AI", x, aiY)
      }

      // Labels
      ctx.fillStyle = "#3b82f6"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Traditional TCP", senderX + 30, tcpY - 15)

      ctx.fillStyle = "#8b5cf6"
      ctx.font = "12px sans-serif"
      ctx.fillText("AI-Powered TCP", senderX + 30, aiY + 20)
    }

    const drawAiModel = () => {
      const startY = 250
      const width = canvas.width - 200
      const height = 120
      const x = canvas.width / 2

      // AI model title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("AI Model Architecture", x, startY - 10)

      // AI model background
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(x - width / 2, startY, width, height)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.strokeRect(x - width / 2, startY, width, height)

      // Draw neural network
      drawNeuralNetwork(x, startY + height / 2, width * 0.8, height * 0.7)

      // Input and output labels
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"

      // Inputs
      ctx.fillText("Inputs", x - width * 0.4, startY + height + 20)
      ctx.font = "12px sans-serif"
      ctx.fillText("RTT, Bandwidth, Loss Rate, Jitter", x - width * 0.4, startY + height + 40)

      // Outputs
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.fillText("Outputs", x + width * 0.4, startY + height + 20)
      ctx.font = "12px sans-serif"
      ctx.fillText("Congestion Window, Pacing Rate", x + width * 0.4, startY + height + 40)
    }

    const drawNeuralNetwork = (x: number, y: number, width: number, height: number) => {
      const layers = 4
      const nodesPerLayer = [4, 6, 6, 2]
      const layerSpacing = width / (layers - 1)

      // Draw nodes
      for (let layer = 0; layer < layers; layer++) {
        const layerX = x - width / 2 + layer * layerSpacing
        const nodeCount = nodesPerLayer[layer]
        const nodeSpacing = height / (nodeCount - 1)

        for (let node = 0; node < nodeCount; node++) {
          const nodeY = y - height / 2 + node * nodeSpacing

          // Node
          ctx.beginPath()
          ctx.arc(layerX, nodeY, 6, 0, Math.PI * 2)
          ctx.fillStyle = "#8b5cf6"
          ctx.fill()

          // Connect to previous layer
          if (layer > 0) {
            const prevNodeCount = nodesPerLayer[layer - 1]
            const prevLayerX = layerX - layerSpacing
            const prevNodeSpacing = height / (prevNodeCount - 1)

            for (let prevNode = 0; prevNode < prevNodeCount; prevNode++) {
              const prevNodeY = y - height / 2 + prevNode * prevNodeSpacing

              ctx.beginPath()
              ctx.moveTo(prevLayerX, prevNodeY)
              ctx.lineTo(layerX, nodeY)
              ctx.strokeStyle = "#d1d5db"
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        }
      }

      // Animate data flow if active
      if (isActive) {
        const time = Date.now() / 1000

        for (let layer = 0; layer < layers - 1; layer++) {
          const layerX = x - width / 2 + layer * layerSpacing
          const nextLayerX = layerX + layerSpacing

          const nodeCount = nodesPerLayer[layer]
          const nextNodeCount = nodesPerLayer[layer + 1]

          for (let i = 0; i < 3; i++) {
            const offset = (time + i / 3) % 1

            // Random source and target nodes
            const sourceNode = Math.floor((Math.sin(time * 2 + i) * nodeCount) / 2 + nodeCount / 2)
            const targetNode = Math.floor((Math.cos(time * 2 + i) * nextNodeCount) / 2 + nextNodeCount / 2)

            const sourceY = y - height / 2 + Math.min(nodeCount - 1, sourceNode) * (height / (nodeCount - 1))
            const targetY = y - height / 2 + Math.min(nextNodeCount - 1, targetNode) * (height / (nextNodeCount - 1))

            const pulseX = layerX + (nextLayerX - layerX) * offset
            const pulseY = sourceY + (targetY - sourceY) * offset

            // Pulse
            ctx.beginPath()
            ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2)
            ctx.fillStyle = "#8b5cf688"
            ctx.fill()
          }
        }
      }
    }

    const drawPerformanceComparison = () => {
      const startY = 400
      const width = canvas.width - 200
      const height = 80
      const x = canvas.width / 2

      // Performance title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Performance Comparison", x, startY - 10)

      // Draw throughput graph
      drawPerformanceGraph(x - width / 4, startY, width / 2 - 20, height, "Throughput (Mbps)", isActive)

      // Draw latency graph
      drawPerformanceGraph(x + width / 4, startY, width / 2 - 20, height, "Latency (ms)", isActive)
    }

    const drawPerformanceGraph = (
      x: number,
      y: number,
      width: number,
      height: number,
      label: string,
      animate: boolean,
    ) => {
      // Graph background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(x - width / 2, y, width, height)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
      ctx.strokeRect(x - width / 2, y, width, height)

      // Graph label
      ctx.fillStyle = "#1f2937"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x, y - 5)

      // X and Y axes
      ctx.beginPath()
      ctx.moveTo(x - width / 2, y + height)
      ctx.lineTo(x + width / 2, y + height)
      ctx.moveTo(x - width / 2, y)
      ctx.lineTo(x - width / 2, y + height)
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 1
      ctx.stroke()

      // X-axis label
      ctx.fillStyle = "#6b7280"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Time", x, y + height + 15)

      // Draw performance lines
      if (animate) {
        const time = Date.now() / 1000
        const pointCount = 20

        // Traditional TCP line
        ctx.beginPath()

        for (let i = 0; i < pointCount; i++) {
          const pointX = x - width / 2 + (width / pointCount) * i

          // Different behavior for throughput vs latency
          let value
          if (label.includes("Throughput")) {
            // Throughput: TCP has lower and more variable throughput
            value = 0.4 + Math.sin(time * 2 + i * 0.5) * 0.3
          } else {
            // Latency: TCP has higher and more variable latency
            value = 0.6 + Math.sin(time * 2 + i * 0.5) * 0.3
          }

          const pointY = y + height - height * value

          if (i === 0) {
            ctx.moveTo(pointX, pointY)
          } else {
            ctx.lineTo(pointX, pointY)
          }
        }

        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()

        // AI-powered TCP line
        ctx.beginPath()

        for (let i = 0; i < pointCount; i++) {
          const pointX = x - width / 2 + (width / pointCount) * i

          // Different behavior for throughput vs latency
          let value
          if (label.includes("Throughput")) {
            // Throughput: AI has higher and more stable throughput
            value = 0.7 + Math.sin(time + i * 0.2) * 0.1
          } else {
            // Latency: AI has lower and more stable latency
            value = 0.3 + Math.sin(time + i * 0.2) * 0.1
          }

          const pointY = y + height - height * value

          if (i === 0) {
            ctx.moveTo(pointX, pointY)
          } else {
            ctx.lineTo(pointX, pointY)
          }
        }

        ctx.strokeStyle = "#8b5cf6"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Legend
      const legendY = y + height - 15

      // Traditional TCP
      ctx.beginPath()
      ctx.moveTo(x - width / 2 + 10, legendY)
      ctx.lineTo(x - width / 2 + 30, legendY)
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "#1f2937"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("TCP", x - width / 2 + 35, legendY + 3)

      // AI-powered TCP
      ctx.beginPath()
      ctx.moveTo(x - width / 2 + 60, legendY)
      ctx.lineTo(x - width / 2 + 80, legendY)
      ctx.strokeStyle = "#8b5cf6"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "#1f2937"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("AI-TCP", x - width / 2 + 85, legendY + 3)
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      if (!isActive) {
        cancelAnimationFrame(animationId)
        return
      }

      drawAiPoweredControl()
      animationId = requestAnimationFrame(animate)
    }

    // Start/stop animation based on isActive
    if (isActive) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Draw static view when not active
      drawAiPoweredControl()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [isActive])

  return <canvas ref={canvasRef} className="w-full h-[500px] rounded-md" />
}

